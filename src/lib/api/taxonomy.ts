import type { ListResponse, PublicCategory, PublicTag } from "./types";
import { getAllArticles } from "@/lib/db/repository";
import { published, toList } from "./list";

function distinct(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/** Categories in use across articles; the name doubles as the filter slug. */
export async function getCategories(): Promise<ListResponse<PublicCategory>> {
  const articles = published(await getAllArticles());
  return toList(
    distinct(articles.flatMap((a) => a.categories)).map((name) => ({ object: "category" as const, id: name, name, slug: name, description: null }))
  );
}

export async function getTags(): Promise<ListResponse<PublicTag>> {
  const articles = published(await getAllArticles());
  return toList(
    distinct(articles.flatMap((a) => a.tags)).map((name) => ({ object: "tag" as const, id: name, name, slug: name }))
  );
}
