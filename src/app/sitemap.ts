import type { MetadataRoute } from "next";
import {
  getAllArticles,
  getAllFatwas,
  getAllCourses,
  getAllLectures,
  getAllBooks,
  getAllSeries,
  getAllEvents,
} from "@/lib/db/repository";
import { getLocalizedUrl, buildSitemapAlternates } from "@/lib/seo";
import { locales } from "@/i18n/config";

// Cache generated sitemap for 1 hour at edge CDN for instant crawl responses
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coreRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/fatwas", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/articles", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/courses", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/media", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/series", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/events", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/qualifications", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/journey", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/ask", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const buildAlternates = (subpath: string) => ({
    languages: buildSitemapAlternates(subpath),
  });

  const entries: MetadataRoute.Sitemap = [];

  // 1. Add core routes for all locales (strictly using getLocalizedUrl so 'en' has no /en prefix)
  for (const route of coreRoutes) {
    for (const locale of locales) {
      entries.push({
        url: getLocalizedUrl(route.path, locale),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: locale === "am" ? route.priority : Number((route.priority * 0.95).toFixed(2)),
        alternates: buildAlternates(route.path),
      });
    }
  }

  const isPublished = (item: { status?: string }) => item.status === "published" || item.status === undefined;
  const parseDate = (d?: string | null) => (d ? new Date(d) : new Date());

  try {
    const [fatwas, articles, courses, lectures, books, seriesList, events] = await Promise.all([
      getAllFatwas(),
      getAllArticles(),
      getAllCourses(),
      getAllLectures(),
      getAllBooks(),
      getAllSeries(),
      getAllEvents(),
    ]);

    // 2. Fatwas (deep Q&A ruling index)
    for (const fatwa of fatwas.filter(isPublished)) {
      if (!fatwa.slug) continue;
      const subpath = `/fatwas/${fatwa.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(fatwa.updated_at || fatwa.published_at),
          changeFrequency: "weekly",
          priority: 0.9,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 3. Articles
    for (const article of articles.filter(isPublished)) {
      if (!article.slug) continue;
      const subpath = `/articles/${article.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(article.updated_at || article.published_at),
          changeFrequency: "weekly",
          priority: 0.85,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 4. Courses
    for (const course of courses.filter(isPublished)) {
      if (!course.slug) continue;
      const subpath = `/courses/${course.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(course.updated_at || course.published_at),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 5. Lectures
    for (const lecture of lectures.filter(isPublished)) {
      if (!lecture.slug) continue;
      const subpath = `/lectures/${lecture.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(lecture.updated_at || lecture.published_at),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 6. Books
    for (const book of books.filter(isPublished)) {
      if (!book.slug) continue;
      const subpath = `/library/${book.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(book.updated_at || book.published_at),
          changeFrequency: "monthly",
          priority: 0.75,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 7. Series
    for (const s of seriesList.filter(isPublished)) {
      if (!s.slug) continue;
      const subpath = `/series/${s.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(s.updated_at || s.published_at),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 8. Events
    for (const ev of events.filter(isPublished)) {
      if (!ev.slug) continue;
      const subpath = `/events/${ev.slug}`;
      for (const locale of locales) {
        entries.push({
          url: getLocalizedUrl(subpath, locale),
          lastModified: parseDate(ev.updated_at || ev.published_at),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: buildAlternates(subpath),
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch published entities for sitemap:", err);
  }

  return entries;
}
