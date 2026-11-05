import type { ListResponse, PublicCourse } from "./types";
import { getAllCourses, getCourseByIdOrSlug } from "@/lib/db/repository";
import { filterTaxonomy, orThrow, published, publishedOnly, toList } from "./list";

export async function getCourses(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicCourse>> {
  return toList(filterTaxonomy(published(await getAllCourses()), params));
}

export async function getCourse(reference: string, _locale?: string): Promise<PublicCourse> {
  return orThrow(publishedOnly(await getCourseByIdOrSlug(reference)), "Course", reference);
}
