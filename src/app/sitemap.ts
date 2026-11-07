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
import { getSiteUrl } from "@/lib/seo";
import { locales } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const coreRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/fatwas", changeFrequency: "daily" as const, priority: 0.95 },
    { path: "/articles", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/courses", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/lectures", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/library", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/series", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/events", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/media", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/qualifications", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/journey", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/ask", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/verify", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const buildAlternates = (subpath: string) => {
    const clean = subpath.replace(/^\/+/, "");
    const suffix = clean ? `/${clean}` : "";
    return {
      languages: {
        en: `${siteUrl}/en${suffix}`,
        ar: `${siteUrl}/ar${suffix}`,
        am: `${siteUrl}/am${suffix}`,
        om: `${siteUrl}/om${suffix}`,
        "x-default": `${siteUrl}${suffix ? `/${clean}` : ""}`,
      },
    };
  };

  const entries: MetadataRoute.Sitemap = [];

  // 1. Add core routes for all locales
  for (const route of coreRoutes) {
    for (const locale of locales) {
      const url = `${siteUrl}/${locale}${route.path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: locale === "am" ? route.priority : Number((route.priority * 0.95).toFixed(2)),
        alternates: buildAlternates(route.path),
      });
    }
  }

  // Helper for published dynamic content
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

    // 2. Fatwas (high SEO priority)
    for (const fatwa of fatwas.filter(isPublished)) {
      if (!fatwa.slug) continue;
      const subpath = `/fatwas/${fatwa.slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}${subpath}`,
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
          url: `${siteUrl}/${locale}${subpath}`,
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
          url: `${siteUrl}/${locale}${subpath}`,
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
          url: `${siteUrl}/${locale}${subpath}`,
          lastModified: parseDate(lecture.updated_at || lecture.published_at),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 6. Library Books
    for (const book of books.filter(isPublished)) {
      if (!book.slug) continue;
      const subpath = `/library/${book.slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}${subpath}`,
          lastModified: parseDate(book.updated_at || book.published_at),
          changeFrequency: "monthly",
          priority: 0.75,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 7. Series
    for (const series of seriesList) {
      if (!series.slug) continue;
      const subpath = `/series/${series.slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}${subpath}`,
          lastModified: parseDate(series.updated_at),
          changeFrequency: "weekly",
          priority: 0.75,
          alternates: buildAlternates(subpath),
        });
      }
    }

    // 8. Events
    for (const event of events.filter(isPublished)) {
      if (!event.slug) continue;
      const subpath = `/events/${event.slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}${subpath}`,
          lastModified: parseDate(event.updated_at),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: buildAlternates(subpath),
        });
      }
    }
  } catch (err) {
    console.error("[sitemap] Failed to fetch dynamic content for sitemap:", err);
  }

  return entries;
}
