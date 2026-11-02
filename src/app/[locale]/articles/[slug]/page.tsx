import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticle, AUTHENTIC_ARTICLES } from "@/lib/api/articles";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const art of AUTHENTIC_ARTICLES) {
      params.push({ locale, slug: art.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const article = await getArticle(slug, locale);
    return {
      title: `${article.title} | Sheikh Muhammed Ferej Megeno`,
      description: article.summary || "Read scholarly article.",
    };
  } catch {
    return {
      title: "Article Not Found | Sheikh Muhammed Ferej",
    };
  }
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let article;
  try {
    article = await getArticle(slug, locale);
  } catch (error) {
    notFound();
  }

  return (
    <article className="w-full bg-[#EDF2EE] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D6A5A] hover:text-[#0F3446] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#BF9A45]" />
            All Articles &amp; Hadith Studies
          </Link>
        </div>

        <div className="bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-10 md:p-12 shadow-xs">
          <header className="mb-10 pb-8 border-b border-[#14262E]/10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {article.categories?.map((cat) => (
                <span key={cat} className="text-[#1D6A5A] font-semibold bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 px-3 py-0.5 rounded-full text-xs capitalize">
                  {cat}
                </span>
              ))}
              <span className="text-[#14262E]/50 text-xs font-medium">
                {formatDate(article.published_at, locale)}
              </span>
              {article.reading_minutes && (
                <>
                  <span className="text-[#14262E]/20">&bull;</span>
                  <span className="text-[#14262E]/50 text-xs">
                    {article.reading_minutes} min study
                  </span>
                </>
              )}
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#14262E] leading-tight mb-6 break-words">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-lg text-[#14262E]/70 leading-relaxed font-sans font-normal italic">
                &ldquo;{article.summary}&rdquo;
              </p>
            )}

            {article.cover && (
              <div className="w-full aspect-[16/9] relative rounded-xl overflow-hidden bg-[#EDF2EE] border border-[#BF9A45]/30 mt-8">
                <img 
                  src={article.cover.url} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {article.body && (
            <div 
              className="prose prose-lg max-w-none text-[#14262E]/80 prose-headings:font-display prose-headings:text-[#14262E] prose-a:text-[#1D6A5A] prose-a:underline hover:prose-a:text-[#0F3446] leading-relaxed break-words font-sans"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}

          {/* Verification colophon */}
          <footer className="mt-12 pt-6 border-t border-[#14262E]/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#14262E]/60">
            <p>Author: فضيلة الشيخ محمد فرج مجنو حفظه الله</p>
            <p className="font-arabic text-[#1D6A5A] text-sm" dir="rtl">والحمد لله رب العالمين</p>
          </footer>
        </div>
      </div>
    </article>
  );
}