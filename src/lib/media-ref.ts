import crypto from "crypto";
import { queryOne } from "@/lib/db/sqlite-client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";
import { mimeFromFilename } from "@/lib/uploads";
import type { MediaRef } from "@/lib/api/types";

const EXTERNAL_MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
  ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".ogg": "audio/ogg", ".wav": "audio/wav",
  ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf",
};

/**
 * Builds a MediaRef for a URL entered in the admin. Uploaded files use the stored mime type and
 * real image dimensions; other URLs get a mime type from the extension (or a neutral default).
 * Returns null for an empty URL.
 */
export async function mediaRefFromUrl(
  rawUrl: string | undefined | null,
  kind: MediaRef["kind"] = "image",
  extra: Partial<Pick<MediaRef, "id" | "title" | "description" | "thumbnail_url">> = {}
): Promise<MediaRef | null> {
  const url = rawUrl?.trim();
  if (!url) return null;

  let mime: string | null = null;
  let width: number | null = null;
  let height: number | null = null;

  if (url.startsWith("/uploads/")) {
    await ensureTablesExist();
    const row = await queryOne<Record<string, unknown>>("SELECT mime_type, width, height FROM uploads WHERE filename = ?;", [url.slice("/uploads/".length)]);
    if (row) {
      mime = String(row.mime_type);
      width = row.width == null ? null : Number(row.width);
      height = row.height == null ? null : Number(row.height);
    } else {
      mime = mimeFromFilename(url);
    }
  } else {
    const ext = /\.[a-z0-9]{2,5}(?:$|[?#])/i.exec(url)?.[0].replace(/[?#]$/, "").toLowerCase();
    mime = (ext && EXTERNAL_MIME[ext]) || null;
  }

  return {
    object: "media",
    id: extra.id ?? `med_${crypto.randomBytes(5).toString("hex")}`,
    kind,
    url,
    mime_type: mime ?? "application/octet-stream",
    width,
    height,
    duration_seconds: null,
    ...(extra.title !== undefined && { title: extra.title }),
    ...(extra.description !== undefined && { description: extra.description }),
    ...(extra.thumbnail_url !== undefined && { thumbnail_url: extra.thumbnail_url }),
  };
}
