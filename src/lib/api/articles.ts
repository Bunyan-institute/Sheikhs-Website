import type { ListResponse, PublicArticle } from "./types";
import { getAllArticles, getArticleByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";
import { localizeArticle } from "./article-translations";

export async function getArticles(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicArticle>> {
  const list = filterTaxonomy(published(await getAllArticles()), params);
  return toList(list.map((a) => localizeArticle(a, params.locale)));
}

export async function getArticle(reference: string, locale?: string): Promise<PublicArticle> {
  return localizeArticle(orThrow(publishedOnly(await getArticleByIdOrSlug(reference)), "Article", reference), locale);
}
