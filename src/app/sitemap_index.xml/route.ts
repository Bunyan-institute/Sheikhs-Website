import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();
  const now = new Date().toISOString();

  const sections = [
    "pages",
    "fatwas",
    "articles",
    "courses",
    "lectures",
    "series",
    "library",
    "events",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sections
  .map(
    (sec) => `  <sitemap>
    <loc>${siteUrl}/sitemaps/${sec}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
