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

function LectureCard({ lecture }: { lecture: PublicLecture }) {
  const coverUrl = lecture.cover?.url;
  const isVideo = Boolean(lecture.media?.video);
  return (
    <Link href={`/lectures/${lecture.slug}`} className="block group">
      <div className="border border-[#E0D8CE] rounded-[4px] overflow-hidden bg-white hover:shadow-sm hover:border-[#1B5E20] transition-all">
        <div className="aspect-video bg-[#FAF8F5] relative flex items-center justify-center overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt={lecture.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="text-[#1B5E20] opacity-50">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          )}
          {isVideo && (
            <div className="absolute top-2 end-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <span>▶</span> HD Video
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex gap-2">
            {lecture.categories && lecture.categories.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE] font-medium capitalize">
                {lecture.categories[0]}
              </span>
            )}
            {lecture.duration_seconds && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#FAF8F5] text-[#636E72] border border-[#E0D8CE]">
                {formatDuration(lecture.duration_seconds)}
              </span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors line-clamp-2 break-words">
            {lecture.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: PublicArticle }) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group h-full">
      <div className="border border-[#E0D8CE] rounded-[4px] overflow-hidden bg-white p-4 space-y-3 hover:shadow-sm hover:border-[#1B5E20] transition-all h-full flex flex-col">
        <div className="flex items-center justify-between text-xs text-[#636E72]">
          <span className="font-semibold text-[#1B5E20] uppercase tracking-wider">{article.categories?.[0] || "Article"}</span>
          <span>{article.reading_minutes ? `${article.reading_minutes} min read` : "Authentic Text"}</span>
        </div>
        <h3 className="font-heading font-semibold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors line-clamp-2 break-words">
          {article.title}
        </h3>
        <p className="text-[#636E72] text-sm line-clamp-3 flex-1 leading-relaxed">{article.summary}</p>
        <div className="text-xs text-[#B8860B] font-semibold pt-2 border-t border-[#E0D8CE] flex items-center justify-between">
          <span>Read in 4 Languages &rarr;</span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: PublicEvent }) {
  const date = new Date(event.starts_at);
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="border border-[#E0D8CE] rounded-[4px] overflow-hidden bg-white flex hover:shadow-sm hover:border-[#1B5E20] transition-all">
        <div className="bg-[#FAF8F5] border-e border-[#E0D8CE] px-4 py-4 flex flex-col items-center justify-center min-w-[80px]">
          <span className="text-[#1B5E20] font-bold text-xl">{date.getDate()}</span>
          <span className="text-[#636E72] text-xs uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
        </div>
        <div className="p-4 space-y-1 flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors line-clamp-1 break-words">
            {event.title}
          </h3>
          {event.venue_name && (
            <p className="text-[#636E72] text-sm line-clamp-1">{event.venue_name}</p>
          )}
          <p className="text-[#636E72] text-xs">{formatDate(event.starts_at)}</p>
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
      const res = await getLectures({ limit: "20", locale });
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
      },
      updated_at: new Date().toISOString(),
    };
  }

  const featuredLecture = latestLectures[0];
  const videoLectures = latestLectures.filter(l => Boolean(l.media?.video));
  const audioLessons = latestLectures.filter(l => !l.media?.video && Boolean(l.media?.audio)).slice(0, 3);

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-24">
      <ScholarHero 
        name={profile.name}
        headline={profile.headline}
        biography={profile.biography}
        photoUrl={profile.photo?.url ?? null}
        locale={locale}
      />

      {/* Featured Lecture / Video Discourse */}
      {featuredLecture && (
        <section className="py-12 border-b border-[#E0D8CE]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 sm:gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider">Featured Broadcast</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">Watch & Listen</h2>
            </div>
            <Link href="/lectures" className="text-[#1B5E20] hover:text-[#B8860B] font-medium transition-colors text-sm">
              All Lectures &rarr;
            </Link>
          </div>
          <div className="border border-[#E0D8CE] rounded-[6px] overflow-hidden bg-white shadow-sm flex flex-col lg:flex-row">
            <div className="lg:w-7/12 aspect-video bg-[#2D3436] relative flex items-center justify-center">
              <LecturePlayer media={featuredLecture.media} title={featuredLecture.title} coverUrl={featuredLecture.cover?.url} />
            </div>
            <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center lg:w-5/12 space-y-4">
              <div className="flex flex-wrap gap-2">
                {featuredLecture.categories && featuredLecture.categories.length > 0 && (
                  <span className="px-3 py-1 text-xs rounded-full bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE] font-semibold uppercase tracking-wider">
                    {featuredLecture.categories[0]}
                  </span>
                )}
                {featuredLecture.duration_seconds && (
                  <span className="px-3 py-1 text-xs rounded-full bg-[#FAF8F5] text-[#636E72] border border-[#E0D8CE] font-medium">
                    {formatDuration(featuredLecture.duration_seconds)}
                  </span>
                )}
                <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold">
                  HD Video
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#2D3436] break-words">
                {featuredLecture.title}
              </h3>
              {featuredLecture.summary && (
                <p className="text-[#636E72] line-clamp-3 text-sm sm:text-base leading-relaxed break-words">
                  {featuredLecture.summary}
                </p>
              )}
              <div className="pt-2">
                <Link
                  href={`/lectures/${featuredLecture.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#1B5E20] text-white font-semibold text-sm hover:bg-[#154a19] transition-colors shadow-sm text-center"
                >
                  Full Lesson Transcript & Notes &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Discourses & Social Channels Section */}
      <section className="py-12 border-b border-[#E0D8CE]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider mb-1">Multimedia Library</div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2D3436]">Video Discourses & Official Channels</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.tiktok.com/@ustazmuhammadferej0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.65z"/></svg>
              TikTok (297K+)
            </a>
            <a
              href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2] text-white text-xs font-semibold hover:bg-[#1260c7] transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook (330K+)
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CC0000] text-white text-xs font-semibold hover:bg-[#b00000] transition-colors shadow-sm"
            >
              YouTube Playlist
            </a>
            <Link href="/media" className="text-[#1B5E20] hover:text-[#B8860B] font-medium text-sm transition-colors ms-2">
              All Media &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videoLectures.slice(1, 9).map((lec) => (
            <div key={lec.id} className="border border-[#E0D8CE] rounded-[6px] overflow-hidden bg-white shadow-sm flex flex-col group hover:border-[#1B5E20] transition-colors">
              <div className="aspect-video bg-[#2D3436] relative">
                <LecturePlayer media={lec.media} title={lec.title} coverUrl={lec.cover?.url} />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-[#636E72] mb-2">
                  <span className="font-semibold text-[#1B5E20] uppercase tracking-wider">{lec.categories?.[0] || "Discourse"}</span>
                  {lec.duration_seconds && <span>{formatDuration(lec.duration_seconds)}</span>}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#2D3436] group-hover:text-[#1B5E20] transition-colors line-clamp-2 mb-2 break-words">
                  {lec.title}
                </h3>
                {lec.summary && (
                  <p className="text-xs text-[#636E72] line-clamp-2 mb-4 font-body leading-relaxed break-words">
                    {lec.summary}
                  </p>
                )}
                <div className="mt-auto pt-3 border-t border-[#FAF8F5] flex items-center justify-between">
                  <Link href={`/lectures/${lec.slug}`} className="text-xs font-bold text-[#1B5E20] hover:underline">
                    View Transcript &rarr;
                  </Link>
                  <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                    HD Video
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Lessons & Classical Books */}
      <div className="py-12 space-y-16">
        {audioLessons.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 sm:gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider">Audio Curriculum</span>
                <h2 className="font-heading text-2xl font-bold text-[#2D3436]">Kitab At-Tawheed Audio Lessons</h2>
              </div>
              <Link href="/lectures" className="text-[#1B5E20] hover:text-[#B8860B] font-medium transition-colors">
                View all lessons &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {audioLessons.map((lecture) => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </div>
          </section>
        )}

        {latestArticles.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 sm:gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider">Authentic Writings</span>
                <h2 className="font-heading text-2xl font-bold text-[#2D3436]">Hadith & Scholarly Articles</h2>
              </div>
              <Link href="/articles" className="text-[#1B5E20] hover:text-[#B8860B] font-medium transition-colors">
                View all articles &rarr;
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 sm:gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider">Gatherings</span>
                <h2 className="font-heading text-2xl font-bold text-[#2D3436]">Upcoming Events & Seminars</h2>
              </div>
              <Link href="/events" className="text-[#1B5E20] hover:text-[#B8860B] font-medium transition-colors">
                View all events &rarr;
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
