import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { isSafeFilename, mimeFromFilename, uploadDir } from "@/lib/uploads";

export const runtime = "nodejs";

/** Serves admin uploads with HTTP Range support (needed for audio/video seeking). */
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const filename = segments.length === 1 ? segments[0] : "";
  const mime = isSafeFilename(filename) ? mimeFromFilename(filename) : null;
  if (!mime) return new Response("Not found", { status: 404 });

  const filePath = path.join(uploadDir(), filename);
  let stat: fs.Stats;
  try {
    stat = fs.statSync(filePath);
    if (!stat.isFile()) throw new Error("not a file");
  } catch {
    return new Response("Not found", { status: 404 });
  }

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
      start = Math.max(0, stat.size - end);
      end = stat.size - 1;
    } else if (Number.isNaN(end) || end >= stat.size) {
      end = stat.size - 1;
    }
    if (start > end || start >= stat.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${stat.size}` } });
    }
    return new Response(Readable.toWeb(fs.createReadStream(filePath, { start, end })) as ReadableStream, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream, {
    headers: { ...headers, "Content-Length": String(stat.size) },
  });
}
