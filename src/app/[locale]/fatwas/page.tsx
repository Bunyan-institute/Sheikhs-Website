import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwas } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fatwas" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
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
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <section className="space-y-6">
          {fatwas.length > 0 ? (
            fatwas.map((fatwa) => (
              <Link key={fatwa.id} href={`/fatwas/${fatwa.slug}`} className="block group">
                <article className="border border-[#14262E]/10 bg-white rounded-2xl p-6 sm:p-7 hover:border-[#1D6A5A] transition-all shadow-xs relative overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
                    {fatwa.categories?.[0] && (
                      <span className="text-[#1D6A5A] font-semibold uppercase tracking-wider text-[11px] bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 px-3 py-0.5 rounded-full">
                        {fatwa.categories[0]}
                      </span>
                    )}
                    <span className="text-[#14262E]/50">
                      {formatDate(fatwa.published_at, locale)}
                    </span>
                    <span className="text-[#1D6A5A] font-medium ms-auto flex items-center gap-1.5 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#BF9A45]" /> Verified Ruling
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#14262E] mb-3 group-hover:text-[#1D6A5A] transition-colors break-words">
                    {fatwa.title}
                  </h3>
                  
                  {fatwa.question && (
                    <div className="bg-[#EDF2EE] border border-[#BF9A45]/30 rounded-xl p-4 mb-3">
                      <p className="text-[#14262E] text-xs sm:text-sm line-clamp-2 break-words leading-relaxed">
                        <span className="text-[#BF9A45] font-semibold me-2">Inquiry:</span>
                        {fatwa.question}
                      </p>
                    </div>
                  )}
                  
                  {fatwa.summary && (
                    <p className="text-[#14262E]/75 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                      {fatwa.summary}
                    </p>
                  )}
                  
                  <div className="text-[#BF9A45] font-semibold text-xs flex items-center gap-1.5 pt-3 border-t border-[#14262E]/10">
                    <span>Read Jurisprudential Ruling &amp; Evidences</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center border border-[#14262E]/10 bg-white rounded-2xl p-8">
              <HelpCircle className="w-12 h-12 text-[#14262E]/30 mx-auto mb-3" />
              <p className="text-[#14262E]/60 text-sm">No verified fatwas found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}