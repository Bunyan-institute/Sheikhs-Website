import fs from "fs";
import path from "path";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  ALLOWED_UPLOAD_TYPES,
  maxUploadBytes,
  useDatabaseStorage,
  deleteUpload,
  listUploads,
  newStoredFilename,
  recordUpload,
  ensureUploadDir,
} from "@/lib/uploads";

export const runtime = "nodejs";

async function requireAdmin() {
  return (await getSessionUser()) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Raw-body upload: PUT /api/admin/upload?name=<original filename>[&w=&h=] with the file as the body. */
export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const originalName = (url.searchParams.get("name") || "upload").slice(0, 200);
  const mime = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_UPLOAD_TYPES[mime]) {
    return NextResponse.json({ error: `Unsupported file type: ${mime || "unknown"}` }, { status: 415 });
  }
  const maxBytes = maxUploadBytes();
  const tooLarge = () =>
    NextResponse.json({ error: `File is too large (limit ${Math.round(maxBytes / 1024 / 1024)} MB on this server).` }, { status: 413 });
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > maxBytes) return tooLarge();
  if (!req.body) {
    return NextResponse.json({ error: "Empty upload." }, { status: 400 });
  }

  const filename = newStoredFilename(originalName, mime);
  const num = (v: string | null) => (v && /^\d{1,5}$/.test(v) ? Number(v) : null);

  // Serverless hosting: keep the file in the database instead of on a (read-only) disk.
  if (useDatabaseStorage()) {
    const data = Buffer.from(await req.arrayBuffer());
    if (data.length === 0) return NextResponse.json({ error: "Empty upload." }, { status: 400 });
    if (data.length > maxBytes) return tooLarge();
    const record = await recordUpload({
      filename, originalName, mime, size: data.length, data,
      width: num(url.searchParams.get("w")), height: num(url.searchParams.get("h")),
    });
    return NextResponse.json(record, { status: 201 });
  }

  const target = path.join(ensureUploadDir(), filename);
  let size = 0;
  const limiter = new Transform({
    transform(chunk, _enc, cb) {
      size += chunk.length;
      if (size > maxBytes) return cb(new Error("TOO_LARGE"));
      cb(null, chunk);
    },
  });

  try {
    await pipeline(Readable.fromWeb(req.body as never), limiter, fs.createWriteStream(target));
    if (size === 0) throw new Error("EMPTY");
  } catch (err) {
    fs.rmSync(target, { force: true });
    const code = err instanceof Error ? err.message : "";
    if (code === "TOO_LARGE") return tooLarge();
    if (code === "EMPTY") return NextResponse.json({ error: "Empty upload." }, { status: 400 });
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  const record = await recordUpload({
    filename,
    originalName,
    mime,
    size,
    width: num(url.searchParams.get("w")),
    height: num(url.searchParams.get("h")),
  });
  return NextResponse.json(record, { status: 201 });
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ uploads: await listUploads() });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  return NextResponse.json({ success: await deleteUpload(id) });
}
