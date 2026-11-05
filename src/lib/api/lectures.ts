import type { ListResponse, PublicLecture } from "./types";
import { getAllLectures, getLectureByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";

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

export async function getLectures(params: LectureListParams = {}): Promise<ListResponse<PublicLecture>> {
  let list = published(await getAllLectures());
  if (params.series) list = list.filter((l) => l.series?.id === params.series);
  return toList(filterTaxonomy(list, params));
}

export async function getLecture(reference: string, _locale?: string): Promise<PublicLecture> {
  return orThrow(publishedOnly(await getLectureByIdOrSlug(reference)), "Lecture", reference);
}
