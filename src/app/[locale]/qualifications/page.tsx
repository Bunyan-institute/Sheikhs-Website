import { setRequestLocale } from "next-intl/server";
import { qualifications } from "@/data/qualifications";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: "Qualifications & Ijazat",
    description: "Academic degrees and traditional Islamic authorizations.",
  };
}

const typeConfig: Record<string, { label: string, color: string }> = {
  ijazah: { label: "Ijazah", color: "bg-[#1B5E20]/10 text-[#1B5E20] border-[#1B5E20]/20" },
  academic: { label: "Academic Degree", color: "bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/20" },
  certificate: { label: "Certificate", color: "bg-[#2D3436]/10 text-[#2D3436] border-[#2D3436]/20" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700 border-gray-200" }
};

export default async function QualificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Grouping the qualifications could be done here if needed
  // For now, rendering in a clean grid as requested

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 md:py-24">
      <div className="mb-12 space-y-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D3436]">Qualifications & Ijazat</h1>
        <p className="text-lg text-[#636E72] max-w-3xl">
          Academic achievements and traditional authorizations granted by esteemed institutions and scholars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qualifications.map((qual) => {
          const config = typeConfig[qual.type] || typeConfig.other;

          return (
            <div key={qual.id} className="bg-white border border-[#E0D8CE] rounded-[4px] p-5 sm:p-6 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-[#636E72] text-sm font-medium bg-[#FAF8F5] px-2 py-1 rounded border border-[#E0D8CE]">
                  {qual.year}
                </span>
              </div>
              
              <h3 className="font-heading text-lg sm:text-xl font-semibold text-[#2D3436] mb-2 break-words">
                {qual.title}
              </h3>
              
              <p className="text-[#B8860B] font-medium text-sm mb-4 pb-4 border-b border-[#E0D8CE] break-words">
                {qual.issuer}
              </p>
              
              <p className="text-[#636E72] leading-relaxed text-sm sm:text-base break-words">
                {qual.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
