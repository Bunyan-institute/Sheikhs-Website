import { getTranslations, setRequestLocale } from "next-intl/server";
import { qualifications } from "@/data/qualifications";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    description: t("verifiedCertifications"),
  };
}

const typeConfig: Record<string, { label: string, color: string }> = {
  ijazah: { label: "Traditional Ijazah", color: "bg-[#1B6A50]/10 text-[#1B6A50] border-[#1B6A50]/30" },
  academic: { label: "University Degree", color: "bg-[#BF9A45]/15 text-[#072118] border-[#BF9A45]/40" },
  certificate: { label: "Certified Qualification", color: "bg-[#0D3E2F]/10 text-[#0D3E2F] border-[#0D3E2F]/20" },
  other: { label: "Accreditation", color: "bg-[#0F241C]/5 text-[#0F241C]/80 border-[#0F241C]/15" }
};

export default async function QualificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });

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
              {t("verifiedCertifications")}
            </p>
          </div>
        </div>
      </section>

      {/* Qualifications Cards Grid */}
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {qualifications.map((qual) => {
            const config = typeConfig[qual.type] || typeConfig.other;

            return (
              <div
                key={qual.id}
                className="bg-white border border-[#0F241C]/10 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#1B6A50] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className={`px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[#0F241C]/60 text-xs font-semibold bg-[#EDF4F0] px-2.5 py-0.5 rounded-full border border-[#0F241C]/10">
                      {qual.year}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0F241C] mb-2 break-words">
                    {qual.title}
                  </h3>
                  
                  <p className="text-[#BF9A45] font-semibold text-xs mb-4 pb-3 border-b border-[#0F241C]/10 break-words">
                    {qual.issuer}
                  </p>
                  
                  <p className="text-[#0F241C]/75 leading-relaxed text-xs sm:text-sm break-words">
                    {qual.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
