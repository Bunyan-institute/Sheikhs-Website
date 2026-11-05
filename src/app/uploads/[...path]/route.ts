import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { getUploadData, isSafeFilename, mimeFromFilename, uploadDir } from "@/lib/uploads";

export const runtime = "nodejs";

/** Serves admin uploads with HTTP Range support (needed for audio/video seeking). */
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const filename = segments.length === 1 ? segments[0] : "";
  const mime = isSafeFilename(filename) ? mimeFromFilename(filename) : null;
  if (!mime) return new Response("Not found", { status: 404 });

  const filePath = path.join(uploadDir(), filename);
  let stat: fs.Stats | null = null;
  try {
    const st = fs.statSync(filePath);
    if (st.isFile()) stat = st;
  } catch {
    // not on disk: it may live in the database (serverless hosting)
  }
  const stored = stat ? null : await getUploadData(filename);
  if (!stat && !stored) return new Response("Not found", { status: 404 });
  const size = stat ? stat.size : stored!.data.length;

  const headers: Record<string, string> = {
    "Content-Type": mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  const range = req.headers.get("range");
  const match = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (match) {
    let start = match[1] === "" ? NaN : Number(match[1]);
    let end = match[2] === "" ? NaN : Number(match[2]);
    if (Number.isNaN(start)) {
      // Suffix range: last N bytes
      start = Math.max(0, size - end);
      end = size - 1;
    } else if (Number.isNaN(end) || end >= size) {
      end = size - 1;
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const body = stored
      ? new Uint8Array(stored.data.subarray(start, end + 1))
      : (Readable.toWeb(fs.createReadStream(filePath, { start, end })) as ReadableStream);
    return new Response(body as BodyInit, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response((stored ? new Uint8Array(stored.data) : Readable.toWeb(fs.createReadStream(filePath))) as BodyInit, {
    headers: { ...headers, "Content-Length": String(size) },
  });
}
