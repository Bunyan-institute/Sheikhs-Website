import { getLectures } from "@/lib/api/lectures";
import { getCategories } from "@/lib/api/taxonomy";
import { setRequestLocale } from "next-intl/server";
import { FilterBar } from "@/components/ui/filter-bar";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Clock, Calendar, Video, AudioLines } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import type { PublicLecture } from "@/lib/api/types";

interface LecturesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LecturesPage({ params, searchParams }: LecturesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;
  const categorySlug = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const tagSlug = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : undefined;
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : undefined;
  const cursor = typeof resolvedSearchParams.cursor === "string" ? resolvedSearchParams.cursor : undefined;

  const format = typeof resolvedSearchParams.format === "string" ? resolvedSearchParams.format : "all";

  let lecturesResponse = { data: [] as PublicLecture[], has_more: false, next_cursor: null as string | null };
  let categories = [] as any[];

  try {
    const [lecRes, catRes] = await Promise.all([
      getLectures({ 
        locale, 
        category: categorySlug ? [categorySlug] : undefined,
        tag: tagSlug ? [tagSlug] : undefined,
        sort,
        cursor 
      }),
      getCategories()
    ]);
    lecturesResponse = lecRes;
    categories = catRes.data || [];
  } catch (err) {
    console.error("Failed to load lectures:", err);
  }

  const allLectures = lecturesResponse.data || [];
  const lectures = allLectures.filter((lec) => {
    if (format === "video") return Boolean(lec.media?.video);
    if (format === "audio") return Boolean(lec.media?.audio && !lec.media?.video);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D3436]">
                Lectures & Discourses
              </h1>
              <p className="text-lg text-[#636E72] max-w-2xl font-body mt-2">
                Explore the comprehensive collection of sermons, Kitab At-Tawheed audio curriculum, and televised video discourses.
              </p>
            </div>
            
            {/* Format Filter Tabs */}
            <div className="inline-flex rounded-lg bg-white border border-[#E0D8CE] p-1 shadow-sm shrink-0 overflow-x-auto max-w-full">
              <Link
                href={`/lectures${categorySlug ? `?category=${categorySlug}` : ""}`}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  format === "all" ? "bg-[#1B5E20] text-white" : "text-[#636E72] hover:text-[#2D3436]"
                }`}
              >
                All ({allLectures.length})
              </Link>
              <Link
                href={`/lectures?format=video${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  format === "video" ? "bg-red-600 text-white" : "text-[#636E72] hover:text-[#2D3436]"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Videos ({allLectures.filter(l => Boolean(l.media?.video)).length})
              </Link>
              <Link
                href={`/lectures?format=audio${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  format === "audio" ? "bg-[#1B5E20] text-white" : "text-[#636E72] hover:text-[#2D3436]"
                }`}
              >
                <AudioLines className="w-3.5 h-3.5" /> Audio ({allLectures.filter(l => !l.media?.video).length})
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <FilterBar categories={categories} currentCategory={categorySlug} />
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E0D8CE] rounded-md">
            <h3 className="font-heading text-xl text-[#2D3436] mb-2">No lectures found</h3>
            <p className="text-[#636E72]">Try adjusting your format or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lectures.map((lecture: PublicLecture) => (
              <Link key={lecture.id} href={`/lectures/${lecture.slug}`} className="group flex flex-col h-full bg-white border border-[#E0D8CE] rounded-md overflow-hidden hover:border-[#1B5E20] hover:shadow-sm transition-all">
                <div className="relative aspect-video bg-[#2D3436] overflow-hidden">
                  {lecture.cover?.url ? (
                    <Image
                      src={lecture.cover.url}
                      alt={lecture.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-[#1B5E20]">
                        {lecture.media?.video ? <Video className="w-8 h-8" /> : <AudioLines className="w-8 h-8" />}
                      </div>
                    </div>
                  )}
                  {lecture.duration_seconds && (
                    <div className="absolute bottom-3 end-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(lecture.duration_seconds)}
                    </div>
                  )}
                  {lecture.media?.video && (
                    <div className="absolute top-3 start-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                      HD Video
                    </div>
                  )}
                </div>
                
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    {lecture.categories && lecture.categories.length > 0 && (
                      <span className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wider capitalize">
                        {lecture.categories[0]}
                      </span>
                    )}
                    {lecture.media?.video ? (
                      <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> Watch
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#1B5E20] flex items-center gap-1">
                        <AudioLines className="w-3.5 h-3.5" /> Listen
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1B5E20] transition-colors line-clamp-2 break-words">
                    {lecture.title}
                  </h3>
                  
                  {lecture.summary && (
                    <p className="text-sm text-[#636E72] line-clamp-3 mb-4 font-body leading-relaxed break-words">
                      {lecture.summary}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-[#FAF8F5] flex items-center justify-between text-sm text-[#636E72]">
                    <div className="flex items-center text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 me-2" />
                      {lecture.published_at ? formatDate(lecture.published_at) : 'Date unavailable'}
                    </div>
                    <span className="text-xs font-bold text-[#1B5E20] group-hover:underline">
                      Open &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {lecturesResponse.has_more && (
          <div className="mt-12 flex justify-center">
            <Link 
              href={`?cursor=${lecturesResponse.next_cursor}`}
              className="px-6 py-2.5 bg-[#FAF8F5] border border-[#E0D8CE] text-[#2D3436] font-medium rounded-md hover:bg-[#E0D8CE] transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
