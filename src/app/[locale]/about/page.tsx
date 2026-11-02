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
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
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
    <div className="max-w-page mx-auto px-4 sm:px-6 py-20 text-center text-[#14262E]/70">
      <p>Unable to synchronize profile data.</p>
    </div>
  );

  const photoUrl = profile.photo?.url;

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0F3446] text-[#EDF2EE] py-16 overflow-hidden">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/80 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[#EDF2EE]">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-[#EDF2EE]/75 max-w-xl font-sans leading-relaxed">
              {t("experience")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Aside: Portrait and Credentials */}
          <aside className="lg:w-1/3 shrink-0 space-y-6">
            <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto lg:mx-0 aspect-square rounded-2xl p-2 bg-white border border-[#BF9A45]/40 shadow-sm relative overflow-hidden">
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#EDF2EE] relative flex items-center justify-center">
                {photoUrl ? (
                  <Image src={photoUrl} alt={profile.name || "Scholar"} fill className="object-cover" priority />
                ) : (
                  <div className="text-8xl font-display text-[#1D6A5A]">
                    {(profile.name || "S").charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-5 bg-white border border-[#14262E]/10 p-6 rounded-2xl shadow-xs">
              <div>
                <p className="font-arabic text-xl text-[#1D6A5A] font-bold" dir="rtl">
                  فضيلة الشيخ محمد فرج مجنو
                </p>
                <h2 className="mt-1 font-display text-2xl text-[#14262E] break-words">
                  {profile.name}
                </h2>
                {profile.headline && (
                  <p className="text-xs text-[#1D6A5A] font-semibold mt-1">
                    {profile.headline}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-[#14262E]/10 text-xs">
                {profile.location && (
                  <div className="flex items-center gap-2.5 text-[#14262E]/70">
                    <MapPin className="w-4 h-4 text-[#BF9A45] shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-2.5 text-[#14262E]/70">
                    <Globe className="w-4 h-4 text-[#1D6A5A] shrink-0" />
                    <span>{t("languages")}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#14262E]/10">
                <div className="flex items-center gap-2 text-xs text-[#1D6A5A] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("aaoifiCertified")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#1D6A5A] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("credentialsNotice")}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Body: Biography & Appointments */}
          <main className="lg:w-2/3 space-y-10">
            <div className="bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="font-display text-2xl sm:text-3xl text-[#14262E] mb-4 pb-3 border-b border-[#14262E]/10">
                Scholarly Biography &amp; Formative Training
              </h2>
              <article className="prose prose-slate max-w-none text-[#14262E]/80 font-sans text-base leading-relaxed whitespace-pre-wrap break-words">
                {profile.biography}
              </article>
            </div>

            {/* Institutional Highlights */}
            <div className="bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 className="font-display text-2xl text-[#14262E] mb-6">
                Institutional Appointments &amp; Public Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#EDF2EE]/60 border border-[#14262E]/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#BF9A45]" />
                    <span className="text-[11px] uppercase font-bold text-[#1D6A5A] tracking-wider">Islamic Banking</span>
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#14262E]">Sharia Banking Consultant</h4>
                  <p className="text-xs text-[#14262E]/70 mt-1 leading-relaxed">Wegagen Bank — Amanah Window (AAOIFI Standard Compliance)</p>
                </div>
                <div className="bg-[#EDF2EE]/60 border border-[#14262E]/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#1D6A5A]" />
                    <span className="text-[11px] uppercase font-bold text-[#1D6A5A] tracking-wider">Pan-African Council</span>
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#14262E]">African Scholars Union</h4>
                  <p className="text-xs text-[#14262E]/70 mt-1 leading-relaxed">Active contributor to continental Islamic jurisprudence and scholarly fatwas.</p>
                </div>
                <div className="bg-[#EDF2EE]/60 border border-[#14262E]/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-[#BF9A45]" />
                    <span className="text-[11px] uppercase font-bold text-[#1D6A5A] tracking-wider">Foundation Leadership</span>
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#14262E]">President, Al-Fajr Islamic Foundation</h4>
                  <p className="text-xs text-[#14262E]/70 mt-1 leading-relaxed">Overseeing Islamic education, community welfare, and halaqat centers in Addis Ababa.</p>
                </div>
                <div className="bg-[#EDF2EE]/60 border border-[#14262E]/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#1D6A5A]" />
                    <span className="text-[11px] uppercase font-bold text-[#1D6A5A] tracking-wider">Quranic Exegesis</span>
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#14262E]">Mukhtasar Tafsir Translator</h4>
                  <p className="text-xs text-[#14262E]/70 mt-1 leading-relaxed">Co-translator of the authorized Amharic Mukhtasar Tafsir (Summary Exegesis of the Holy Quran).</p>
                </div>
              </div>
            </div>

            {/* Direct Modules Linkage */}
            <div className="pt-2">
              <h3 className="font-display text-2xl text-[#14262E] mb-5">
                {t("academicCredentials")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/journey" className="block p-5 bg-white border border-[#14262E]/10 rounded-2xl hover:border-[#1D6A5A] transition-all group shadow-xs">
                  <div className="text-[11px] font-bold text-[#1D6A5A] uppercase tracking-wider mb-1">Timeline</div>
                  <div className="font-display font-semibold text-base text-[#14262E] group-hover:text-[#1D6A5A] flex items-center justify-between">
                    <span>{t("viewJourney")}</span>
                    <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
                  </div>
                  <div className="text-xs text-[#14262E]/60 mt-1.5 leading-relaxed">From Silti &amp; Jimma Halaqat to postgraduate honors.</div>
                </Link>
                <Link href="/qualifications" className="block p-5 bg-white border border-[#14262E]/10 rounded-2xl hover:border-[#1D6A5A] transition-all group shadow-xs">
                  <div className="text-[11px] font-bold text-[#1D6A5A] uppercase tracking-wider mb-1">Credentials</div>
                  <div className="font-display font-semibold text-base text-[#14262E] group-hover:text-[#1D6A5A] flex items-center justify-between">
                    <span>{t("viewQualifications")}</span>
                    <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
                  </div>
                  <div className="text-xs text-[#14262E]/60 mt-1.5 leading-relaxed">AAOIFI auditor diploma and traditional chains.</div>
                </Link>
                <a href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej" target="_blank" rel="noopener noreferrer" className="block p-5 bg-white border border-[#14262E]/10 rounded-2xl hover:border-[#1D6A5A] transition-all group shadow-xs">
                  <div className="text-[11px] font-bold text-[#1D6A5A] uppercase tracking-wider mb-1">Official Mobile App</div>
                  <div className="font-display font-semibold text-base text-[#14262E] group-hover:text-[#1D6A5A] flex items-center justify-between">
                    <span>ሸይኽ ሙሃመድ ፈረጅ</span>
                    <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
                  </div>
                  <div className="text-xs text-[#14262E]/60 mt-1.5 leading-relaxed">Free Android App on Google Play Store with offline halaqat.</div>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}