import type { ListResponse, SearchResult } from "./types";
import {
  getAllLectures,
  getAllArticles,
  getAllBooks,
  getAllFatwas,
  getAllCourses,
  getAllEvents,
  getAllSeries,
} from "@/lib/db/repository";
import { published, toList } from "./list";

interface Searchable {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  locale: string;
  published_at: string | null;
}

function matches(item: Searchable, q: string) {
  return (
    item.title.toLowerCase().includes(q) ||
    Boolean(item.summary?.toLowerCase().includes(q)) ||
    Boolean(item.description?.toLowerCase().includes(q))
  );
}

export async function searchContent(params: {
  q: string;
  type?: string[];
  limit?: string;
  locale?: string;
}): Promise<ListResponse<SearchResult>> {
  const q = (params.q || "").toLowerCase().trim();
  if (!q) return toList([]);

  const sources: [string, () => Promise<Searchable[]>][] = [
    ["lecture", getAllLectures],
    ["article", getAllArticles],
    ["book", getAllBooks],
    ["fatwa", getAllFatwas],
    ["course", getAllCourses],
    ["series", getAllSeries],
    ["event", getAllEvents],
  ];
  const wanted = params.type?.length ? sources.filter(([object]) => params.type!.includes(object)) : sources;

  const groups = await Promise.all(wanted.map(async ([object, load]) => ({ object, items: await load() })));
  const results: SearchResult[] = groups.flatMap(({ object, items }) =>
    published(items as (Searchable & { status?: string })[])
      .filter((item) => matches(item, q))
      .map((item) => ({
        object,
        id: item.id,
        title: item.title,
        slug: item.slug,
        summary: item.summary ?? item.description ?? null,
        locale: item.locale,
        score: 1.0,
        published_at: item.published_at,
      }))
  );

  const limit = params.limit ? Number(params.limit) : 0;
  return toList(limit > 0 ? results.slice(0, limit) : results);
}
