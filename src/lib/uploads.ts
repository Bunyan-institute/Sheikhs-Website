import fs from "fs";
import path from "path";
import crypto from "crypto";
import { dialect, execute, queryAll, queryOne } from "@/lib/db/client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";

/**
 * Where uploaded files are kept. Serverless hosts (Vercel) have no persistent disk, so on Postgres
 * there the bytes go into the database (small files only: the platform caps request bodies at ~4.5 MB).
 * Override with UPLOAD_STORAGE=database | filesystem.
 */
export function useDatabaseStorage(): boolean {
  const mode = process.env.UPLOAD_STORAGE;
  if (mode === "database") return true;
  if (mode === "filesystem") return false;
  return dialect === "postgres" && Boolean(process.env.VERCEL);
}

export const maxUploadBytes = () => Number(process.env.MAX_UPLOAD_MB || (useDatabaseStorage() ? 4 : 500)) * 1024 * 1024;

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
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  const standard = path.join(process.cwd(), "data", "uploads");
  if (fs.existsSync(standard)) return standard;
  try {
    fs.mkdirSync(standard, { recursive: true });
    return standard;
  } catch {
    const tmp = path.join("/tmp", "uploads");
    try {
      fs.mkdirSync(tmp, { recursive: true });
    } catch {
      // ignore
    }
    return tmp;
  }
}

/** Creates the upload directory; only called when a file is about to be written. */
export function ensureUploadDir(): string {
  const dir = uploadDir();
  try {
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  } catch {
    const tmp = path.join("/tmp", "uploads");
    try {
      fs.mkdirSync(tmp, { recursive: true });
    } catch {
      // ignore
    }
    return tmp;
  }
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

// Never select the binary column when listing.
const LIST_COLUMNS = "id, filename, original_name, mime_type, size, width, height, created_at";

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
  data?: Buffer;
}): Promise<UploadRecord> {
  await ensureTablesExist();
  const id = `upl_${crypto.randomBytes(6).toString("hex")}`;
  const createdAt = new Date().toISOString();
  await execute(
    "INSERT INTO uploads (id, filename, original_name, mime_type, size, width, height, created_at, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [id, input.filename, input.originalName.slice(0, 200), input.mime, input.size, input.width ?? null, input.height ?? null, createdAt, input.data ?? null]
  );
  const row = await queryOne<Record<string, unknown>>(`SELECT ${LIST_COLUMNS} FROM uploads WHERE id = ?;`, [id]);
  return toRecord(row!);
}

export async function listUploads(): Promise<UploadRecord[]> {
  await ensureTablesExist();
  return (await queryAll<Record<string, unknown>>(`SELECT ${LIST_COLUMNS} FROM uploads ORDER BY created_at DESC;`)).map(toRecord);
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

/** Bytes of an upload stored in the database, or null when it is not (or no longer) there. */
export async function getUploadData(filename: string): Promise<{ data: Buffer; mime: string } | null> {
  await ensureTablesExist();
  const row = await queryOne<Record<string, unknown>>("SELECT data, mime_type FROM uploads WHERE filename = ?;", [filename]);
  if (!row?.data) return null;
  return { data: Buffer.from(row.data as Uint8Array), mime: String(row.mime_type) };
}
