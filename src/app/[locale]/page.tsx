import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/api/profile";
import { ScholarHero } from "@/components/profile/scholar-hero";
import { HomeArticleTabs } from "@/components/home/home-article-tabs";
import { 
  ArrowRight, 
  Video, 
  Headphones, 
  Camera, 
  FileText, 
  MapPin, 
  Calendar 
} from "lucide-react";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  let profile = null;

  try {
    profile = await getProfile(locale);
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

  return (
    <div className="w-full">
      {/* ============ HERO (MIHRAB) ============ */}
      <ScholarHero
        name={profile.name}
        headline={profile.headline}
        biography={profile.biography}
        photoUrl={profile.photo?.url ?? null}
        locale={locale}
      />

      {/* ============ SANAD STRIP ============ */}
      <section className="bg-[#0A2532] text-[#EDF2EE]" aria-label="At a glance">
        <div className="mx-auto max-w-page px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8">
          <div className="px-2 lg:border-r border-[#EDF2EE]/10">
            <p className="font-display text-[1.9rem] sm:text-4xl text-[#E6D3A3] whitespace-nowrap">35+ years</p>
            <p className="mt-1 text-sm text-[#EDF2EE]/70">of halaqat and classical Islamic teaching</p>
          </div>
          <div className="px-2 lg:px-8 lg:border-r border-[#EDF2EE]/10">
            <p className="font-display text-[1.9rem] sm:text-4xl text-[#E6D3A3] whitespace-nowrap">350+ hours</p>
            <p className="mt-1 text-sm text-[#EDF2EE]/70">of recorded sermons, tafsir and lessons</p>
          </div>
          <div className="px-2 lg:px-8 lg:border-r border-[#EDF2EE]/10">
            <p className="font-display text-[1.9rem] sm:text-4xl text-[#E6D3A3] whitespace-nowrap">330K+</p>
            <p className="mt-1 text-sm text-[#EDF2EE]/70">learners following on Facebook</p>
          </div>
          <div className="px-2 lg:pl-8">
            <p className="font-display text-[1.9rem] sm:text-4xl text-[#E6D3A3] whitespace-nowrap">Africa TV</p>
            <p className="mt-1 text-sm text-[#EDF2EE]/70">televised series and exegesis programs</p>
          </div>
        </div>
      </section>

      {/* ============ MEDIA ============ */}
      <section id="media" className="relative py-20 lg:py-28">
        <div className="absolute inset-0 lattice-light pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-page px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-arabic text-2xl text-[#1D6A5A] text-left" dir="rtl" lang="ar">
                قوائم التشغيل والبرامج التلفزيونية
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-[#14262E]">
                Lecture series and broadcasts
              </h2>
              <p className="mt-4 max-w-xl text-[#14262E]/70 leading-relaxed">
                Complete halaqat, televised exegesis and lecture series, organised into official playlists you can follow from the first lesson.
              </p>
            </div>
            <Link
              href="/media"
              className="text-[#1D6A5A] font-semibold underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0F3446] transition-colors"
            >
              Browse the full media library
            </Link>
          </div>

          <div className="mt-12 grid lg:grid-cols-[1.25fr_1fr] gap-8">
            {/* Featured Riyad us-Saliheen */}
            <article className="relative bg-[#0F3446] text-[#EDF2EE] rounded-[22px] overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 lattice opacity-50 pointer-events-none" aria-hidden="true" />
              <div className="relative p-6 sm:p-10 flex flex-col h-full">
                <div className="flex items-center gap-3 text-sm text-[#E6D3A3]/90">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#EDF2EE]/10 px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BF9A45]" />Africa TV
                  </span>
                  Complete series
                </div>

                <div className="mt-8 flex gap-6 items-start">
                  <a
                    href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Play Riyad us-Saliheen on YouTube"
                    className="group shrink-0 grid place-items-center w-20 h-24 sm:w-24 sm:h-28 arch-top bg-[#BF9A45] text-[#0A2532] hover:bg-[#E6D3A3] transition-colors"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-3">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                  <div>
                    <h3 className="font-ethiopic text-2xl sm:text-[1.75rem] leading-snug" lang="am">
                      ሪያዱ ሷሊሂን በአፍሪካ ቲቪ
                    </h3>
                    <p className="mt-1 font-display text-lg text-[#E6D3A3]">
                      Riyad us-Saliheen on Africa TV
                    </p>
                  </div>
                </div>

                <p className="font-arabic mt-8 text-xl leading-loose text-[#EDF2EE]/90" dir="rtl" lang="ar">
                  سلسلة الدروس المنهجية والمحاضرات لفضيلة الشيخ محمد فرج مجنو حفظه الله
                </p>
                <p className="mt-4 text-[#EDF2EE]/75 leading-relaxed max-w-lg">
                  The celebrated television exposition of Imam an-Nawawi&apos;s Riyad us-Saliheen, explained by Sheikh Muhammed Ferej across several broadcast seasons.
                </p>

                <ul className="mt-6 space-y-2 font-ethiopic text-[15px] text-[#EDF2EE]/70" lang="am">
                  <li className="flex gap-3">
                    <span className="star-sep mt-2 shrink-0" />
                    ቀጥታ የተሟላውን የአፍሪካ ቲቪ የትምህርት ዝርዝር በቅደም ተከተል ይከታተሉ
                  </li>
                  <li className="flex gap-3">
                    <span className="star-sep mt-2 shrink-0" />
                    ያለማስታወቂያ በይፋዊው የሞባይል መተግበሪያ ላይም ይገኛል
                  </li>
                </ul>

                <div className="mt-auto pt-10 flex flex-wrap gap-3">
                  <a
                    href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#EDF2EE] text-[#0F3446] font-semibold rounded-full px-5 py-2.5 hover:bg-[#E6D3A3] transition-colors"
                  >
                    Open on YouTube
                  </a>
                  <a
                    href="#app"
                    className="inline-flex items-center rounded-full px-5 py-2.5 border border-[#EDF2EE]/30 hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors"
                  >
                    Listen offline in the app
                  </a>
                </div>
              </div>
            </article>

            {/* Other Series list */}
            <div className="flex flex-col justify-between">
              <Link
                href="/media"
                className="group block border-t border-[#14262E]/15 py-6 hover:bg-[#EDF2EE]/60 transition-colors"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#1D6A5A] font-medium">Official audio archive</span>
                  <span className="text-[#14262E]/50">350+ hours</span>
                </div>
                <h3 className="mt-2 font-ethiopic text-xl leading-snug text-[#14262E] group-hover:text-[#1D6A5A] transition-colors" lang="am">
                  የሸይኽ ሙሐመድ ፈረጅ የተሟላ የደርስና ዳዕዋ ማህደር
                </h3>
                <p className="mt-2 text-[#14262E]/70 text-[15px] leading-relaxed">
                  The primary verified YouTube archive of three decades of halaqat, Friday khutbahs and tafsir.
                </p>
              </Link>

              <Link
                href="/media"
                className="group block border-t border-[#14262E]/15 py-6 hover:bg-[#EDF2EE]/60 transition-colors"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#1D6A5A] font-medium">Africa TV</span>
                  <span className="text-[#14262E]/50">Seasonal series</span>
                </div>
                <h3 className="mt-2 font-ethiopic text-xl leading-snug text-[#14262E] group-hover:text-[#1D6A5A] transition-colors" lang="am">
                  የሐጅና ዑምራ ስነስርዓት በአፍሪካ ቲቪ
                </h3>
                <p className="mt-2 text-[#14262E]/70 text-[15px] leading-relaxed">
                  Step-by-step guidance on the rites of Hajj, Umrah and visiting the sacred sanctuaries.
                </p>
              </Link>

              <Link
                href="/media"
                className="group block border-y border-[#14262E]/15 py-6 hover:bg-[#EDF2EE]/60 transition-colors"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#1D6A5A] font-medium">Africa TV</span>
                  <span className="text-[#14262E]/50">Prophetic Seerah</span>
                </div>
                <h3 className="mt-2 font-ethiopic text-xl leading-snug text-[#14262E] group-hover:text-[#1D6A5A] transition-colors" lang="am">
                  ነቢዩ (ሰ.ዐ.ወ) በሌሎች አንደበት
                </h3>
                <p className="mt-2 text-[#14262E]/70 text-[15px] leading-relaxed">
                  A scholarly series on historical testimonies and recognitions of the Prophet Muhammad (ﷺ) from around the world.
                </p>
              </Link>
            </div>
          </div>

          {/* Media shelf */}
          <div className="mt-16">
            <p className="font-arabic text-xl text-[#1D6A5A] text-left" dir="rtl" lang="ar">
              المكتبة المرئية والصوتية
            </p>
            <h3 className="mt-1 font-display text-2xl text-[#14262E]">
              Listen, watch and study
            </h3>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#14262E]/15 border border-[#14262E]/15 rounded-2xl overflow-hidden">
              <Link href="/media?kind=videos" className="group bg-[#EDF2EE] p-6 hover:bg-white transition-colors">
                <Video className="text-[#1D6A5A] w-7 h-7" />
                <p className="mt-4 font-semibold text-[#14262E]">Video discourses</p>
                <p className="text-sm text-[#14262E]/60">Africa TV and YouTube</p>
              </Link>
              <Link href="/media?kind=audio" className="group bg-[#EDF2EE] p-6 hover:bg-white transition-colors">
                <Headphones className="text-[#1D6A5A] w-7 h-7" />
                <p className="mt-4 font-semibold text-[#14262E]">Audio exegesis</p>
                <p className="text-sm text-[#14262E]/60">Riyad us-Saliheen series</p>
              </Link>
              <Link href="/media?kind=photos" className="group bg-[#EDF2EE] p-6 hover:bg-white transition-colors">
                <Camera className="text-[#1D6A5A] w-7 h-7" />
                <p className="mt-4 font-semibold text-[#14262E]">Photo archives</p>
                <p className="text-sm text-[#14262E]/60">Historical da&apos;wah timeline</p>
              </Link>
              <Link href="/media?kind=documents" className="group bg-[#EDF2EE] p-6 hover:bg-white transition-colors">
                <FileText className="text-[#1D6A5A] w-7 h-7" />
                <p className="mt-4 font-semibold text-[#14262E]">Study documents</p>
                <p className="text-sm text-[#14262E]/60">Syllabi and curriculum PDFs</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ARTICLES & LESSONS ============ */}
      <section id="knowledge" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-arabic text-2xl text-[#1D6A5A] text-left" dir="rtl" lang="ar">
                البحوث والمقالات
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-[#14262E]">
                Articles and lessons
              </h2>
              <p className="mt-4 max-w-xl text-[#14262E]/70 leading-relaxed">
                Written lessons by the Sheikh, each with its Qur&apos;anic and hadith references.
              </p>
            </div>
            <Link
              href="/articles"
              className="text-[#1D6A5A] font-semibold underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0F3446] transition-colors"
            >
              View all articles
            </Link>
          </div>

          <div className="mt-10">
            <HomeArticleTabs />
          </div>
        </div>
      </section>

      {/* ============ HADITH BAND ============ */}
      <section className="relative bg-[#1D6A5A] text-[#EDF2EE] overflow-hidden">
        <div className="absolute inset-0 lattice opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-[#E6D3A3]/60" />
            <span className="star-sep" />
            <span className="h-px w-16 bg-[#E6D3A3]/60" />
          </div>
          <blockquote className="mt-8">
            <p className="font-arabic text-3xl sm:text-[2.6rem] leading-[1.8]" dir="rtl" lang="ar">
              مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا<br />
              سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
            </p>
            <p className="mt-6 font-display text-xl sm:text-2xl text-[#E6D3A3] leading-relaxed">
              &ldquo;Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise.&rdquo;
            </p>
            <footer className="mt-4 text-[#EDF2EE]/70 text-sm">
              Sahih Muslim
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <section id="events" className="py-20 lg:py-28">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-arabic text-2xl text-[#1D6A5A] text-left" dir="rtl" lang="ar">
                اللقاءات العلمية
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-[#14262E]">
                Gatherings and seminars
              </h2>
            </div>
            <Link
              href="/events"
              className="text-[#1D6A5A] font-semibold underline decoration-[#BF9A45] underline-offset-4 hover:text-[#0F3446] transition-colors"
            >
              View the calendar
            </Link>
          </div>

          <div className="mt-12 grid lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Upcoming Event */}
            <article className="rounded-[22px] bg-[#0F3446] text-[#EDF2EE] p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-16 -bottom-16 w-72 h-72 lattice opacity-60 rounded-full pointer-events-none" aria-hidden="true" />
              <div>
                <p className="relative text-[#E6D3A3] text-sm font-medium">Next gathering</p>
                <div className="relative mt-6 flex gap-6 sm:gap-8 items-start">
                  <div className="shrink-0 w-24 arch-top bg-[#BF9A45] text-[#0A2532] text-center pt-6 pb-4 shadow-md">
                    <p className="font-display text-5xl leading-none">15</p>
                    <p className="mt-1 text-sm font-semibold">Nov 2026</p>
                  </div>
                  <div>
                    <h3 className="font-ethiopic text-2xl leading-snug" lang="am">
                      እስላማዊ ባንኪንግና የሸሪዓ አስተዳደር አውደ ጥናት
                    </h3>
                    <p className="mt-2 font-display text-lg text-[#E6D3A3]">
                      Islamic banking and Sharia governance workshop
                    </p>
                    <p className="mt-5 flex items-center gap-2 text-[#EDF2EE]/80 text-[15px]">
                      <MapPin className="w-4 h-4 text-[#BF9A45] shrink-0" />
                      Wegagen Bank Headquarters Hall
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative mt-10 flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className="inline-flex bg-[#EDF2EE] text-[#0F3446] font-semibold rounded-full px-5 py-2.5 hover:bg-[#E6D3A3] transition-colors"
                >
                  Register to attend
                </Link>
                <Link
                  href="/events"
                  className="inline-flex rounded-full px-5 py-2.5 border border-[#EDF2EE]/30 hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors"
                >
                  Add to calendar
                </Link>
              </div>
            </article>

            {/* Recently held */}
            <div>
              <p className="text-sm font-medium text-[#14262E]/60">Recently held</p>
              <ul className="mt-3">
                <li className="flex gap-5 border-t border-[#14262E]/15 py-6">
                  <div className="w-16 shrink-0 text-center">
                    <p className="font-display text-3xl text-[#1D6A5A] leading-none">25</p>
                    <p className="text-xs text-[#14262E]/60 mt-1">Oct 2026</p>
                  </div>
                  <div>
                    <h3 className="font-ethiopic text-lg leading-snug text-[#14262E]" lang="am">
                      የሪያዱ ሷሊሂን ዓመታዊ ጉባኤ
                    </h3>
                    <p className="text-[15px] text-[#14262E]/70">Annual Riyad us-Saliheen Conference</p>
                    <p className="mt-1 text-sm text-[#14262E]/55">Addis Ababa Cultural &amp; Conference Hall</p>
                  </div>
                </li>
                <li className="flex gap-5 border-y border-[#14262E]/15 py-6">
                  <div className="w-16 shrink-0 text-center">
                    <p className="font-display text-3xl text-[#1D6A5A] leading-none">9</p>
                    <p className="text-xs text-[#14262E]/60 mt-1">Oct 2026</p>
                  </div>
                  <div>
                    <h3 className="font-ethiopic text-lg leading-snug text-[#14262E]" lang="am">
                      የጁምዓ ኹጥባህ — የተውሂድና የተረጋጋ ልብ ፋይዳ
                    </h3>
                    <p className="text-[15px] text-[#14262E]/70">Friday khutbah on tawhid and a tranquil heart</p>
                    <p className="mt-1 text-sm text-[#14262E]/55">Al-Fajr Mosque</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ APP + ASK ============ */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-page px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
          {/* App Card */}
          <article id="app" className="rounded-[22px] bg-[#0A2532] text-[#EDF2EE] p-6 sm:p-10 relative overflow-hidden scroll-mt-24 flex flex-col justify-between">
            <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
            <div>
              <div className="relative flex gap-6 items-start">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#BF9A45] grid place-items-center shadow-md">
                  <span className="font-arabic text-3xl text-[#0A2532] leading-none -mt-1">م</span>
                </div>
                <div>
                  <h2 className="font-display text-3xl">The Sheikh&apos;s app</h2>
                  <p className="mt-1 font-ethiopic text-[#E6D3A3]" lang="am">ሸይኽ ሙሃመድ ፈረጅ</p>
                </div>
              </div>
              <p className="relative mt-6 text-[#EDF2EE]/75 leading-relaxed max-w-md">
                Every series in order, without ads. Download lessons once and keep listening offline, wherever you are.
              </p>
            </div>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#EDF2EE] text-[#0A2532] rounded-xl px-4 py-2.5 hover:bg-[#E6D3A3] transition-colors shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 3.5v17l10-8.5zM15.5 13.3 18 15.5l3-1.7c.8-.5.8-1.3 0-1.8l-3-1.7-2.5 2.2z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[11px] text-[#0A2532]/70 font-medium">Get it on</span>
                  <span className="block font-semibold">Google Play</span>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-[#EDF2EE]/30 rounded-xl px-4 py-2.5 hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-.9-2.5-3.6zM14.1 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[11px] text-[#EDF2EE]/70 font-medium">Download on the</span>
                  <span className="block font-semibold">App Store</span>
                </span>
              </a>
            </div>
          </article>

          {/* Ask the Sheikh */}
          <article id="ask" className="rounded-[22px] bg-white border border-[#14262E]/10 p-6 sm:p-10 scroll-mt-24 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-3xl text-[#14262E]">Ask the Sheikh</h2>
              <p className="mt-3 text-[#14262E]/70 leading-relaxed max-w-md">
                Send a question on worship, family life or Islamic finance. Answers of general benefit are shared with learners in the fatwa archive.
              </p>
              <div className="mt-8 grid sm:grid-cols-3 gap-3">
                <a
                  href="https://t.me/ustazmuhammadferej"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 rounded-2xl border border-[#14262E]/15 p-4 hover:border-[#1D6A5A] hover:bg-[#EDF2EE] transition-colors"
                >
                  <svg className="text-[#1D6A5A]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.9 4.6 18.8 19c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.7 12.9l-4.6-1.4c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.6.2 1.3 1.6z" />
                  </svg>
                  <span className="font-semibold text-[#14262E]">Telegram</span>
                  <span className="text-sm text-[#14262E]/60 -mt-2">Official channel</span>
                </a>
                <a
                  href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 rounded-2xl border border-[#14262E]/15 p-4 hover:border-[#1D6A5A] hover:bg-[#EDF2EE] transition-colors"
                >
                  <svg className="text-[#1D6A5A]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.7 3z" />
                  </svg>
                  <span className="font-semibold text-[#14262E]">YouTube</span>
                  <span className="text-sm text-[#14262E]/60 -mt-2">Official playlists</span>
                </a>
                <a
                  href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 rounded-2xl border border-[#14262E]/15 p-4 hover:border-[#1D6A5A] hover:bg-[#EDF2EE] transition-colors"
                >
                  <svg className="text-[#1D6A5A]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.8v4h2.3V22.5H14V12.5h3.3l.4-4z" />
                  </svg>
                  <span className="font-semibold text-[#14262E]">Facebook</span>
                  <span className="text-sm text-[#14262E]/60 -mt-2">330K+ learners</span>
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/ask"
                className="inline-flex bg-[#0F3446] text-[#EDF2EE] font-semibold rounded-full px-6 py-3 hover:bg-[#1D6A5A] transition-colors shadow-sm"
              >
                Send a question
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}