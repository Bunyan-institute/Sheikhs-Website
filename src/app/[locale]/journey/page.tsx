import { getTranslations, setRequestLocale } from "next-intl/server";
import { journeyData } from "@/data/journey";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "journey" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    description: t("subtitle"),
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "journey" });

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
              {t("timelineTitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="relative border-s-2 border-[#1D6A5A]/30 ms-4 sm:ms-8 space-y-10 sm:space-y-12">
          {journeyData.map((entry, idx) => {
            const isCurrent = entry.type === "current";
            return (
              <div key={idx} className="relative ps-7 sm:ps-12">
                {/* Timeline node */}
                <span className={`absolute -start-[9px] top-1.5 flex h-4 w-4 rounded-full ${
                  isCurrent ? 'bg-[#BF9A45] ring-4 ring-[#BF9A45]/20' : 'bg-[#EDF2EE] border-2 border-[#1D6A5A]'
                }`} />

                <div className="flex flex-col space-y-2">
                  <span className="font-display text-2xl font-bold text-[#1D6A5A]">
                    {entry.year}
                  </span>
                  
                  <div className="bg-white border border-[#14262E]/10 p-6 sm:p-7 rounded-2xl shadow-xs hover:border-[#1D6A5A]/50 transition-colors">
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-[#14262E] break-words">
                      {entry.title}
                    </h3>
                    
                    {entry.institution && (
                      <p className="text-[#BF9A45] font-semibold text-xs mt-1">
                        {entry.institution}
                      </p>
                    )}
                    
                    <p className="text-[#14262E]/70 mt-3 leading-relaxed text-sm break-words">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}