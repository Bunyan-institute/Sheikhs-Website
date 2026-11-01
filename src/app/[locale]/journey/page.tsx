import { getTranslations, setRequestLocale } from "next-intl/server";
import { journeyData } from "@/data/journey";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "journey" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej`,
    description: t("subtitle"),
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "journey" });

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-12 pb-6 border-b border-[#E6E0D8]">
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
            {t("timelineTitle")}
          </p>
        </div>
      </header>

      <div className="max-w-4xl relative border-s-2 border-[#E6E0D8] ms-3 sm:ms-6 md:ms-8 space-y-8 sm:space-y-10">
        {journeyData.map((entry, idx) => {
          const isCurrent = entry.type === "current";
          return (
            <div key={idx} className="relative ps-6 sm:ps-8 md:ps-12">
              <span className={`absolute -start-[9px] top-1.5 flex h-4 w-4 rounded-full ${isCurrent ? 'bg-[#1A4D2E]' : 'bg-[#FAF8F5] border-2 border-[#1A4D2E]'}`}>
              </span>

              <div className="flex flex-col space-y-2">
                <span className="font-heading text-xl sm:text-2xl font-bold text-[#1A4D2E]">
                  {entry.year}
                </span>
                
                <div className="bg-white border border-[#E6E0D8] p-5 sm:p-6 rounded-[4px]">
                  <h3 className="text-base sm:text-lg font-heading font-bold text-[#2D3436] break-words">
                    {entry.title}
                  </h3>
                  
                  {entry.institution && (
                    <p className="text-[#8C6D23] font-semibold text-xs mt-1">
                      {entry.institution}
                    </p>
                  )}
                  
                  <p className="text-[#555E61] mt-2.5 leading-relaxed text-xs sm:text-sm break-words">
                    {entry.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
