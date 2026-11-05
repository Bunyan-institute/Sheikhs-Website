import type { ListResponse, PublicFatwa } from "./types";
import { getAllFatwas, getFatwaByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";

export async function getFatwas(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicFatwa>> {
  return toList(filterTaxonomy(published(await getAllFatwas()), params));
}

export async function getFatwa(reference: string, _locale?: string): Promise<PublicFatwa> {
  return orThrow(publishedOnly(await getFatwaByIdOrSlug(reference)), "Fatwa", reference);
}
