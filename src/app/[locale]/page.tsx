import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/api/profile";
import { ScholarHero } from "@/components/profile/scholar-hero";
import { HomeArticleTabs } from "@/components/home/home-article-tabs";
import { getArticles } from "@/lib/api/articles";
import { getEvents } from "@/lib/api/events";
import type { PublicEvent } from "@/lib/api/types";
import { getHomepageMetadata, getScholarEntity, getOrganizationEntity, buildWebsiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { 
  Video, 
  Headphones, 
  Camera, 
  FileText, 
  MapPin,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getHomepageMetadata(locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  const [profile, articlesRes, eventsRes] = await Promise.all([
    getProfile(locale),
    getArticles({ locale }),
    getEvents({ locale }),
  ]);
  const { socials } = profile;

  const articleItems = articlesRes.data.slice(0, 12).map((a) => ({
    id: a.id,
    topic: a.categories[0] ?? "",
    min: a.reading_minutes ?? 5,
    lang: a.locale,
    title: a.title,
    excerpt: a.summary ?? "",
    slug: a.slug,
  }));

  const now = Date.now();
  const upcoming = eventsRes.data
    .filter((e) => new Date(e.starts_at).getTime() >= now)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0];
  const recent = eventsRes.data.filter((e) => new Date(e.starts_at).getTime() < now).slice(0, 2);
  const dayOf = (e: PublicEvent) => new Intl.DateTimeFormat("en", { day: "numeric" }).format(new Date(e.starts_at));
  const monthYearOf = (e: PublicEvent) => new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(e.starts_at));

  return (
    <div className="w-full">
      <JsonLd data={[getScholarEntity(), getOrganizationEntity(), buildWebsiteSchema(locale)]} />
      {/* ============ HERO (MIHRAB SHRINE WITH SCHOLAR PORTRAIT) ============ */}
      <ScholarHero
        name={profile.name}
        headline={profile.headline}
        biography={profile.biography}
        photoUrl={profile.photo?.url ?? null}
        locale={locale}
      />

      {/* ============ SANAD STRIP ============ */}
      <section className="bg-[#072118] text-[#EDF4F0] border-y border-[#BF9A45]/20" aria-label="At a glance">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="px-2 lg:border-r border-[#EDF4F0]/10">
            <p className="font-display text-2xl sm:text-4xl text-[#E6D3A3] whitespace-nowrap">{t("sanadYears")}</p>
            <p className="mt-1 text-xs sm:text-sm text-[#EDF4F0]/70 leading-snug">{t("sanadYearsDesc")}</p>
          </div>
          <div className="px-2 lg:px-6 lg:border-r border-[#EDF4F0]/10">
            <p className="font-display text-2xl sm:text-4xl text-[#E6D3A3] whitespace-nowrap">{t("sanadHours")}</p>
            <p className="mt-1 text-xs sm:text-sm text-[#EDF4F0]/70 leading-snug">{t("sanadHoursDesc")}</p>
          </div>
          <div className="px-2 lg:px-6 lg:border-r border-[#EDF4F0]/10">
            <p className="font-display text-2xl sm:text-4xl text-[#E6D3A3] whitespace-nowrap">{t("sanadFollowers")}</p>
            <p className="mt-1 text-xs sm:text-sm text-[#EDF4F0]/70 leading-snug">{t("sanadFollowersDesc")}</p>
          </div>
          <div className="px-2 lg:ps-6">
            <p className="font-display text-2xl sm:text-4xl text-[#E6D3A3] whitespace-nowrap">{t("sanadTv")}</p>
            <p className="mt-1 text-xs sm:text-sm text-[#EDF4F0]/70 leading-snug">{t("sanadTvDesc")}</p>
          </div>
        </div>
      </section>

      {/* ============ MEDIA SECTION ============ */}
      <section id="media" className="relative py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 lattice-light pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="font-arabic text-xl sm:text-2xl text-[#1B6A50] text-start" dir="rtl" lang="ar">
                {t("mediaArabicBadge")}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#0F241C] tracking-tight">
                {t("mediaTitle")}
              </h2>
              <p className="mt-3 sm:mt-4 max-w-xl text-[#0F241C]/75 text-sm sm:text-base leading-relaxed">
                {t("mediaSubtitle")}
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 text-[#1B6A50] font-bold text-sm sm:text-base underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0D3E2F] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{t("mediaBrowseLink")}</span>
              <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
            </Link>
          </div>

          <div className="mt-10 sm:mt-12 grid lg:grid-cols-[1.25fr_1fr] gap-8">
            {/* Featured Riyad us-Saliheen */}
            <article className="relative bg-[#0D3E2F] text-[#EDF4F0] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl border border-[#BF9A45]/30">
              <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
              <div className="relative p-6 sm:p-10 flex flex-col h-full">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#E6D3A3]/90">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF4F0]/10 px-3.5 py-1 border border-[#BF9A45]/30 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#BF9A45] animate-pulse" />
                    {t("featuredBadge")}
                  </span>
                  <span>{t("featuredSeriesTag")}</span>
                </div>

                <div className="mt-6 sm:mt-8 flex gap-4 sm:gap-6 items-start">
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Play Riyad us-Saliheen on YouTube"
                    className="group shrink-0 grid place-items-center w-16 h-20 sm:w-24 sm:h-28 arch-top bg-[#BF9A45] text-[#072118] hover:bg-[#E6D3A3] transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-2 sm:mt-3">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                  <div>
                    <h3 className="font-ethiopic text-xl sm:text-[1.75rem] leading-snug font-bold" lang="am">
                      {t("featuredTitleAm")}
                    </h3>
                    <p className="mt-1 font-display text-base sm:text-lg text-[#E6D3A3] font-semibold">
                      {t("featuredTitle")}
                    </p>
                  </div>
                </div>

                <p className="font-arabic mt-6 sm:mt-8 text-lg sm:text-xl leading-relaxed text-[#EDF4F0]/90" dir="rtl" lang="ar">
                  سلسلة الدروس المنهجية والمحاضرات لفضيلة الشيخ محمد فرج مجنو حفظه الله
                </p>
                <p className="mt-3 sm:mt-4 text-[#EDF4F0]/80 text-sm sm:text-base leading-relaxed max-w-lg">
                  {t("featuredDesc")}
                </p>

                <ul className="mt-5 sm:mt-6 space-y-2.5 text-xs sm:text-[15px] text-[#EDF4F0]/85">
                  <li className="flex items-start gap-2.5">
                    <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                    <span>{t("featuredBullet1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                    <span>{t("featuredBullet2")}</span>
                  </li>
                </ul>

                <div className="mt-8 sm:mt-10 pt-4 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold rounded-full px-6 py-3.5 transition-all text-sm shadow-md min-h-[46px] cursor-pointer"
                  >
                    <span>{t("featuredYoutubeBtn")}</span>
                    <ExternalLink className="w-4 h-4 text-[#072118]" />
                  </a>
                  <a
                    href={socials.play_store}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3.5 border border-[#EDF4F0]/40 text-[#EDF4F0] hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors text-sm font-semibold min-h-[46px] cursor-pointer"
                  >
                    {t("featuredAppBtn")}
                  </a>
                </div>
              </div>
            </article>

            {/* Other Series list */}
            <div className="flex flex-col justify-between gap-4">
              <Link
                href="/media"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#1B6A50] font-bold uppercase tracking-wider">{t("otherAudioArchive")}</span>
                  <span className="text-[#0F241C]/50 font-medium">350+ hours</span>
                </div>
                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug text-[#0F241C] group-hover:text-[#1B6A50] transition-colors">
                  {t("otherAudioArchiveTitle")}
                </h3>
                <p className="mt-2 text-[#0F241C]/70 text-sm sm:text-[14.5px] leading-relaxed">
                  {t("otherAudioArchiveDesc")}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#BF9A45] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/media"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#1B6A50] font-bold uppercase tracking-wider">Africa TV</span>
                  <span className="text-[#0F241C]/50 font-medium">Seasonal series</span>
                </div>
                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug text-[#0F241C] group-hover:text-[#1B6A50] transition-colors">
                  {t("otherHajjTitle")}
                </h3>
                <p className="mt-2 text-[#0F241C]/70 text-sm sm:text-[14.5px] leading-relaxed">
                  {t("otherHajjDesc")}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#BF9A45] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/media"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#1B6A50] font-bold uppercase tracking-wider">{t("otherSeerah")}</span>
                  <span className="text-[#0F241C]/50 font-medium">Prophetic Biography</span>
                </div>
                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug text-[#0F241C] group-hover:text-[#1B6A50] transition-colors">
                  {t("otherSeerahTitle")}
                </h3>
                <p className="mt-2 text-[#0F241C]/70 text-sm sm:text-[14.5px] leading-relaxed">
                  {t("otherSeerahDesc")}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#BF9A45] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* ============ CLICKABLE INTERACTIVE MEDIA SHELF ============ */}
          <div className="mt-14 sm:mt-18">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-arabic text-lg sm:text-xl text-[#1B6A50] text-start" dir="rtl" lang="ar">
                  {t("shelfArabicBadge")}
                </p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl text-[#0F241C] font-bold tracking-tight">
                  {t("shelfTitle")}
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#BF9A45] hidden sm:block">
                ★ 4 Official Archive Formats
              </span>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {/* 1. Video Discourses */}
              <Link
                href="/media?kind=videos"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0D3E2F]/10 flex items-center justify-center text-[#1B6A50] group-hover:bg-[#0D3E2F] group-hover:text-white transition-all shadow-xs">
                    <Video className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors leading-snug">
                    {t("shelfVideoTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0F241C]/65 mt-1.5 leading-relaxed">
                    {t("shelfVideoDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#0F241C]/5 flex items-center justify-between text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-4 h-4 text-[#BF9A45] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* 2. Audio Exegesis */}
              <Link
                href="/media?kind=audio"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0D3E2F]/10 flex items-center justify-center text-[#1B6A50] group-hover:bg-[#0D3E2F] group-hover:text-white transition-all shadow-xs">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors leading-snug">
                    {t("shelfAudioTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0F241C]/65 mt-1.5 leading-relaxed">
                    {t("shelfAudioDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#0F241C]/5 flex items-center justify-between text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-4 h-4 text-[#BF9A45] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* 3. Photo Archives */}
              <Link
                href="/media?kind=photos"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0D3E2F]/10 flex items-center justify-center text-[#1B6A50] group-hover:bg-[#0D3E2F] group-hover:text-white transition-all shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors leading-snug">
                    {t("shelfPhotosTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0F241C]/65 mt-1.5 leading-relaxed">
                    {t("shelfPhotosDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#0F241C]/5 flex items-center justify-between text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-4 h-4 text-[#BF9A45] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* 4. Study Documents */}
              <Link
                href="/media?kind=documents"
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0D3E2F]/10 flex items-center justify-center text-[#1B6A50] group-hover:bg-[#0D3E2F] group-hover:text-white transition-all shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors leading-snug">
                    {t("shelfDocsTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0F241C]/65 mt-1.5 leading-relaxed">
                    {t("shelfDocsDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#0F241C]/5 flex items-center justify-between text-xs font-bold text-[#0D3E2F] group-hover:text-[#1B6A50]">
                  <span>{t("shelfExplore")}</span>
                  <ArrowRight className="w-4 h-4 text-[#BF9A45] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ARTICLES & LESSONS ============ */}
      <section id="knowledge" className="bg-[#EDF4F0]/50 py-16 sm:py-20 lg:py-24 border-t border-[#0F241C]/10">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="font-arabic text-xl sm:text-2xl text-[#1B6A50] text-start" dir="rtl" lang="ar">
                {t("knowledgeArabicBadge")}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#0F241C] tracking-tight">
                {t("knowledgeTitle")}
              </h2>
              <p className="mt-3 sm:mt-4 max-w-xl text-[#0F241C]/75 text-sm sm:text-base leading-relaxed">
                {t("knowledgeSubtitle")}
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[#1B6A50] font-bold text-sm sm:text-base underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0D3E2F] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{t("knowledgeViewAll")}</span>
              <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
            </Link>
          </div>

          <div className="mt-8 sm:mt-10">
            <HomeArticleTabs articles={articleItems} />
          </div>
        </div>
      </section>

      {/* ============ HADITH BAND ============ */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] overflow-hidden border-y border-[#BF9A45]/30">
        <div className="absolute inset-0 lattice opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-12 sm:w-16 bg-[#BF9A45]/60" />
            <span className="star-sep text-[#BF9A45]" />
            <span className="h-px w-12 sm:w-16 bg-[#BF9A45]/60" />
          </div>
          <blockquote className="mt-6 sm:mt-8">
            <p className="font-arabic text-2xl sm:text-3xl lg:text-[2.6rem] leading-[1.8]" dir="rtl" lang="ar">
              مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا<br />
              سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
            </p>
            <p className="mt-5 sm:mt-6 font-display text-lg sm:text-xl lg:text-2xl text-[#E6D3A3] leading-relaxed max-w-2xl mx-auto font-medium">
              &ldquo;{t("hadithText")}&rdquo;
            </p>
            <footer className="mt-3 sm:mt-4 text-[#EDF4F0]/70 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {t("hadithSource")}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <section id="events" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="font-arabic text-xl sm:text-2xl text-[#1B6A50] text-start" dir="rtl" lang="ar">
                {t("eventsArabicBadge")}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#0F241C] tracking-tight">
                {t("eventsTitle")}
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[#1B6A50] font-bold text-sm sm:text-base underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0D3E2F] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{t("eventsViewCalendar")}</span>
              <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
            </Link>
          </div>

          <div className="mt-10 sm:mt-12 grid lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Upcoming Event */}
            {upcoming ? (
<article className="rounded-3xl bg-[#0D3E2F] text-[#EDF4F0] p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl border border-[#BF9A45]/30">
              <div className="absolute -right-16 -bottom-16 w-72 h-72 lattice opacity-50 rounded-full pointer-events-none" aria-hidden="true" />
              <div>
                <p className="relative text-[#E6D3A3] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  {t("nextGathering")}
                </p>
                <div className="relative mt-5 sm:mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                  <div className="shrink-0 w-20 sm:w-24 arch-top bg-[#BF9A45] text-[#072118] text-center pt-5 sm:pt-6 pb-3 sm:pb-4 shadow-md font-bold">
                    <p className="font-display text-4xl sm:text-5xl leading-none">{dayOf(upcoming)}</p>
                    <p className="mt-1 text-xs sm:text-sm">{monthYearOf(upcoming)}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl leading-snug font-bold" lang={upcoming.locale}>{upcoming.title}</h3>
                    {upcoming.summary && <p className="mt-2 font-display text-base sm:text-lg text-[#E6D3A3] font-semibold">{upcoming.summary}</p>}
                    <p className="mt-4 flex items-center gap-2 text-[#EDF4F0]/85 text-sm sm:text-[15px]">
                      <MapPin className="w-4 h-4 text-[#BF9A45] shrink-0" />
                      <span>{[upcoming.venue_name, upcoming.venue_address].filter(Boolean).join(", ") || upcoming.online_url}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative mt-8 sm:mt-10 flex flex-wrap gap-3.5">
                <Link
                  href={`/events/${upcoming.slug}`}
                  className="inline-flex items-center justify-center bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold rounded-full px-6 py-3 transition-colors text-sm min-h-[44px] cursor-pointer shadow-sm"
                >
                  {t("registerToAttend")}
                </Link>
                <Link
                  href={`/events/${upcoming.slug}`}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 border border-[#EDF4F0]/40 text-[#EDF4F0] hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors text-sm font-semibold min-h-[44px] cursor-pointer"
                >
                  {t("viewDetails")}
                </Link>
              </div>
            </article>
) : (
<article className="rounded-3xl bg-[#0D3E2F] text-[#EDF4F0] p-6 sm:p-10 shadow-xl border border-[#BF9A45]/30 flex items-center justify-center text-center">
              <p className="text-[#E6D3A3] text-sm sm:text-base font-semibold">{t("noUpcomingEvents")}</p>
            </article>
)}

            {/* Recently held */}
            {recent.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F241C]/60">{t("recentlyHeld")}</p>
              <ul className="mt-3 space-y-3">
                {recent.map((e) => (
                  <li key={e.id} className="interactive-card bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-5 rounded-2xl flex gap-4 sm:gap-5 shadow-xs">
                    <div className="w-14 sm:w-16 shrink-0 text-center border-e border-[#0F241C]/10 pe-2">
                      <p className="font-display text-2xl sm:text-3xl text-[#1B6A50] font-bold leading-none">{dayOf(e)}</p>
                      <p className="text-xs text-[#0F241C]/60 mt-1 font-semibold">{monthYearOf(e)}</p>
                    </div>
                    <div>
                      <Link href={`/events/${e.slug}`} className="font-display text-base sm:text-lg leading-snug text-[#0F241C] font-bold hover:text-[#1B6A50]" lang={e.locale}>{e.title}</Link>
                      {e.summary && <p className="text-sm sm:text-[15px] text-[#0F241C]/75 font-medium">{e.summary}</p>}
                      {e.venue_name && <p className="mt-1 text-xs text-[#0F241C]/55">{e.venue_name}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>

      {/* ============ APP + ASK ============ */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          {/* App Card */}
          <article id="app" className="rounded-3xl bg-[#072118] text-[#EDF4F0] p-6 sm:p-10 relative overflow-hidden scroll-mt-24 flex flex-col justify-between shadow-xl border border-[#BF9A45]/30">
            <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
            <div>
              <div className="relative flex gap-4 sm:gap-6 items-start">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#BF9A45] grid place-items-center shadow-md">
                  <span className="font-arabic text-2xl sm:text-3xl text-[#072118] leading-none -mt-1 font-bold">م</span>
                </div>
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-[#EDF4F0] font-bold">{t("appCardTitle")}</h2>
                  <p className="mt-1 font-ethiopic text-[#E6D3A3] text-sm sm:text-base font-semibold" lang="am">ሸይኽ ሙሃመድ ፈረጅ</p>
                </div>
              </div>
              <p className="relative mt-5 sm:mt-6 text-[#EDF4F0]/85 text-sm sm:text-base leading-relaxed max-w-md">
                {t("appCardSubtitle")}
              </p>
            </div>
            <div className="relative mt-8 flex flex-wrap gap-3.5">
              <a
                href={socials.play_store}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] rounded-full px-6 py-3 transition-colors shadow-sm font-bold text-xs sm:text-sm min-h-[46px] cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 3.5v17l10-8.5zM15.5 13.3 18 15.5l3-1.7c.8-.5.8-1.3 0-1.8l-3-1.7-2.5 2.2z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-[#072118]/80 font-semibold uppercase">{t("appGetOn")}</span>
                  <span className="block font-extrabold">Google Play</span>
                </span>
              </a>
              <a
                href={socials.play_store}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-[#EDF4F0]/40 rounded-full px-6 py-3 hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors text-xs sm:text-sm font-semibold min-h-[46px] cursor-pointer"
              >
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-[#EDF4F0]/70 font-medium">Official Android App</span>
                  <span className="block font-bold">100% Free &amp; Offline</span>
                </span>
              </a>
            </div>
          </article>

          {/* Ask the Sheikh */}
          <article id="ask" className="rounded-3xl bg-white border border-[#0F241C]/10 p-6 sm:p-10 scroll-mt-24 flex flex-col justify-between shadow-xs">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-[#0F241C] font-bold">{t("askCardTitle")}</h2>
              <p className="mt-3 text-[#0F241C]/75 text-sm sm:text-base leading-relaxed max-w-md">
                {t("askCardSubtitle")}
              </p>
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-card flex flex-col gap-2 rounded-2xl border border-[#0F241C]/10 p-4 hover:border-[#1B6A50] hover:bg-[#EDF4F0]/50 transition-all cursor-pointer"
                >
                  <svg className="text-[#1B6A50]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.9 4.6 18.8 19c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.7 12.9l-4.6-1.4c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.6.2 1.3 1.6z" />
                  </svg>
                  <span className="font-bold text-[#0F241C] text-sm">Telegram</span>
                  <span className="text-xs text-[#0F241C]/60 -mt-1 font-medium">Official channel</span>
                </a>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-card flex flex-col gap-2 rounded-2xl border border-[#0F241C]/10 p-4 hover:border-[#1B6A50] hover:bg-[#EDF4F0]/50 transition-all cursor-pointer"
                >
                  <svg className="text-[#1B6A50]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.7 3z" />
                  </svg>
                  <span className="font-bold text-[#0F241C] text-sm">YouTube</span>
                  <span className="text-xs text-[#0F241C]/60 -mt-1 font-medium">Official playlists</span>
                </a>
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-card flex flex-col gap-2 rounded-2xl border border-[#0F241C]/10 p-4 hover:border-[#1B6A50] hover:bg-[#EDF4F0]/50 transition-all cursor-pointer"
                >
                  <svg className="text-[#1B6A50]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.8v4h2.3V22.5H14V12.5h3.3l.4-4z" />
                  </svg>
                  <span className="font-bold text-[#0F241C] text-sm">Facebook</span>
                  <span className="text-xs text-[#0F241C]/60 -mt-1 font-medium">330K+ learners</span>
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/ask"
                className="inline-flex items-center justify-center gap-2 bg-[#0D3E2F] hover:bg-[#1B6A50] text-[#EDF4F0] font-bold rounded-full px-7 py-3.5 transition-all shadow-md text-sm min-h-[46px] cursor-pointer"
              >
                <span>{t("askDirectLink")}</span>
                <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
