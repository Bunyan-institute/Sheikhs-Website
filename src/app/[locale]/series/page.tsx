import { getSeriesList } from "@/lib/api/series";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Layers, LibraryBig, ArrowRight } from "lucide-react";
import type { PublicSeries } from "@/lib/api/types";

interface SeriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "series" });

  let series: PublicSeries[] = [];
  try {
    const seriesList = await getSeriesList({ locale });
    series = seriesList.data || [];
  } catch (err) {
    console.error("Failed to load series:", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Classical Scholarly Header */}
        <div className="mb-10 pb-6 border-b border-[#E6E0D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="text-[#B8860B]">۞</span>
                <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-[#555E61] max-w-xl font-body">
              {t("description")}
            </p>
          </div>
        </div>

        {series.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E6E0D8] rounded-[4px] flex flex-col items-center">
            <LibraryBig className="w-12 h-12 text-[#7A8285]/50 mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#2D3436] mb-1">No series available</h3>
            <p className="text-[#7A8285] text-xs">Series archives are currently being synchronized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {series.map((s: PublicSeries) => (
              <Link 
                key={s.id} 
                href={`/series/${s.slug}`} 
                className="group flex flex-col h-full bg-white border border-[#E6E0D8] rounded-[4px] overflow-hidden hover:border-[#1A4D2E] transition-colors"
              >
                <div className="relative aspect-video bg-[#FAF8F5] overflow-hidden border-b border-[#E6E0D8]">
                  {s.cover?.url ? (
                    <Image
                      src={s.cover.url}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1A4D2E]/40">
                      <Layers className="w-12 h-12" />
                    </div>
                  )}
                  {s.lecture_count !== undefined && (
                    <div className="absolute top-2.5 end-2.5 bg-[#FAF8F5]/90 border border-[#E6E0D8] text-[#1A4D2E] text-[11px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1 shadow-2xs">
                      <LibraryBig className="w-3 h-3 text-[#B8860B]" />
                      <span>{s.lecture_count} Lessons</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-[#2D3436] mb-2 group-hover:text-[#1A4D2E] transition-colors break-words">
                    {s.title}
                  </h3>
                  
                  {s.description && (
                    <p className="text-xs text-[#555E61] line-clamp-3 mb-4 font-body leading-relaxed flex-grow">
                      {s.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-[#FAF8F5] text-xs font-semibold text-[#8C6D23] flex items-center justify-between">
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
