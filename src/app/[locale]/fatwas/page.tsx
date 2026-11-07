import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwas } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fatwas" });
  const siteUrl = getSiteUrl();
  const title = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = `${t("subtitle")} — Authoritative Islamic jurisprudence rulings, fiqh questions, and fatwas by Sheikh Muhammed Ferej Megeno.`;

  return {
    title,
    description,
    keywords: [
      "Fatwa",
      "ፈትዋ",
      "فتوى",
      "murtii islaamaa",
      "Islamic Rulings",
      "Fiqh",
      "ፊቅህ",
      "فقه",
      "Sheikh Muhammed Ferej",
      "ሸይኽ ሙሐመድ ፈረጅ",
      "الشيخ محمد فرج",
      "Halal Haram",
      "Islamic Banking Rulings",
      "Ethiopia Islamic Scholars",
    ],
    alternates: buildHreflangAlternates("/fatwas", locale),
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteUrl}/${locale}/fatwas`,
      images: [
        {
          url: `${siteUrl}/images/sheikh-portrait.jpg`,
          width: 1200,
          height: 1200,
          alt: "Sheikh Muhammed Ferej Megeno Fatwa Archive",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/sheikh-portrait.jpg`],
    },
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
  const siteUrl = getSiteUrl();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    description: t("subtitle"),
    url: `${siteUrl}/${locale}/fatwas`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: fatwas.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.title,
        url: `${siteUrl}/${locale}/fatwas/${f.slug}`,
      })),
    },
  };

  const breadcrumbs = [
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title"), url: `${siteUrl}/${locale}/fatwas` },
  ];

  return (
    <div className="w-full">
      <JsonLd data={[collectionSchema, buildBreadcrumbSchema(breadcrumbs)]} />
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
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <section className="space-y-5 sm:space-y-6">
          {fatwas.length > 0 ? (
            fatwas.map((fatwa) => (
              <Link key={fatwa.id} href={`/fatwas/${fatwa.slug}`} className="block group">
                <article className="interactive-card border border-[#0F241C]/10 bg-white rounded-2xl p-5 sm:p-7 hover:border-[#BF9A45] transition-all shadow-xs relative overflow-hidden cursor-pointer">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
                    {fatwa.categories?.[0] && (
                      <span className="text-[#1B6A50] font-semibold uppercase tracking-wider text-[11px] bg-[#1B6A50]/10 border border-[#1B6A50]/20 px-3 py-0.5 rounded-full">
                        {fatwa.categories[0]}
                      </span>
                    )}
                    <span className="text-[#0F241C]/50">
                      {formatDate(fatwa.published_at, locale)}
                    </span>
                    <span className="text-[#1B6A50] font-medium ms-auto flex items-center gap-1.5 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#BF9A45]" /> Verified Ruling
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg sm:text-2xl font-bold text-[#0F241C] mb-3 group-hover:text-[#1B6A50] transition-colors break-words">
                    {fatwa.title}
                  </h3>
                  
                  {fatwa.question && (
                    <div className="bg-[#EDF4F0] border border-[#BF9A45]/30 rounded-xl p-4 mb-3">
                      <p className="text-[#0F241C] text-xs sm:text-sm line-clamp-2 break-words leading-relaxed">
                        <span className="text-[#BF9A45] font-semibold me-2">Inquiry:</span>
                        {fatwa.question}
                      </p>
                    </div>
                  )}
                  
                  {fatwa.summary && (
                    <p className="text-[#0F241C]/75 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                      {fatwa.summary}
                    </p>
                  )}
                  
                  <div className="text-[#BF9A45] font-semibold text-xs flex items-center gap-1.5 pt-3 border-t border-[#0F241C]/10">
                    <span>Read Jurisprudential Ruling &amp; Evidences</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center border border-[#0F241C]/10 bg-white rounded-2xl p-8">
              <HelpCircle className="w-12 h-12 text-[#0F241C]/30 mx-auto mb-3" />
              <p className="text-[#0F241C]/60 text-sm">No verified fatwas found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
