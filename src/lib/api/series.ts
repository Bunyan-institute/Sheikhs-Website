import { bunyan } from "./client";
import type { ListResponse, PublicSeries } from "./types";
import { AUTHENTIC_LECTURES } from "./lectures";

export const AUTHENTIC_SERIES: PublicSeries[] = [
  {
    object: "series",
    id: "ser-riyadus-saliheen",
    title: "Explanation of Riyad us-Saliheen (شرح رياض الصالحين / ሪያዱ ሷሊሂን)",
    slug: "riyadus-saliheen",
    description: "A comprehensive Hadith exegesis of Riyad us-Saliheen by Imam an-Nawawi, expounded by Sheikh Muhammed Ferej Megeno on Africa TV and Darul Hadith, focusing on prophetic manners, authentic Sunnah, and character purification.",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_ser_cover",
      kind: "image",
      url: "/images/photo_11_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1270,
      height: 1280,
      duration_seconds: null,
    },
    lecture_count: 32,
    published_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-05-15T08:00:00Z",
    lectures: AUTHENTIC_LECTURES.filter((l) => l.series?.id === "ser-riyadus-saliheen"),
  },
];

import { getAllSeries, getSeriesByIdOrSlug, getAllLectures } from "@/lib/db/repository";

export async function getSeriesList(params: { limit?: string; cursor?: string; locale?: string; sort?: string } = {}): Promise<ListResponse<PublicSeries>> {
  try {
    const list = getAllSeries();
    return {
      object: "list",
      data: list,
      has_more: false,
      next_cursor: null,
    };
  } catch {
    return {
      object: "list",
      data: AUTHENTIC_SERIES,
      has_more: false,
      next_cursor: null,
    };
  }
}

export async function getSeriesDetail(reference: string, locale?: string): Promise<PublicSeries> {
  try {
    const found = getSeriesByIdOrSlug(reference);
    if (found) {
      const allLecs = getAllLectures();
      return {
        ...found,
        lectures: allLecs.filter((l) => l.series?.id === found.id || l.series?.id === found.slug),
      };
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_SERIES.find(
    (s) => s.slug === reference || s.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Series ${reference} not found`);
}
