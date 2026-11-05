import type { ListResponse, PublicBook } from "./types";
import { getAllBooks, getBookByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";

export async function getLibrary(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicBook>> {
  return toList(filterTaxonomy(published(await getAllBooks()), params));
}

export async function getLibraryItem(reference: string, _locale?: string): Promise<PublicBook> {
  return orThrow(publishedOnly(await getBookByIdOrSlug(reference)), "Library item", reference);
}
