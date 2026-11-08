import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/api/"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "YandexBot"],
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: [`${siteUrl}/sitemap_index.xml`, `${siteUrl}/sitemap.xml`],
    host: siteUrl,
  };
}
