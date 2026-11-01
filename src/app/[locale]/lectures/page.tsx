import { getLectures } from "@/lib/api/lectures";
import { getCategories } from "@/lib/api/taxonomy";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilterBar } from "@/components/ui/filter-bar";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Clock, Calendar, Video, AudioLines, BookOpen, ArrowRight } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import type { PublicLecture } from "@/lib/api/types";

interface LecturesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LecturesPage({ params, searchParams }: LecturesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "lectures" });

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
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Classical Scholarly Header */}
        <div className="mb-10 pb-6 border-b border-[#E6E0D8]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
              <p className="text-sm sm:text-base text-[#555E61] max-w-2xl font-body mt-2">
                {t("description")}
              </p>
            </div>
            
            {/* Format Filter Tabs (Dignified Classical Styling) */}
            <div className="inline-flex rounded-[4px] bg-white border border-[#E6E0D8] p-1 shrink-0 overflow-x-auto max-w-full">
              <Link
                href={`/lectures${categorySlug ? `?category=${categorySlug}` : ""}`}
                className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold whitespace-nowrap transition-colors ${
                  format === "all" ? "bg-[#1A4D2E] text-white" : "text-[#555E61] hover:text-[#1A4D2E]"
                }`}
              >
                All ({allLectures.length})
              </Link>
              <Link
                href={`/lectures?format=video${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  format === "video" ? "bg-[#1A4D2E] text-white" : "text-[#555E61] hover:text-[#1A4D2E]"
                }`}
              >
                <Video className="w-3.5 h-3.5 text-[#B8860B]" /> Videos ({allLectures.filter(l => Boolean(l.media?.video)).length})
              </Link>
              <Link
                href={`/lectures?format=audio${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  format === "audio" ? "bg-[#1A4D2E] text-white" : "text-[#555E61] hover:text-[#1A4D2E]"
                }`}
              >
                <AudioLines className="w-3.5 h-3.5 text-[#B8860B]" /> Audio ({allLectures.filter(l => !l.media?.video).length})
              </Link>
            </div>
          </div>
        </div>

        {/* Official Android App & Africa TV Playlists Quick Access Strip */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-[#E6E0D8] rounded-[4px] flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A4D2E] block">Official Mobile App</span>
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">ሸይኽ ሙሃመድ ፈረጅ (Android App)</h3>
              <p className="text-xs text-[#7A8285]">Download all audio &amp; Africa TV videos for offline study.</p>
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#1A4D2E] text-white rounded-[3px] text-xs font-bold hover:bg-[#143d24] shrink-0 transition-colors"
            >
              Google Play &rarr;
            </a>
          </div>

          <div className="p-4 bg-white border border-[#E6E0D8] rounded-[4px] flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D23] block">Official YouTube Playlists</span>
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">Africa TV &amp; YouTube Channels</h3>
              <p className="text-xs text-[#7A8285]">350+ hours of complete lecture playlists.</p>
            </div>
            <a
              href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#FAF8F5] border border-[#E6E0D8] text-[#1A4D2E] rounded-[3px] text-xs font-bold hover:bg-white shrink-0 transition-colors"
            >
              Open Playlist &rarr;
            </a>
          </div>
        </div>

        <div className="mb-8">
          <FilterBar categories={categories} currentCategory={categorySlug} />
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E6E0D8] rounded-[4px]">
            <BookOpen className="w-12 h-12 text-[#7A8285]/50 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#2D3436] mb-1">No lectures found</h3>
            <p className="text-[#7A8285] text-xs">Try adjusting your format or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lectures.map((lecture: PublicLecture) => (
              <Link 
                key={lecture.id} 
                href={`/lectures/${lecture.slug}`} 
                className="group flex flex-col h-full bg-white border border-[#E6E0D8] rounded-[4px] overflow-hidden hover:border-[#1A4D2E] transition-colors"
              >
                <div className="relative aspect-video bg-[#FAF8F5] overflow-hidden border-b border-[#E6E0D8]">
                  {lecture.cover?.url ? (
                    <Image
                      src={lecture.cover.url}
                      alt={lecture.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1A4D2E]/40">
                      {lecture.media?.video ? <Video className="w-10 h-10" /> : <AudioLines className="w-10 h-10" />}
                    </div>
                  )}
                  {lecture.duration_seconds && (
                    <div className="absolute bottom-2.5 end-2.5 bg-black/75 text-white text-[11px] font-medium px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B8860B]" />
                      {formatDuration(lecture.duration_seconds)}
                    </div>
                  )}
                  <div className="absolute top-2.5 start-2.5 bg-[#FAF8F5]/90 border border-[#E6E0D8] text-[#1A4D2E] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {lecture.media?.video ? "Video Discourse" : "Audio Lesson"}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                    {lecture.categories && lecture.categories.length > 0 && (
                      <span className="font-bold text-[#1A4D2E] uppercase tracking-wider text-[11px] truncate">
                        {lecture.categories[0]}
                      </span>
                    )}
                    <span className="text-[11px] text-[#7A8285]">
                      {lecture.media?.video ? "Video" : "Audio"}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-base font-bold text-[#2D3436] mb-2 group-hover:text-[#1A4D2E] transition-colors line-clamp-2 break-words">
                    {lecture.title}
                  </h3>
                  
                  {lecture.summary && (
                    <p className="text-xs text-[#555E61] line-clamp-2 mb-4 font-body leading-relaxed break-words">
                      {lecture.summary}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs text-[#7A8285]">
                    <div className="flex items-center text-[11px]">
                      <Calendar className="w-3.5 h-3.5 me-1.5 text-[#8C6D23]" />
                      {lecture.published_at ? formatDate(lecture.published_at) : 'Authentic Archive'}
                    </div>
                    <span className="font-semibold text-[#8C6D23] flex items-center gap-1">
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
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
              className="px-6 py-2.5 bg-white border border-[#E6E0D8] text-[#2D3436] font-medium rounded-[4px] hover:border-[#1A4D2E] hover:text-[#1A4D2E] transition-colors text-sm"
            >
              Load More Halaqat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
