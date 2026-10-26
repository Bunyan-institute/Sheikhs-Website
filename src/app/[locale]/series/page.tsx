import { getSeriesList } from "@/lib/api/series";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Layers, LibraryBig } from "lucide-react";
import type { PublicSeries } from "@/lib/api/types";

interface SeriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  let series: PublicSeries[] = [];
  try {
    const seriesList = await getSeriesList({ locale });
    series = seriesList.data || [];
  } catch (err) {
    console.error("Failed to load series:", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-12 space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D3436]">
            Series
          </h1>
          <p className="text-lg text-[#636E72] max-w-2xl font-body">
            Structured study programs and multi-part lessons for deep scholarly learning.
          </p>
        </div>

        {series.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E0D8CE] rounded-md flex flex-col items-center">
            <LibraryBig className="w-12 h-12 text-[#E0D8CE] mb-4" />
            <h3 className="font-heading text-xl text-[#2D3436] mb-2">No series available</h3>
            <p className="text-[#636E72]">Check back later for newly published scholarly series.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {series.map((s: PublicSeries) => (
              <Link key={s.id} href={`/series/${s.slug}`} className="group flex flex-col h-full bg-white border border-[#E0D8CE] rounded-md overflow-hidden hover:border-[#1B5E20] hover:shadow-sm transition-all">
                <div className="relative aspect-video bg-[#E0D8CE] overflow-hidden">
                  {s.cover?.url ? (
                    <Image
                      src={s.cover.url}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-16 h-16 text-[#FAF8F5]" />
                    </div>
                  )}
                  {s.lecture_count !== undefined && (
                    <div className="absolute top-3 end-3 bg-[#1B5E20] text-white text-xs font-medium px-2.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm">
                      <LibraryBig className="w-3.5 h-3.5" />
                      {s.lecture_count} Lessons
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1B5E20] transition-colors break-words">
                    {s.title}
                  </h3>
                  
                  {s.description && (
                    <p className="text-sm text-[#636E72] line-clamp-3 mb-4 font-body">
                      {s.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
