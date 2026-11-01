import { getTranslations, setRequestLocale } from "next-intl/server";
import { qualifications } from "@/data/qualifications";
import { Award, GraduationCap, ShieldCheck, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej`,
    description: t("verifiedCertifications"),
  };
}

const typeConfig: Record<string, { label: string, color: string }> = {
  ijazah: { label: "Traditional Ijazah", color: "bg-[#FAF8F5] text-[#1A4D2E] border-[#1A4D2E]/30" },
  academic: { label: "University Degree", color: "bg-[#FAF8F5] text-[#8C6D23] border-[#B8860B]/40" },
  certificate: { label: "Certified Qualification", color: "bg-[#FAF8F5] text-[#2D3436] border-[#E6E0D8]" },
  other: { label: "Accreditation", color: "bg-[#FAF8F5] text-[#555E61] border-[#E6E0D8]" }
};

export default async function QualificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });

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
            {t("verifiedCertifications")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qualifications.map((qual) => {
          const config = typeConfig[qual.type] || typeConfig.other;

          return (
            <div key={qual.id} className="bg-white border border-[#E6E0D8] rounded-[4px] p-5 sm:p-6 hover:border-[#1A4D2E] transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-[2px] border ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-[#7A8285] text-xs font-semibold bg-[#FAF8F5] px-2 py-0.5 rounded-[2px] border border-[#E6E0D8]">
                  {qual.year}
                </span>
              </div>
              
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#2D3436] mb-1.5 break-words">
                {qual.title}
              </h3>
              
              <p className="text-[#8C6D23] font-semibold text-xs mb-3 pb-3 border-b border-[#FAF8F5] break-words">
                {qual.issuer}
              </p>
              
              <p className="text-[#555E61] leading-relaxed text-xs sm:text-sm break-words">
                {qual.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
