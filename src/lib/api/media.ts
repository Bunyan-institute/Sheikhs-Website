import { getAllMedia } from "@/lib/db/repository";
import { getLectures } from "./lectures";
import { getLibrary } from "./library";

export interface MediaItem {
  id: string;
  title: string;
  kind: "video" | "audio" | "document" | "image";
  url: string | null;
  thumbnail_url: string | null;
  description?: string | null;
}

/** Everything shown on /media: lecture audio/video, library documents and admin-managed gallery assets. */
export async function getMedia(params?: { locale?: string }): Promise<MediaItem[]> {
  const [lectures, library, assets] = await Promise.all([
    getLectures({ locale: params?.locale }),
    getLibrary({ locale: params?.locale }),
    getAllMedia(),
  ]);

  const items: MediaItem[] = [];

  for (const lec of lectures.data) {
    if (lec.media.video) {
      items.push({ id: `${lec.id}-video`, title: lec.title, kind: "video", url: lec.media.video, thumbnail_url: lec.cover?.url ?? null, description: lec.summary });
    }
    if (lec.media.audio) {
      items.push({ id: `${lec.id}-audio`, title: lec.title, kind: "audio", url: lec.media.audio, thumbnail_url: lec.cover?.url ?? null, description: lec.summary });
    }
  }

  // Gallery assets with a title are public gallery entries; bare ones are only cover/file references.
  for (const m of assets) {
    if (!m.title) continue;
    items.push({
      id: m.id,
      title: m.title,
      kind: m.kind,
      url: m.url,
      thumbnail_url: m.thumbnail_url ?? (m.kind === "image" ? m.url : null),
      description: m.description,
    });
  }

  for (const book of library.data) {
    items.push({ id: book.id, title: book.title, kind: "document", url: book.file?.url ?? book.external_url ?? null, thumbnail_url: book.cover?.url ?? null, description: book.summary });
  }

  return items;
}
