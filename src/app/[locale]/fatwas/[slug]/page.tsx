import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwa, AUTHENTIC_FATWAS } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle } from "lucide-react";

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const fatwa of AUTHENTIC_FATWAS) {
      params.push({ locale, slug: fatwa.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const fatwa = await getFatwa(slug, locale);
    return {
      title: `${fatwa.title} | Sheikh Muhammed Ferej Megeno`,
      description: fatwa.summary || "Islamic jurisprudential ruling.",
    };
  } catch {
    return {
      title: "Fatwa Not Found | Sheikh Muhammed Ferej",
    };
  }
}

function formatMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, '<h3 class="font-display text-xl font-bold text-[#0F241C] mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-display text-2xl font-bold text-[#0F241C] mt-8 mb-4 pb-2 border-b border-[#0F241C]/10">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-[#0F241C]">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ms-5 list-disc text-[#0F241C]/80 mb-1">$1</li>')
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) return trimmed;
      return `<p class="leading-relaxed mb-4 text-[#0F241C]/80 break-words">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

export default async function FatwaDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let fatwa;
  try {
    fatwa = await getFatwa(slug, locale);
  } catch {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "fatwaDetail" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <article className="w-full bg-[#EDF4F0] py-8 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/fatwas" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B6A50] hover:text-[#0D3E2F] transition-colors py-1"
          >
            <ArrowLeft className="w-4 h-4 text-[#BF9A45] rtl:rotate-180" />
            <span>{t("backToFatwas")}</span>
          </Link>
        </div>

        <div className="bg-white border border-[#0F241C]/10 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <header className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[#0F241C]/10">
            <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs">
              {fatwa.categories?.map((cat) => (
                <span key={cat} className="text-[#1B6A50] font-semibold bg-[#1B6A50]/10 border border-[#1B6A50]/20 px-3 py-0.5 rounded-full capitalize">
                  {cat}
                </span>
              ))}
              <span className="text-[#0F241C]/50">
                {formatDate(fatwa.published_at, locale)}
              </span>
              <span className="text-[#1B6A50] font-medium ms-auto flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-[#BF9A45]" /> {t("verdict")}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F241C] leading-tight break-words">
              {fatwa.title}
            </h1>
          </header>

          <div className="space-y-6 sm:space-y-8">
            {fatwa.question && (
              <section className="bg-[#EDF4F0] border border-[#BF9A45]/30 rounded-2xl p-5 sm:p-7">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#BF9A45] mb-2 sm:mb-3">
                  {t("question")}:
                </h2>
                <div 
                  className="prose prose-base max-w-none text-[#0F241C] leading-relaxed break-words"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(fatwa.question) }}
                />
              </section>
            )}

            {fatwa.answer && (
              <section className="pt-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1B6A50] mb-4 pb-3 border-b border-[#0F241C]/10">
                  {t("scholarAnswer")}:
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-[#0F241C]/85 break-words font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(fatwa.answer) }}
                />
              </section>
            )}
          </div>
          
          <div className="mt-10 sm:mt-12 text-center text-xs sm:text-sm text-[#0F241C]/60 border-t border-[#0F241C]/10 pt-6">
            <p>{t("askSimilar")}{' '}
              <Link href="/ask" className="text-[#1B6A50] hover:underline font-semibold">
                {tNav("ask")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
