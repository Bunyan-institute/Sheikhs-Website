import { cache } from "react";
import { getAllSeries } from "@/lib/db/repository";
import { getMedia } from "./media";
import type { PublicSeries } from "./types";
import { publicPlaylists, unassignedAudio } from "../playlists";

// Request-local reuse: the media page and playlist catalogue share the same reads.
export const getPlaylists = cache(async (locale: string): Promise<PublicSeries[]> => {
  const [series, media] = await Promise.all([getAllSeries(), getMedia({ locale })]);
  const playlists = publicPlaylists(series, locale);
  const loose = unassignedAudio(media, playlists);
  if (loose.length) {
    const title = locale === "am" ? "ሌሎች የድምፅ ትምህርቶች" : locale === "ar" ? "دروس صوتية أخرى" : locale === "om" ? "Darsii Sagalee Biroo" : "Other Audio Lessons";
    playlists.push({
      object: "series", id: "other-audio", slug: "other-audio", title,
      description: null, locale, direction: locale === "ar" ? "rtl" : "ltr", cover: null,
      lecture_count: loose.length, published_at: null, updated_at: "",
      lectures: loose.map((m) => ({
        object: "lecture", id: m.id, slug: "", title: m.title, summary: m.description ?? null,
        locale, direction: locale === "ar" ? "rtl" : "ltr", cover: null,
        duration_seconds: null, published_at: null, updated_at: "",
        media: { audio: m.url, video: null, transcript: null }, series: null, categories: [], tags: [],
      })),
    });
  }
  return publicPlaylists(playlists, locale);
});

export const getPlaylist = cache(async (slug: string, locale: string) =>
  (await getPlaylists(locale)).find((p) => p.slug === slug || p.id === slug) ?? null
);
