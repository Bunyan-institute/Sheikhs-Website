import { bunyan } from "./client";
import type { ListResponse, PublicLecture } from "./types";
import contentStore from "../../../data/content-store.json";
import { getAllLectures, getLectureByIdOrSlug } from "@/lib/db/repository";

export interface LectureListParams {
  limit?: string;
  cursor?: string;
  locale?: string;
  category?: string[];
  tag?: string[];
  sort?: string;
  series?: string;
  published_after?: string;
}

export const AUTHENTIC_LECTURES: PublicLecture[] = (contentStore.lectures || []) as PublicLecture[];

export async function getLectures(params: LectureListParams = {}): Promise<ListResponse<PublicLecture>> {
  try {
    let list = getAllLectures();
    if (params.series) {
      list = list.filter((l) => l.series?.id === params.series);
    }
    if (params.category && params.category.length > 0) {
      list = list.filter((l) => l.categories.some((c) => params.category!.includes(c)));
    }
    return {
      object: "list",
      data: list,
      has_more: false,
      next_cursor: null,
    };
  } catch {
    return {
      object: "list",
      data: AUTHENTIC_LECTURES,
      has_more: false,
      next_cursor: null,
    };
  }
}

export async function getLecture(reference: string, locale?: string): Promise<PublicLecture> {
  try {
    const found = getLectureByIdOrSlug(reference);
    if (found) {
      return found;
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_LECTURES.find(
    (l) => l.slug === reference || l.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Lecture ${reference} not found`);
}
