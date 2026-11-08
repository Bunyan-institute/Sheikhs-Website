import { NextResponse } from "next/server";
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

export const revalidate = 3600;

interface SitemapItem {
  subpath: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ name: string }> }
) {
  const { name } = await props.params;
  const section = name.replace(/\.xml$/, "");

  const isPublished = (item: { status?: string }) => item.status === "published" || item.status === undefined;
  const toIso = (d?: string | null) => (d ? new Date(d).toISOString() : new Date().toISOString());

  const items: SitemapItem[] = [];

  switch (section) {
    case "pages": {
      const coreRoutes = [
        { path: "", changefreq: "daily" as const, priority: 1.0 },
        { path: "/fatwas", changefreq: "daily" as const, priority: 0.95 },
        { path: "/articles", changefreq: "daily" as const, priority: 0.9 },
        { path: "/courses", changefreq: "weekly" as const, priority: 0.85 },
        { path: "/media", changefreq: "weekly" as const, priority: 0.85 },
        { path: "/series", changefreq: "weekly" as const, priority: 0.8 },
        { path: "/events", changefreq: "weekly" as const, priority: 0.75 },
        { path: "/about", changefreq: "monthly" as const, priority: 0.7 },
        { path: "/qualifications", changefreq: "monthly" as const, priority: 0.7 },
        { path: "/journey", changefreq: "monthly" as const, priority: 0.7 },
        { path: "/ask", changefreq: "monthly" as const, priority: 0.65 },
        { path: "/contact", changefreq: "monthly" as const, priority: 0.6 },
      ];
      for (const r of coreRoutes) {
        items.push({
          subpath: r.path,
          lastmod: new Date().toISOString(),
          changefreq: r.changefreq,
          priority: r.priority,
        });
      }
      break;
    }
    case "fatwas": {
      const data = await getAllFatwas().catch(() => []);
      for (const f of data.filter(isPublished)) {
        if (!f.slug) continue;
        items.push({
          subpath: `/fatwas/${f.slug}`,
          lastmod: toIso(f.updated_at || f.published_at),
          changefreq: "weekly",
          priority: 0.9,
        });
      }
      break;
    }
    case "articles": {
      const data = await getAllArticles().catch(() => []);
      for (const a of data.filter(isPublished)) {
        if (!a.slug) continue;
        items.push({
          subpath: `/articles/${a.slug}`,
          lastmod: toIso(a.updated_at || a.published_at),
          changefreq: "weekly",
          priority: 0.85,
        });
      }
      break;
    }
    case "courses": {
      const data = await getAllCourses().catch(() => []);
      for (const c of data.filter(isPublished)) {
        if (!c.slug) continue;
        items.push({
          subpath: `/courses/${c.slug}`,
          lastmod: toIso(c.updated_at || c.published_at),
          changefreq: "weekly",
          priority: 0.8,
        });
      }
      break;
    }
    case "lectures": {
      const data = await getAllLectures().catch(() => []);
      for (const l of data.filter(isPublished)) {
        if (!l.slug) continue;
        items.push({
          subpath: `/lectures/${l.slug}`,
          lastmod: toIso(l.updated_at || l.published_at),
          changefreq: "weekly",
          priority: 0.8,
        });
      }
      break;
    }
    case "series": {
      const data = await getAllSeries().catch(() => []);
      for (const s of data.filter(isPublished)) {
        if (!s.slug) continue;
        items.push({
          subpath: `/series/${s.slug}`,
          lastmod: toIso(s.updated_at || s.published_at),
          changefreq: "weekly",
          priority: 0.8,
        });
      }
      break;
    }
    case "library": {
      const data = await getAllBooks().catch(() => []);
      for (const b of data.filter(isPublished)) {
        if (!b.slug) continue;
        items.push({
          subpath: `/library/${b.slug}`,
          lastmod: toIso(b.updated_at || b.published_at),
          changefreq: "monthly",
          priority: 0.75,
        });
      }
      break;
    }
    case "events": {
      const data = await getAllEvents().catch(() => []);
      for (const e of data.filter(isPublished)) {
        if (!e.slug) continue;
        items.push({
          subpath: `/events/${e.slug}`,
          lastmod: toIso(e.updated_at || e.published_at),
          changefreq: "weekly",
          priority: 0.7,
        });
      }
      break;
    }
    default:
      return new NextResponse("Sitemap not found", { status: 404 });
  }

  const urlBlocks: string[] = [];

  for (const item of items) {
    const alternates = buildSitemapAlternates(item.subpath);

    for (const locale of locales) {
      const locUrl = getLocalizedUrl(item.subpath, locale);
      const prio = locale === "am" ? item.priority : Number((item.priority * 0.95).toFixed(2));

      urlBlocks.push(`  <url>
    <loc>${locUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${alternates.en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${alternates.ar}" />
    <xhtml:link rel="alternate" hreflang="am" href="${alternates.am}" />
    <xhtml:link rel="alternate" hreflang="om" href="${alternates.om}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates["x-default"]}" />
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${prio}</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
