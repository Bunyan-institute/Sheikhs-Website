import type { ListResponse } from "./types";

export interface ListFilter {
  category?: string[];
  tag?: string[];
}

export function toList<T>(data: T[]): ListResponse<T> {
  return { object: "list", data, has_more: false, next_cursor: null };
}

/** Keeps items matching any requested category/tag (no filter = everything). */
export function filterTaxonomy<T extends { categories: string[]; tags: string[] }>(list: T[], f: ListFilter): T[] {
  let out = list;
  if (f.category?.length) out = out.filter((i) => i.categories.some((c) => f.category!.includes(c)));
  if (f.tag?.length) out = out.filter((i) => i.tags.some((t) => f.tag!.includes(t)));
  return out;
}

export function orThrow<T>(item: T | null, label: string, reference: string): T {
  if (!item) throw new Error(`${label} ${reference} not found`);
  return item;
}

/** Public site only shows published content; drafts stay visible in the admin. */
export function published<T extends { status?: string }>(list: T[]): T[] {
  return list.filter((i) => i.status !== "draft");
}

export function publishedOnly<T extends { status?: string }>(item: T | null): T | null {
  return item && item.status !== "draft" ? item : null;
}
