import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/api/profile";
import { getLectures } from "@/lib/api/lectures";
import { getArticles } from "@/lib/api/articles";
import { getEvents } from "@/lib/api/events";
import { ScholarHero } from "@/components/profile/scholar-hero";
import { LecturePlayer } from "@/components/lectures/lecture-player";
import { formatDuration, formatDate } from "@/lib/utils";
import type { PublicLecture, PublicArticle, PublicEvent } from "@/lib/api/types";
import { 
  Play, 
  Download, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Tv, 
  Layers, 
  ExternalLink,
  Smartphone,
  Headphones
} from "lucide-react";

const OFFICIAL_PLAYLISTS = [
  {
    id: "pl_yt_main",
    title: "Sheikh Muhammed Ferej — Official Complete Lectures Playlist",
    amharicTitle: "የሸይኽ ሙሐመድ ፈረጅ የተሟላ የዳዕዋ ፕሌይሊስት (350+ ሰዓታት)",
    platform: "YouTube Playlist",
    episodes: "350+ Hours",
    url: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    cover: "/images/photo_11_2026-09-30_23-42-17.jpg",
    description: "The primary verified YouTube archive of lectures, Friday Khutbahs, and halaqat delivered by Sheikh Muhammed Ferej across three decades.",
  },
  {
    id: "pl_africatv_riyad",
    title: "Africa TV — Riyadus Saliheen Series (ሪያዱ ሷሊሂን በአፍሪካ ቲቪ)",
    amharicTitle: "ሪያዱ ሷሊሂን በአፍሪካ ቲቪ — በሸይኽ ሙሐመድ ፈረጅ",
    platform: "Africa TV Series",
    episodes: "Full TV Series",
    url: "https://www.youtube.com/@AfricaTV1",
    cover: "/images/photo_12_2026-09-30_23-42-17.jpg",
    description: "Systematic television commentary on Hadith sciences and purification of character broadcast across the Horn of Africa on Africa TV.",
  },
  {
    id: "pl_africatv_seerah",
    title: "Africa TV — Nebyu Beleloch Andebet (ነቢዩ በሌሎች አንደበት)",
    amharicTitle: "ነቢዩ (ሰ.ዐ.ወ) በሌሎች አንደበት — በአፍሪካ ቲቪ የተላለፈ",
    platform: "Africa TV Series",
    episodes: "Complete Exegesis",
    url: "https://www.youtube.com/watch?v=5hlykYaVcn4",
    cover: "/images/photo_1_2026-09-30_23-42-17.jpg",
    description: "Televised series exploring global historical testimonies and classical non-Muslim recognitions of Prophet Muhammad (ﷺ).",
  },
  {
    id: "pl_africatv_hajj",
    title: "Africa TV — Negere Hajj & Umrah Rulings (ነገረ ሐጅ)",
    amharicTitle: "የሐጅ እና ዑምራ ስነስርዓት በአፍሪካ ቲቪ — በሸይኽ ሙሐመድ ፈረጅ",
    platform: "Africa TV Series",
    episodes: "Practical Rulings",
    url: "https://www.youtube.com/@AfricaTV1",
    cover: "/images/photo_16_2026-09-30_23-42-17.jpg",
    description: "Step-by-step jurisprudential guide and rulings on performing Hajj and Umrah in accordance with authentic Sunnah.",
  },
];

function LectureCard({ lecture }: { lecture: PublicLecture }) {
  const coverUrl = lecture.cover?.url;
  const isVideo = Boolean(lecture.media?.video);

  return (
    <Link href={`/lectures/${lecture.slug}`} className="block group h-full">
      <div className="border border-[#E6E0D8] rounded-[4px] overflow-hidden bg-white hover:border-[#1A4D2E] transition-colors h-full flex flex-col">
        <div className="aspect-video bg-[#FAF8F5] relative flex items-center justify-center overflow-hidden border-b border-[#E6E0D8]">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={lecture.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="text-[#1A4D2E] opacity-40">
              <Tv className="w-10 h-10" />
            </div>
          )}
          <div className="absolute top-2.5 end-2.5 bg-[#FAF8F5]/90 border border-[#E6E0D8] text-[#1A4D2E] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
            {isVideo ? "Africa TV / Video" : "Audio Lesson"}
          </div>
        </div>
        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              {lecture.categories && lecture.categories.length > 0 && (
                <span className="px-2 py-0.5 text-[11px] rounded-[2px] bg-[#FAF8F5] text-[#1A4D2E] border border-[#E6E0D8] font-semibold uppercase tracking-wider">
                  {lecture.categories[0]}
                </span>
              )}
              {lecture.duration_seconds && (
                <span className="text-[#7A8285] font-medium text-xs">
                  {formatDuration(lecture.duration_seconds)}
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors line-clamp-2 break-words">
              {lecture.title}
            </h3>
            {lecture.summary && (
              <p className="text-xs text-[#555E61] line-clamp-2 leading-relaxed">
                {lecture.summary}
              </p>
            )}
          </div>
          <div className="pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs text-[#8C6D23] font-semibold">
            <span>Watch / Study Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: PublicArticle }) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group h-full">
      <div className="border border-[#E6E0D8] rounded-[4px] overflow-hidden bg-white p-5 space-y-3 hover:border-[#1A4D2E] transition-colors h-full flex flex-col">
        <div className="flex items-center justify-between text-xs text-[#7A8285]">
          <span className="font-bold text-[#1A4D2E] uppercase tracking-wider text-[11px]">
            {article.categories?.[0] || "Scholarly Treatise"}
          </span>
          <span>{article.reading_minutes ? `${article.reading_minutes} min study` : "Authentic Text"}</span>
        </div>
        <h3 className="font-heading font-bold text-base sm:text-lg text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors line-clamp-2 break-words">
          {article.title}
        </h3>
        <p className="text-[#555E61] text-xs sm:text-sm line-clamp-3 flex-1 leading-relaxed">
          {article.summary}
        </p>
        <div className="text-xs text-[#8C6D23] font-semibold pt-3 border-t border-[#E6E0D8] flex items-center justify-between">
          <span>Read Discourse &amp; References</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: PublicEvent }) {
  const date = new Date(event.starts_at);
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="border border-[#E6E0D8] rounded-[4px] overflow-hidden bg-white flex hover:border-[#1A4D2E] transition-colors">
        <div className="bg-[#FAF8F5] border-e border-[#E6E0D8] px-5 py-4 flex flex-col items-center justify-center min-w-[84px]">
          <span className="text-[#1A4D2E] font-heading font-bold text-2xl">{date.getDate()}</span>
          <span className="text-[#7A8285] text-xs font-semibold uppercase tracking-wider">
            {date.toLocaleString('default', { month: 'short' })}
          </span>
        </div>
        <div className="p-4 space-y-1.5 flex-1 min-w-0">
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors line-clamp-1 break-words">
            {event.title}
          </h3>
          {event.venue_name && (
            <p className="text-[#555E61] text-xs flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#8C6D23] shrink-0" />
              <span>{event.venue_name}</span>
            </p>
          )}
          <p className="text-[#7A8285] text-[11px] flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#1A4D2E]" />
            <span>{formatDate(event.starts_at)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  let profile = null;
  let latestLectures: PublicLecture[] = [];
  let latestArticles: PublicArticle[] = [];
  let upcomingEvents: PublicEvent[] = [];

  try {
    profile = await getProfile(locale);
    const sections = profile.sections;

    if (sections.lectures) {
      const res = await getLectures({ limit: "24", locale });
      latestLectures = res?.data || [];
    }
    if (sections.articles) {
      const res = await getArticles({ limit: "3", locale });
      latestArticles = res?.data || [];
    }
    if (sections.events) {
      const res = await getEvents({ limit: "3", locale });
      upcomingEvents = res?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
  }

  if (!profile) {
    profile = {
      object: "profile" as const,
      id: "sheikh-ferej",
      name: "Sheikh Muhammed Ferej Megeno",
      headline: "Islamic Scholar, Educator & Sharia Consultant",
      biography: "Sheikh Muhammed Ferej Megeno (الشيخ محمد فرج مجنو) is an experienced Ethiopian Islamic scholar, educator, and certified Sharia consultant with over 35 years of service in Islamic education, institutional leadership, and Dawah.",
      languages: ["ar", "am", "en", "om"],
      locale,
      direction: "ltr" as const,
      photo: {
        object: "media" as const,
        id: "med_portrait",
        kind: "image" as const,
        url: "/images/sheikh-portrait.jpg",
        mime_type: "image/jpeg",
        width: 1280,
        height: 1280,
        duration_seconds: null,
      },
      sections: { lectures: true, articles: true, fatwas: true, courses: true, library: true, events: true, questions: true },
      socials: {
        youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
        tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
        facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
        telegram: "https://t.me/ustazmuhammadferej",
      },
      updated_at: new Date().toISOString(),
    };
  }

  const featuredLecture = latestLectures[0];
  const videoLectures = latestLectures.filter(l => Boolean(l.media?.video));

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-24">
      <ScholarHero 
        name={profile.name}
        headline={profile.headline}
        biography={profile.biography}
        photoUrl={profile.photo?.url ?? null}
        locale={locale}
      />

      {/* ── HIGH VISIBILITY OFFICIAL ANDROID APP SHOWCASE ── */}
      <section className="my-10">
        <div className="bg-[#FAF8F5] border-2 border-[#1A4D2E] rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
            {/* App Mockup Badge */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#1A4D2E] border-2 border-[#B8860B] shadow-md flex items-center justify-center p-3 shrink-0">
                <div className="w-full h-full border border-[#B8860B]/60 rounded-xl flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[#B8860B] font-bold text-xl leading-none">م</span>
                  <span className="text-white text-[10px] font-bold mt-1">ሸይኽ ሙሃመድ</span>
                  <span className="text-[#FAF8F5]/80 text-[8px]">ፈረጅ</span>
                </div>
              </div>
              <div className="space-y-2 text-center sm:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white border border-[#E6E0D8] text-xs font-bold text-[#1A4D2E]">
                  <Smartphone className="w-3.5 h-3.5 text-[#1A4D2E]" />
                  <span>Official Mobile App • ኦፊሴላዊ የሞባይል መተግበሪያ</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436]">
                  &ldquo;ሸይኽ ሙሃመድ ፈረጅ&rdquo; — Video &amp; Audio App
                </h2>
                <p className="text-xs sm:text-sm text-[#555E61] max-w-xl leading-relaxed">
                  The verified official Android app by Africa Media Network Ltd. Access all televised lectures from Africa TV, audio halaqat, and discourses with full offline listening and zero registration.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#7A8285]">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#1A4D2E]" /> 100% Free &amp; Offline Audio</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#1A4D2E]" /> Africa TV Video Series</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#1A4D2E]" /> No Account Required</span>
                </div>
              </div>
            </div>

            {/* Direct Google Play Download Action */}
            <div className="shrink-0 w-full lg:w-auto flex flex-col items-center lg:items-end gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[4px] bg-[#1A4D2E] hover:bg-[#143d24] text-white font-bold text-base shadow-md border border-[#143d24] transition-colors"
              >
                <svg className="w-6 h-6 text-[#B8860B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.33-.2-.533-.564-.533-.969V2.783c0-.405.203-.769.532-.969zm11.597 11.598l2.38 2.38-12.062 6.845 9.682-9.225zm0-2.824L5.524 1.363l12.062 6.845-2.38 2.38zm1.414 1.412l3.473 1.968c.84.476.84 1.258 0 1.734l-3.473 1.968-2.121-2.121 2.121-2.121z"/>
                </svg>
                <span>GET IT ON Google Play</span>
              </a>
              <span className="text-[11px] text-[#7A8285] font-mono">
                Package: com.sheikhmuhammedferej
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFRICA TV & YOUTUBE OFFICIAL PLAYLISTS SHOWCASE ── */}
      <section className="py-10 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                قوائم التشغيل والبرامج التلفزيونية
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                Official Playlists &amp; Africa TV Series
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">
              YouTube &amp; Africa TV Playlists — Sheikh Muhammed Ferej
            </h2>
            <p className="text-xs sm:text-sm text-[#555E61] mt-1">
              Curated lecture series, televised exegesis, and complete halaqat organized in official playlists.
            </p>
          </div>

          <a 
            href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-bold"
          >
            <span>Open 350+ Hours Playlist</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OFFICIAL_PLAYLISTS.map((pl) => (
            <a
              key={pl.id}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white border border-[#E6E0D8] rounded-[4px] overflow-hidden hover:border-[#1A4D2E] transition-colors"
            >
              <div className="aspect-video relative bg-[#FAF8F5] overflow-hidden border-b border-[#E6E0D8]">
                <img 
                  src={pl.cover} 
                  alt={pl.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#1A4D2E] text-white flex items-center justify-center shadow-lg border border-[#B8860B]/60">
                    <Play className="w-5 h-5 ms-0.5 text-[#B8860B]" />
                  </div>
                </div>
                <div className="absolute top-2.5 end-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#B8860B]" />
                  <span>{pl.episodes}</span>
                </div>
                <div className="absolute bottom-2.5 start-2.5 bg-[#FAF8F5]/95 text-[#1A4D2E] text-[10px] font-bold px-2 py-0.5 rounded-[2px] border border-[#E6E0D8]">
                  {pl.platform}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#8C6D23] font-semibold block">{pl.platform}</span>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors line-clamp-2">
                    {pl.title}
                  </h3>
                  <p className="text-xs text-[#555E61] line-clamp-2 leading-relaxed">
                    {pl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs text-[#8C6D23] font-semibold">
                  <span>Open Full Playlist</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Broadcast Halaqah Section */}
      {featuredLecture && (
        <section className="py-12 border-b border-[#E6E0D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs uppercase font-bold text-[#1A4D2E] tracking-widest block mb-1">
                Featured Broadcast • المحاضرات والخطب
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">
                Broadcast Exegesis by Sheikh Muhammed Ferej
              </h2>
            </div>
            <Link 
              href="/lectures" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-semibold"
            >
              <span>Browse All Recorded Lectures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border border-[#E6E0D8] rounded-[4px] overflow-hidden bg-white shadow-xs flex flex-col lg:flex-row">
            <div className="lg:w-7/12 aspect-video bg-[#1A1A1A] relative flex items-center justify-center">
              <LecturePlayer media={featuredLecture.media} title={featuredLecture.title} coverUrl={featuredLecture.cover?.url} />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center lg:w-5/12 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {featuredLecture.categories && featuredLecture.categories.length > 0 && (
                  <span className="px-3 py-1 text-[11px] rounded-[2px] bg-[#FAF8F5] text-[#1A4D2E] border border-[#E6E0D8] font-bold uppercase tracking-wider">
                    {featuredLecture.categories[0]}
                  </span>
                )}
                {featuredLecture.duration_seconds && (
                  <span className="px-3 py-1 text-[11px] rounded-[2px] bg-[#FAF8F5] text-[#555E61] border border-[#E6E0D8] font-medium">
                    {formatDuration(featuredLecture.duration_seconds)}
                  </span>
                )}
                <span className="px-3 py-1 text-[11px] rounded-[2px] bg-[#1A4D2E]/10 text-[#1A4D2E] font-semibold">
                  Official Exegesis
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#2D3436] break-words">
                {featuredLecture.title}
              </h3>
              {featuredLecture.summary && (
                <p className="text-[#555E61] line-clamp-3 text-sm leading-relaxed break-words font-body">
                  {featuredLecture.summary}
                </p>
              )}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={`/lectures/${featuredLecture.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[#1A4D2E] text-white font-semibold text-xs sm:text-sm hover:bg-[#143d24]"
                >
                  <span>Full Lecture Notes &amp; Summary</span>
                  <ArrowRight className="w-4 h-4 text-[#B8860B]" />
                </Link>
                <a
                  href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#FAF8F5] border border-[#E6E0D8] text-[#1A4D2E] font-bold text-xs hover:bg-white"
                >
                  <Download className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Listen in App (Offline)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Discourses Section */}
      <section className="py-12 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-[#1A4D2E] tracking-widest mb-1">
              Recorded Discourses • الدروس والمحاضرات
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">
              Recent Video Exegesis &amp; Halaqat
            </h2>
          </div>
          <Link 
            href="/lectures" 
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-semibold"
          >
            <span>View All Lectures</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videoLectures.slice(1, 9).map((lec) => (
            <LectureCard key={lec.id} lecture={lec} />
          ))}
        </div>
      </section>

      {/* Scholarly Writings by Sheikh Muhammed Ferej */}
      <div className="py-12 space-y-16">
        {latestArticles.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-[#1A4D2E] tracking-widest block mb-1">
                  Authored Works • البحوث والمقالات
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#2D3436]">
                  Scholarly Articles &amp; Exegesis by Sheikh Muhammed Ferej
                </h2>
              </div>
              <Link 
                href="/articles" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-semibold"
              >
                <span>View all articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-[#1A4D2E] tracking-widest block mb-1">
                  Gatherings &amp; Seminars • اللقاءات العلمية
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#2D3436]">
                  Upcoming Dawrahs &amp; Gatherings
                </h2>
              </div>
              <Link 
                href="/events" 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-semibold"
              >
                <span>View calendar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
