import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/api/profile";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Award, ShieldCheck, GraduationCap, BookOpen, MapPin, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  let profile;
  try {
    profile = await getProfile(locale);
  } catch {
    profile = null;
  }
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej`,
    description: profile?.biography?.slice(0, 160) ?? t("experience"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  
  let profile;
  try {
    profile = await getProfile(locale);
  } catch (error) {
    console.error("Failed to load profile", error);
  }

  if (!profile) return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-20 text-center text-[#555E61]">
      <p>Unable to synchronize profile data.</p>
    </div>
  );

  const photoUrl = profile.photo?.url;

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t("experience")}
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <aside className="lg:w-1/3 shrink-0 space-y-6">
          {/* Classical Manuscript Double Hairline Frame */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto lg:mx-0 aspect-square rounded-[4px] p-2 bg-white border border-[#E6E0D8] shadow-xs relative">
            <div className="w-full h-full rounded-[2px] overflow-hidden bg-[#FAF8F5] relative flex items-center justify-center border border-[#B8860B]/40">
              {photoUrl ? (
                <Image src={photoUrl} alt={profile.name || "Scholar"} fill className="object-cover" priority />
              ) : (
                <div className="text-8xl font-heading font-bold text-[#1A4D2E]">
                  {(profile.name || "S").charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-5 bg-white border border-[#E6E0D8] p-5 rounded-[4px]">
            <div>
              <div className="font-arabic text-base text-[#8C6D23] font-bold" dir="rtl">
                فضيلة الشيخ محمد فرج مجنو
              </div>
              <h2 className="font-heading text-xl font-bold text-[#2D3436] break-words">{profile.name}</h2>
              {profile.headline && (
                <p className="text-xs text-[#1A4D2E] font-semibold mt-1">{profile.headline}</p>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6E0D8] text-xs">
              {profile.location && (
                <div className="flex items-center gap-2.5 text-[#555E61]">
                  <MapPin className="w-4 h-4 text-[#8C6D23] shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div className="flex items-center gap-2.5 text-[#555E61]">
                  <Globe className="w-4 h-4 text-[#1A4D2E] shrink-0" />
                  <span>{t("languages")}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E6E0D8]">
              <div className="flex items-center gap-2 text-xs text-[#1A4D2E] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t("aaoifiCertified")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A4D2E] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t("credentialsNotice")}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:w-2/3 space-y-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-4 pb-2 border-b border-[#E6E0D8]">
              Scholarly Biography &amp; Formative Training
            </h2>
            <article className="prose prose-slate max-w-none text-[#555E61] font-body text-base leading-relaxed whitespace-pre-wrap break-words">
              {profile.biography}
            </article>
          </div>

          {/* Institutional Highlights */}
          <div className="pt-6 border-t border-[#E6E0D8]">
            <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-4">
              Institutional Appointments &amp; Public Leadership
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-[#B8860B]" />
                  <span className="text-[11px] uppercase font-bold text-[#1A4D2E] tracking-wider">Islamic Banking</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#2D3436]">Sharia Banking Consultant</h4>
                <p className="text-xs text-[#555E61] mt-1">Wegagen Bank — Amanah Window (AAOIFI Standard Compliance)</p>
              </div>
              <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1A4D2E]" />
                  <span className="text-[11px] uppercase font-bold text-[#1A4D2E] tracking-wider">Pan-African Council</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#2D3436]">African Scholars Union</h4>
                <p className="text-xs text-[#555E61] mt-1">Active contributor to continental Islamic jurisprudence and scholarly fatwas.</p>
              </div>
              <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <GraduationCap className="w-4 h-4 text-[#B8860B]" />
                  <span className="text-[11px] uppercase font-bold text-[#1A4D2E] tracking-wider">Foundation Leadership</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#2D3436]">President, Al-Fajr Islamic Foundation</h4>
                <p className="text-xs text-[#555E61] mt-1">Overseeing Islamic education, community welfare, and halaqat centers in Addis Ababa.</p>
              </div>
              <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen className="w-4 h-4 text-[#1A4D2E]" />
                  <span className="text-[11px] uppercase font-bold text-[#1A4D2E] tracking-wider">Quranic Exegesis</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#2D3436]">Mukhtasar Tafsir Translator</h4>
                <p className="text-xs text-[#555E61] mt-1">Co-translator of the authorized Amharic Mukhtasar Tafsir (Summary Exegesis of the Holy Quran).</p>
              </div>
            </div>
          </div>

          {/* Direct Modules Linkage */}
          <div className="pt-6 border-t border-[#E6E0D8]">
            <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-4">
              {t("academicCredentials")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/journey" className="block p-4 bg-white border border-[#E6E0D8] rounded-[4px] hover:border-[#1A4D2E] transition-colors group">
                <div className="text-[11px] font-bold text-[#1A4D2E] uppercase tracking-wider mb-1">Timeline</div>
                <div className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] flex items-center justify-between">
                  <span>{t("viewJourney")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23]" />
                </div>
                <div className="text-xs text-[#7A8285] mt-1">From Silti &amp; Jimma Halaqat to postgraduate honors.</div>
              </Link>
              <Link href="/qualifications" className="block p-4 bg-white border border-[#E6E0D8] rounded-[4px] hover:border-[#1A4D2E] transition-colors group">
                <div className="text-[11px] font-bold text-[#1A4D2E] uppercase tracking-wider mb-1">Credentials</div>
                <div className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] flex items-center justify-between">
                  <span>{t("viewQualifications")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23]" />
                </div>
                <div className="text-xs text-[#7A8285] mt-1">AAOIFI auditor diploma and traditional chains.</div>
              </Link>
              <a href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-[#E6E0D8] rounded-[4px] hover:border-[#1A4D2E] transition-colors group">
                <div className="text-[11px] font-bold text-[#1A4D2E] uppercase tracking-wider mb-1">Official Mobile App</div>
                <div className="font-heading font-bold text-sm text-[#2D3436] group-hover:text-[#1A4D2E] flex items-center justify-between">
                  <span>ሸይኽ ሙሃመድ ፈረጅ</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23]" />
                </div>
                <div className="text-xs text-[#7A8285] mt-1">Free Android App on Google Play Store with offline halaqat.</div>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
