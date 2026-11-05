import type { ListResponse, PublicSeries } from "./types";
import { getAllSeries, getSeriesByIdOrSlug } from "@/lib/db/repository";
import { orThrow, published, publishedOnly, toList } from "./list";

export async function getSeriesList(_params: { limit?: string; cursor?: string; locale?: string; sort?: string } = {}): Promise<ListResponse<PublicSeries>> {
  return toList(published(await getAllSeries()).map((s) => ({ ...s, lectures: published(s.lectures ?? []), lecture_count: published(s.lectures ?? []).length })));
}

export async function getSeriesDetail(reference: string, _locale?: string): Promise<PublicSeries> {
  const series = orThrow(publishedOnly(await getSeriesByIdOrSlug(reference)), "Series", reference);
  return { ...series, lectures: published(series.lectures ?? []), lecture_count: published(series.lectures ?? []).length };
}
