import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/api/profile";
import { getArticles } from "@/lib/api/articles";
import { getEvents } from "@/lib/api/events";
import { getMedia } from "@/lib/api/media";
import { ScholarHero } from "@/components/profile/scholar-hero";
import { AfricaTvPlaylists } from "@/components/media/africa-tv-playlists";
import { formatDate } from "@/lib/utils";
import type { PublicArticle, PublicEvent } from "@/lib/api/types";
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Tv,
  Headphones,
  Video,
  FileText
} from "lucide-react";

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
  let latestArticles: PublicArticle[] = [];
  let upcomingEvents: PublicEvent[] = [];
  let mediaItems: any[] = [];

  try {
    profile = await getProfile(locale);
    const sections = profile.sections;

    const [articlesRes, eventsRes, mediaRes] = await Promise.all([
      sections.articles ? getArticles({ limit: "3", locale }) : Promise.resolve(null),
      sections.events ? getEvents({ limit: "3", locale }) : Promise.resolve(null),
      getMedia({ locale }),
    ]);

    latestArticles = articlesRes?.data || [];
    upcomingEvents = eventsRes?.data || [];
    mediaItems = mediaRes || [];
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
      sections: { lectures: false, articles: true, fatwas: true, courses: true, library: false, events: true, questions: true },
      socials: {
        youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
        tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
        facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
        telegram: "https://t.me/ustazmuhammadferej",
      },
      updated_at: new Date().toISOString(),
    };
  }

  const videoItems = mediaItems.filter(m => m.kind === "video").slice(0, 3);
  const audioItems = mediaItems.filter(m => m.kind === "audio").slice(0, 3);

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-24">
      <ScholarHero 
        name={profile.name}
        headline={profile.headline}
        biography={profile.biography}
        photoUrl={profile.photo?.url ?? null}
        locale={locale}
      />

      {/* ── AFRICA TV & YOUTUBE OFFICIAL PLAYLISTS SHOWCASE ── */}
      <section className="py-12 border-b border-[#E6E0D8]">
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

          <Link 
            href="/media"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-bold"
          >
            <span>Browse Full Media Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <AfricaTvPlaylists />
      </section>

      {/* ── MEDIA HUB DISCOURSES & BROADCAST ARCHIVES ── */}
      <section className="py-12 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                المكتبة المرئية والصوتية
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                Media Hub &amp; Audio Broadcasts
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">
              Audio Lessons, Broadcasts &amp; Scholarly Archives
            </h2>
            <p className="text-xs sm:text-sm text-[#555E61] mt-1">
              Listen to authentic classroom audio expositions, television series, and verified scholarly recordings.
            </p>
          </div>

          <Link 
            href="/media" 
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A4D2E] hover:text-[#8C6D23] font-semibold"
          >
            <span>Explore All Media Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Media Category Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/media?kind=videos"
            className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] truncate">
                Video Discourses
              </h4>
              <p className="text-xs text-[#7A8285]">Africa TV &amp; YouTube</p>
            </div>
          </Link>

          <Link
            href="/media?kind=audio"
            className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-[#1A4D2E]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] truncate">
                Audio Exegesis
              </h4>
              <p className="text-xs text-[#7A8285]">Riyad us-Saliheen Series</p>
            </div>
          </Link>

          <Link
            href="/media?kind=photos"
            className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5 text-[#8C6D23]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] truncate">
                Photo Archives
              </h4>
              <p className="text-xs text-[#7A8285]">Historical Dawah Timeline</p>
            </div>
          </Link>

          <Link
            href="/media?kind=documents"
            className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#1A4D2E]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] truncate">
                Study Documents
              </h4>
              <p className="text-xs text-[#7A8285]">Syllabi &amp; Curriculum PDFs</p>
            </div>
          </Link>
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
