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
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("timelineTitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="relative border-s-2 border-[#1B6A50]/30 ms-3 sm:ms-8 space-y-8 sm:space-y-12">
          {journeyData.map((entry, idx) => {
            const isCurrent = entry.type === "current";
            return (
              <div key={idx} className="relative ps-6 sm:ps-12">
                {/* Timeline node */}
                <span className={`absolute -start-[9px] top-1.5 flex h-4 w-4 rounded-full ${
                  isCurrent ? 'bg-[#BF9A45] ring-4 ring-[#BF9A45]/20' : 'bg-[#EDF4F0] border-2 border-[#1B6A50]'
                }`} />

                <div className="flex flex-col space-y-2">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#1B6A50]">
                    {entry.year}
                  </span>
                  
                  <div className="bg-white border border-[#0F241C]/10 p-5 sm:p-7 rounded-2xl shadow-xs hover:border-[#1B6A50]/50 transition-colors">
                    <h3 className="text-base sm:text-xl font-display font-semibold text-[#0F241C] break-words">
                      {entry.title}
                    </h3>
                    
                    {entry.institution && (
                      <p className="text-[#BF9A45] font-semibold text-xs mt-1">
                        {entry.institution}
                      </p>
                    )}
                    
                    <p className="text-[#0F241C]/75 mt-3 leading-relaxed text-xs sm:text-sm break-words">
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
