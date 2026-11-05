import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execute, queryAll, queryOne } from "@/lib/db/sqlite-client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 500) * 1024 * 1024;

/** Only inert media types. SVG and HTML are excluded on purpose (script execution). */
export const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".m4a",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

const TYPE_BY_EXT = Object.fromEntries(Object.entries(ALLOWED_UPLOAD_TYPES).map(([mime, ext]) => [ext, mime]));
TYPE_BY_EXT[".jpeg"] = "image/jpeg";

export function uploadDir(): string {
  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function mimeFromFilename(filename: string): string | null {
  return TYPE_BY_EXT[path.extname(filename).toLowerCase()] ?? null;
}

export const isSafeFilename = (name: string) => /^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/.test(name) && !name.includes("..");

export interface UploadRecord {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  created_at: string;
  url: string;
}

const toRecord = (r: Record<string, unknown>): UploadRecord => ({
  id: String(r.id),
  filename: String(r.filename),
  original_name: String(r.original_name),
  mime_type: String(r.mime_type),
  size: Number(r.size),
  width: r.width == null ? null : Number(r.width),
  height: r.height == null ? null : Number(r.height),
  created_at: String(r.created_at),
  url: `/uploads/${r.filename}`,
});

/** Picks a collision-free stored filename, keeping a readable slug of the original name. */
export function newStoredFilename(originalName: string, mime: string): string {
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${crypto.randomBytes(6).toString("hex")}${base ? "-" + base : ""}${ALLOWED_UPLOAD_TYPES[mime]}`;
}

export async function recordUpload(input: {
  filename: string;
  originalName: string;
  mime: string;
  size: number;
  width?: number | null;
  height?: number | null;
}): Promise<UploadRecord> {
  await ensureTablesExist();
  const id = `upl_${crypto.randomBytes(6).toString("hex")}`;
  const createdAt = new Date().toISOString();
  await execute(
    "INSERT INTO uploads (id, filename, original_name, mime_type, size, width, height, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
    [id, input.filename, input.originalName.slice(0, 200), input.mime, input.size, input.width ?? null, input.height ?? null, createdAt]
  );
  const row = await queryOne<Record<string, unknown>>("SELECT * FROM uploads WHERE id = ?;", [id]);
  return toRecord(row!);
}

export async function listUploads(): Promise<UploadRecord[]> {
  await ensureTablesExist();
  return (await queryAll<Record<string, unknown>>("SELECT * FROM uploads ORDER BY created_at DESC;")).map(toRecord);
}

export async function deleteUpload(id: string): Promise<boolean> {
  await ensureTablesExist();
  const row = await queryOne<Record<string, unknown>>("SELECT filename FROM uploads WHERE id = ?;", [id]);
  if (!row) return false;
  await execute("DELETE FROM uploads WHERE id = ?;", [id]);
  try {
    fs.unlinkSync(path.join(uploadDir(), String(row.filename)));
  } catch {
    // File already gone
  }
  return true;
}
