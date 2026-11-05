import type { ListResponse, PublicEvent } from "./types";
import { getAllEvents, getEventByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";

export async function getEvents(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string; from?: string; to?: string } = {}): Promise<ListResponse<PublicEvent>> {
  return toList(filterTaxonomy(published(await getAllEvents()), params));
}

export async function getEvent(reference: string, _locale?: string): Promise<PublicEvent> {
  return orThrow(publishedOnly(await getEventByIdOrSlug(reference)), "Event", reference);
}
