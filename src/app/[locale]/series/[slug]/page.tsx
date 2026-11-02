import { getSeriesDetail, AUTHENTIC_SERIES } from "@/lib/api/series";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, Clock, Layers, PlayCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { PublicSeries, PublicLecture } from "@/lib/api/types";
import { Metadata } from "next";

interface SeriesDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const ser of AUTHENTIC_SERIES) {
      params.push({ locale, slug: ser.slug });
      if (ser.id && ser.id !== ser.slug) {
        params.push({ locale, slug: ser.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const series = await getSeriesDetail(slug, locale);
    return {
      title: `${series.title} | Sheikh Muhammed Ferej Megeno`,
      description: series.description || "Course and lecture series.",
    };
  } catch {
    return {
      title: "Series Not Found | Sheikh Muhammed Ferej",
    };
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let series;
  try {
    series = await getSeriesDetail(slug, locale);
  } catch (error) {
    console.error("Failed to load series detail:", error);
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-[#EDF4F0] py-20 text-center">
        <h1 className="text-3xl font-display font-bold mb-4 text-[#0F241C]">Series Not Found</h1>
        <Link href="/series" className="text-[#1B6A50] hover:underline font-medium">← Back to all series</Link>
      </div>
    );
  }

  const lectures = (series.lectures || []).sort((a: PublicLecture, b: PublicLecture) => 
    (a.series?.position || 0) - (b.series?.position || 0)
  );

  return (
    <div className="w-full bg-[#EDF4F0] py-8 sm:py-12 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <Link 
          href="/series" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B6A50] hover:text-[#0D3E2F] transition-colors mb-6 sm:mb-8 py-1"
        >
          <ArrowLeft className="w-4 h-4 text-[#BF9A45]" />
          <span>All Series</span>
        </Link>

        {/* Series Overview Card */}
        <div className="bg-white border border-[#0F241C]/10 rounded-2xl overflow-hidden mb-8 sm:mb-12 shadow-xs">
          {series.cover?.url && (
            <div className="w-full h-52 md:h-72 relative bg-[#EDF4F0] border-b border-[#0F241C]/10">
              <Image
                src={series.cover.url}
                alt={series.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-5 sm:p-8 md:p-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1B6A50]/10 border border-[#1B6A50]/20 text-[#1B6A50] rounded-full text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>Series • {series.lecture_count || lectures.length} Lessons</span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F241C] mb-3 sm:mb-4 break-words">
              {series.title}
            </h1>
            
            {series.description && (
              <p className="text-sm sm:text-base md:text-lg text-[#0F241C]/75 leading-relaxed font-sans break-words max-w-4xl">
                {series.description}
              </p>
            )}
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-5 sm:space-y-6">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-[#0F241C]">Series Curriculum &amp; Lessons</h2>
          
          {lectures.length === 0 ? (
            <div className="p-8 sm:p-10 text-center bg-white border border-[#0F241C]/10 rounded-2xl text-[#0F241C]/60 text-sm">
              No lessons have been added to this series yet.
            </div>
          ) : (
            <div className="bg-white border border-[#0F241C]/10 rounded-2xl divide-y divide-[#0F241C]/10 overflow-hidden shadow-xs">
              {lectures.map((lecture: PublicLecture, index: number) => {
                const position = lecture.series?.position || index + 1;
                const formattedNumber = position.toString().padStart(2, '0');
                
                return (
                  <Link 
                    key={lecture.id} 
                    href="/media"
                    className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 md:p-6 hover:bg-[#EDF4F0]/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center text-[#0F241C] font-display font-semibold text-xs sm:text-sm group-hover:bg-[#1B6A50] group-hover:text-[#EDF4F0] transition-colors">
                        {formattedNumber}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors break-words">
                          {lecture.title}
                        </h3>
                        {lecture.summary && (
                          <p className="text-xs sm:text-sm text-[#0F241C]/65 line-clamp-1 mt-0.5 sm:mt-1 break-words">
                            {lecture.summary}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-3 sm:gap-4 text-[#0F241C]/60">
                        {lecture.duration_seconds && (
                          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                            <span>{formatDuration(lecture.duration_seconds)}</span>
                          </div>
                        )}
                        <PlayCircle className="w-5 h-5 text-[#BF9A45] group-hover:text-[#1B6A50] transition-colors shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
