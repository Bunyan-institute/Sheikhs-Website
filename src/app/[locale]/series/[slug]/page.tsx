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
      title: `${series.title} - Sheikh Muhammed Ferej Megeno`,
      description: series.description || `Study the ${series.title} series`,
    };
  } catch (error) {
    return { title: "Series Not Found" };
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let series: PublicSeries;
  try {
    series = await getSeriesDetail(slug, locale);
  } catch {
    return (
      <div className="min-h-screen bg-[#EDF2EE] py-20 text-center">
        <h1 className="text-3xl font-display font-bold mb-4 text-[#14262E]">Series Not Found</h1>
        <Link href="/series" className="text-[#1D6A5A] hover:underline font-medium">← Back to all series</Link>
      </div>
    );
  }

  const lectures = (series.lectures || []).sort((a: PublicLecture, b: PublicLecture) => 
    (a.series?.position || 0) - (b.series?.position || 0)
  );

  return (
    <div className="w-full bg-[#EDF2EE] py-10 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <Link 
          href="/series" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D6A5A] hover:text-[#0F3446] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-[#BF9A45]" />
          All Series
        </Link>

        {/* Series Overview Card */}
        <div className="bg-white border border-[#14262E]/10 rounded-2xl overflow-hidden mb-12 shadow-xs">
          {series.cover?.url && (
            <div className="w-full h-52 md:h-72 relative bg-[#EDF2EE] border-b border-[#14262E]/10">
              <Image
                src={series.cover.url}
                alt={series.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 text-[#1D6A5A] rounded-full text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5 text-[#BF9A45]" />
              Series • {series.lecture_count || lectures.length} Lessons
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#14262E] mb-4 break-words">
              {series.title}
            </h1>
            
            {series.description && (
              <p className="text-base sm:text-lg text-[#14262E]/70 leading-relaxed font-sans break-words max-w-4xl">
                {series.description}
              </p>
            )}
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl text-[#14262E]">Series Curriculum &amp; Lessons</h2>
          
          {lectures.length === 0 ? (
            <div className="p-10 text-center bg-white border border-[#14262E]/10 rounded-2xl text-[#14262E]/60 text-sm">
              No lessons have been added to this series yet.
            </div>
          ) : (
            <div className="bg-white border border-[#14262E]/10 rounded-2xl divide-y divide-[#14262E]/10 overflow-hidden shadow-xs">
              {lectures.map((lecture: PublicLecture, index: number) => {
                const position = lecture.series?.position || index + 1;
                const formattedNumber = position.toString().padStart(2, '0');
                
                return (
                  <Link 
                    key={lecture.id} 
                    href="/media"
                    className="flex flex-col sm:flex-row items-start sm:items-center p-5 md:p-6 hover:bg-[#EDF2EE]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EDF2EE] border border-[#BF9A45]/30 flex items-center justify-center text-[#14262E] font-display font-semibold text-sm group-hover:bg-[#1D6A5A] group-hover:text-[#EDF2EE] transition-colors">
                        {formattedNumber}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h3 className="font-display text-base sm:text-lg font-semibold text-[#14262E] group-hover:text-[#1D6A5A] transition-colors break-words">
                          {lecture.title}
                        </h3>
                        {lecture.summary && (
                          <p className="text-xs sm:text-sm text-[#14262E]/60 line-clamp-1 mt-1 break-words">
                            {lecture.summary}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-4 text-[#14262E]/60">
                        {lecture.duration_seconds && (
                          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                            {formatDuration(lecture.duration_seconds)}
                          </div>
                        )}
                        <PlayCircle className="w-7 h-7 text-[#BF9A45] group-hover:text-[#1D6A5A] transition-colors" />
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