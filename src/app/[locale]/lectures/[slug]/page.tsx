import { getLecture, getLectures, AUTHENTIC_LECTURES } from "@/lib/api/lectures";
import { setRequestLocale } from "next-intl/server";
import { LecturePlayer } from "@/components/lectures/lecture-player";
import { LectureTranscript } from "@/components/lectures/lecture-transcript";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Clock, Folder, Layers } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import type { PublicLecture } from "@/lib/api/types";
import { Metadata } from "next";

interface LectureDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const lec of AUTHENTIC_LECTURES) {
      params.push({ locale, slug: lec.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: LectureDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const lecture = await getLecture(slug, locale);
    return {
      title: `${lecture.title} - Sheikh Muhammed Ferej Megeno`,
      description: lecture.summary || `Listen to ${lecture.title}`,
    };
  } catch (error) {
    return { title: "Lecture Not Found" };
  }
}

export default async function LectureDetailPage({ params }: LectureDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let lecture: PublicLecture;
  try {
    lecture = await getLecture(slug, locale);
  } catch {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 text-center">
        <h1 className="text-2xl font-bold font-heading mb-4 text-[#2D3436]">Lecture Not Found</h1>
        <Link href="/lectures" className="text-[#1B5E20] hover:underline font-medium">← Back to all lectures</Link>
      </div>
    );
  }

  let relatedLectures: PublicLecture[] = [];
  try {
    const relatedResponse = await getLectures({
      locale,
      category: lecture.categories && lecture.categories.length > 0 ? [lecture.categories[0]] : undefined,
      limit: "4"
    });
    relatedLectures = (relatedResponse.data || []).filter((l: PublicLecture) => l.id !== lecture.id).slice(0, 3);
  } catch (err) {
    console.error("Failed to load related lectures", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 md:py-16">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <Link 
          href="/lectures" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All Lectures & Discourses
        </Link>

        <div className="bg-white border border-[#E0D8CE] rounded-md p-5 sm:p-6 md:p-8 mb-8">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#636E72] mb-4">
              {lecture.categories && lecture.categories.length > 0 && (
                <div className="flex items-center gap-1.5 font-medium text-[#1B5E20] capitalize">
                  <Folder className="w-4 h-4" />
                  {lecture.categories[0]}
                </div>
              )}
              {lecture.published_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(lecture.published_at)}
                </div>
              )}
              {lecture.duration_seconds && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(lecture.duration_seconds)}
                </div>
              )}
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D3436] mb-4 leading-tight break-words">
              {lecture.title}
            </h1>

            {lecture.series && (
              <Link 
                href={`/series/${lecture.series.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#E0D8CE] rounded-md hover:border-[#1B5E20] transition-colors group text-sm"
              >
                <Layers className="w-4 h-4 text-[#B8860B]" />
                <span className="text-[#636E72]">Part of series:</span>
                <span className="font-semibold text-[#2D3436] group-hover:text-[#1B5E20]">
                  {lecture.series.title} {lecture.series.position ? `(Lesson ${lecture.series.position})` : ''}
                </span>
              </Link>
            )}
          </div>

          <div className="mb-10">
            <LecturePlayer 
              media={{
                audio: lecture.media?.audio || null,
                video: lecture.media?.video || null,
                transcript: lecture.media?.transcript || null
              }}
              title={lecture.title}
              coverUrl={lecture.cover?.url ?? null}
            />
          </div>

          {lecture.summary && (
            <div className="prose prose-[#2D3436] max-w-none font-body mb-10 break-words">
              <h2 className="text-xl font-heading font-semibold text-[#2D3436] mb-3">Overview</h2>
              <p className="text-[#636E72] leading-relaxed">{lecture.summary}</p>
            </div>
          )}

          {lecture.media?.transcript && (
            <LectureTranscript transcript={lecture.media.transcript} title={lecture.title} />
          )}
        </div>

        {relatedLectures.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-6">Related Lectures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedLectures.map((related: PublicLecture) => (
                <Link key={related.id} href={`/lectures/${related.slug}`} className="group bg-white border border-[#E0D8CE] rounded-md p-4 hover:border-[#1B5E20] transition-colors">
                  <h3 className="font-heading text-lg font-bold text-[#2D3436] group-hover:text-[#1B5E20] line-clamp-2 mb-2">
                    {related.title}
                  </h3>
                  {related.duration_seconds && (
                    <div className="text-xs text-[#636E72] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(related.duration_seconds)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
