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
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0F3446] text-[#EDF2EE] py-16 overflow-hidden">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/80 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[#EDF2EE]">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-[#EDF2EE]/75 max-w-xl font-sans leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {series.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#14262E]/10 rounded-2xl flex flex-col items-center p-8">
            <LibraryBig className="w-12 h-12 text-[#14262E]/30 mb-3" />
            <h3 className="font-display text-xl text-[#14262E] mb-1">No series available</h3>
            <p className="text-[#14262E]/60 text-xs">Series archives are currently being synchronized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {series.map((s: PublicSeries) => (
              <Link 
                key={s.id} 
                href={`/series/${s.slug}`} 
                className="group flex flex-col h-full bg-white border border-[#14262E]/10 rounded-2xl overflow-hidden hover:border-[#1D6A5A] transition-all shadow-xs"
              >
                <div className="relative aspect-video bg-[#EDF2EE] overflow-hidden border-b border-[#14262E]/10">
                  {s.cover?.url ? (
                    <Image
                      src={s.cover.url}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1D6A5A]/30">
                      <Layers className="w-12 h-12" />
                    </div>
                  )}
                  {s.lecture_count !== undefined && (
                    <div className="absolute top-3 end-3 bg-[#0A2532]/90 backdrop-blur-xs text-[#EDF2EE] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#BF9A45]/30">
                      <LibraryBig className="w-3 h-3 text-[#BF9A45]" />
                      <span>{s.lecture_count} Lessons</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display text-lg font-semibold text-[#14262E] mb-2 group-hover:text-[#1D6A5A] transition-colors break-words">
                    {s.title}
                  </h3>
                  
                  {s.description && (
                    <p className="text-xs text-[#14262E]/70 line-clamp-3 mb-4 font-sans leading-relaxed flex-grow">
                      {s.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-[#14262E]/10 text-xs font-semibold text-[#BF9A45] flex items-center justify-between">
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