import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwas } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight, HelpCircle, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fatwas" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej`,
    description: t("description"),
  };
}

export default async function FatwasPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fatwas" });
  
  const { category } = await searchParams;

  const fatwasRes = await getFatwas({ locale, category: category ? [category] : undefined });
  const fatwas = fatwasRes?.data || [];

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
            {t("description")}
          </p>
        </div>
      </header>

      <section className="mb-16">
        {fatwas.length > 0 ? (
          <div className="space-y-4">
            {fatwas.map((fatwa) => (
              <Link key={fatwa.id} href={`/fatwas/${fatwa.slug}`} className="block group">
                <div className="border border-[#E6E0D8] bg-white rounded-[4px] p-5 sm:p-6 hover:border-[#1A4D2E] transition-colors relative overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
                    {fatwa.categories?.[0] && (
                      <span className="text-[#1A4D2E] font-bold uppercase tracking-wider text-[11px] bg-[#FAF8F5] border border-[#E6E0D8] px-2.5 py-0.5 rounded-[2px]">
                        {fatwa.categories[0]}
                      </span>
                    )}
                    <span className="text-[#7A8285]">
                      {formatDate(fatwa.published_at, locale)}
                    </span>
                    <span className="text-[#1A4D2E] font-semibold ms-auto flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Ruling
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1A4D2E] transition-colors break-words">
                    {fatwa.title}
                  </h3>
                  
                  {fatwa.question && (
                    <div className="bg-[#FAF8F5] border border-[#E6E0D8] rounded-[3px] p-3.5 mb-3">
                      <p className="text-[#2D3436] text-xs sm:text-sm line-clamp-2 break-words leading-relaxed">
                        <span className="text-[#8C6D23] font-bold me-2">Inquiry:</span>
                        {fatwa.question}
                      </p>
                    </div>
                  )}
                  
                  {fatwa.summary && (
                    <p className="text-[#555E61] text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                      {fatwa.summary}
                    </p>
                  )}
                  
                  <div className="text-[#8C6D23] font-semibold text-xs flex items-center gap-1.5 pt-2 border-t border-[#FAF8F5]">
                    <span>Read Jurisprudential Ruling &amp; Evidences</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E6E0D8] bg-white rounded-[4px]">
            <p className="text-[#555E61] text-sm">No fatwas recorded in this category.</p>
          </div>
        )}
      </section>

      {/* Direct Scholarly Inquiry Section */}
      <section className="bg-white border border-[#E6E0D8] rounded-[4px] p-8 text-center max-w-3xl mx-auto space-y-4">
        <HelpCircle className="w-10 h-10 text-[#1A4D2E] mx-auto" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#2D3436]">
          Submit a Jurisprudential Question
        </h2>
        <p className="text-[#555E61] text-sm max-w-xl mx-auto leading-relaxed">
          Questions regarding worship, transactions, Islamic inheritance, or modern banking can be directly submitted to Sheikh Muhammed Ferej Megeno.
        </p>
        <div className="pt-2">
          <Link 
            href="/ask" 
            className="inline-flex items-center gap-2 bg-[#1A4D2E] text-white px-6 py-3 rounded-[4px] font-semibold text-xs sm:text-sm hover:bg-[#143d24]"
          >
            <span>Submit Inquiry to the Sheikh</span>
            <ArrowRight className="w-4 h-4 text-[#B8860B]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
