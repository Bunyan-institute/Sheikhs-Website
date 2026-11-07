import { getSeriesList } from "@/lib/api/series";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Layers, LibraryBig, ArrowRight } from "lucide-react";
import type { PublicSeries } from "@/lib/api/types";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema, buildCollectionSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

interface SeriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "series" });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/series`;
  const title = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = t("description");
  const imageUrl = `${siteUrl}/images/sheikh-portrait.jpg`;

  return {
    title,
    description,
    keywords: [
      "Islamic Audio Series",
      "Sheikh Muhammed Ferej Series",
      "Tafsir Series Ethiopia",
      "Halaqat Series",
      "ስብስቦች",
      "سلاسل علمية",
    ],
    alternates: buildHreflangAlternates("/series", locale),
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "series" });
  const siteUrl = getSiteUrl();

  let series: PublicSeries[] = [];
  try {
    const seriesList = await getSeriesList({ locale });
    series = seriesList.data || [];
  } catch (err) {
    console.error("Failed to load series:", err);
  }

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title"), url: `${siteUrl}/${locale}/series` },
  ]);

  const collectionSchema = buildCollectionSchema({
    name: `${t("title")} - Sheikh Muhammed Ferej`,
    description: t("description"),
    url: `${siteUrl}/${locale}/series`,
    inLanguage: locale,
    items: series.map((s) => ({
      name: s.title,
      url: `${siteUrl}/${locale}/series/${s.slug}`,
      description: s.description || undefined,
    })),
  });

  return (
    <div className="w-full">
      <JsonLd data={[collectionSchema, breadcrumbs]} />
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {series.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#0F241C]/10 rounded-2xl flex flex-col items-center p-8">
            <LibraryBig className="w-12 h-12 text-[#0F241C]/30 mb-3" />
            <h3 className="font-display text-xl text-[#0F241C] mb-1">No series available</h3>
            <p className="text-[#0F241C]/60 text-xs">Series archives are currently being synchronized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {series.map((s: PublicSeries) => (
              <Link 
                key={s.id} 
                href={`/series/${s.slug}`} 
                className="group flex flex-col h-full bg-white border border-[#0F241C]/10 rounded-2xl overflow-hidden hover:border-[#1B6A50] transition-all shadow-xs"
              >
                <div className="relative aspect-video bg-[#EDF4F0] overflow-hidden border-b border-[#0F241C]/10">
                  {s.cover?.url ? (
                    <Image
                      src={s.cover.url}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1B6A50]/30">
                      <Layers className="w-12 h-12" />
                    </div>
                  )}
                  {s.lecture_count !== undefined && (
                    <div className="absolute top-3 end-3 bg-[#072118]/90 backdrop-blur-xs text-[#EDF4F0] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#BF9A45]/30">
                      <LibraryBig className="w-3 h-3 text-[#BF9A45]" />
                      <span>{s.lecture_count} Lessons</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F241C] mb-2 group-hover:text-[#1B6A50] transition-colors break-words">
                    {s.title}
                  </h3>
                  
                  {s.description && (
                    <p className="text-xs text-[#0F241C]/70 line-clamp-3 mb-4 font-sans leading-relaxed flex-grow">
                      {s.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-[#0F241C]/10 text-xs font-semibold text-[#BF9A45] flex items-center justify-between">
                    <span>Explore Series Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
