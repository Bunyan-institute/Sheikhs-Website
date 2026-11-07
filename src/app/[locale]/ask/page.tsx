import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AskForm } from '@/components/ask/ask-form';
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import type { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ask' });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/ask`;
  const title = `${t('title')} | Sheikh Muhammed Ferej Megeno`;
  const description = t('description');
  const imageUrl = `${siteUrl}/images/sheikh-portrait.jpg`;

  return {
    title,
    description,
    keywords: [
      "Ask Fatwa",
      "ፈትዋ መጠየቅ",
      "የሸሪዓ ጥያቄ",
      "استفتاء",
      "سؤال شرعي",
      "gaaffii fatwaa",
      "Islamic ruling",
      "Fiqh question",
      "Sheikh Muhammed Ferej",
    ],
    alternates: buildHreflangAlternates('/ask', locale),
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AskPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ask' });
  const siteUrl = getSiteUrl();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t('title'), url: `${siteUrl}/${locale}/ask` },
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
                  {t('arabicBadge')}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t('subtitle')}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t('title')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <AskForm locale={locale} />
      </div>
    </div>
  );
}
