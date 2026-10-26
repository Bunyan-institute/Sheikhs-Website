import { setRequestLocale } from "next-intl/server";
import { journeyData } from "@/data/journey";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: "Educational Journey",
    description: "A timeline of educational and professional milestones.",
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="font-heading text-4xl font-bold text-[#2D3436]">Educational Journey</h1>
        <p className="text-lg text-[#636E72] max-w-2xl mx-auto">
          A timeline of milestones, studies, and scholarly contributions.
        </p>
      </div>

      <div className="relative border-s-2 border-[#E0D8CE] ms-3 sm:ms-6 md:ms-8 space-y-10 sm:space-y-12">
        {journeyData.map((entry, idx) => {
          const isCurrent = entry.type === "current";
          return (
            <div key={idx} className="relative ps-6 sm:ps-8 md:ps-12">
              <span className={`absolute -start-[9px] top-1.5 flex h-4 w-4 rounded-full ${isCurrent ? 'bg-[#1B5E20]' : 'bg-[#FAF8F5] border-2 border-[#1B5E20]'}`}>
              </span>

              <div className="flex flex-col space-y-2">
                <span className="font-heading text-2xl font-bold text-[#1B5E20]">
                  {entry.year}
                </span>
                
                <div className="bg-white border border-[#E0D8CE] p-4 sm:p-6 rounded-[4px] shadow-sm">
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-[#2D3436] break-words">
                    {entry.title}
                  </h3>
                  
                  {entry.institution && (
                    <p className="text-[#B8860B] font-medium text-sm mt-1">
                      {entry.institution}
                    </p>
                  )}
                  
                  <p className="text-[#636E72] mt-3 leading-relaxed text-sm sm:text-base break-words">
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
