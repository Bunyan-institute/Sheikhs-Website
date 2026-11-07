import { getTranslations, setRequestLocale } from "next-intl/server";
import { VerifyForm } from "@/components/verify/verify-form";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "verify" });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/verify`;
  const title = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildHreflangAlternates("/verify", locale),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function VerifyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "verify" });
  const siteUrl = getSiteUrl();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title"), url: `${siteUrl}/${locale}/verify` },
  ]);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumbs} />
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

      <VerifyForm />
    </div>
  );
}
