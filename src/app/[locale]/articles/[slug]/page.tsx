import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticle, AUTHENTIC_ARTICLES } from "@/lib/api/articles";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
      title: `${article.title} | Sheikh Ferej`,
      description: article.summary || "Read scholarly article.",
    };
  } catch {
    return {
      title: "Article Not Found | Sheikh Ferej",
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
    <article className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <div className="mb-10">
        <Link 
          href="/articles" 
          className="inline-flex items-center text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors"
        >
          &larr; All Articles & Hadith Studies
        </Link>
      </div>

      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {article.categories?.map((cat) => (
            <span key={cat} className="text-[#1B5E20] font-medium bg-[#FAF8F5] border border-[#E0D8CE] px-3 py-1 rounded-[4px] text-sm capitalize">
              {cat}
            </span>
          ))}
          <span className="text-[#636E72] text-sm">
            {formatDate(article.published_at, locale)}
          </span>
          {article.reading_minutes && (
            <>
              <span className="text-[#E0D8CE]">&bull;</span>
              <span className="text-[#636E72] text-sm">
                {article.reading_minutes} min read
              </span>
            </>
          )}
        </div>
        
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436] leading-tight mb-6 sm:mb-8 break-words">
          {article.title}
        </h1>

        {article.cover && (
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] relative rounded-[4px] overflow-hidden bg-[#FAF8F5] border border-[#E0D8CE] mb-8 sm:mb-12">
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
          className="prose prose-lg max-w-none prose-scholarly text-[#2D3436] prose-headings:font-heading prose-headings:text-[#2D3436] prose-a:text-[#1B5E20] prose-a:no-underline hover:prose-a:underline break-words"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      )}

      <footer className="mt-16 pt-8 border-t border-[#E0D8CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <span className="text-[#2D3436] font-semibold">Share:</span>
          {/* Implement actual share links if needed */}
          <button className="text-[#636E72] hover:text-[#1B5E20] transition-colors">Copy Link</button>
        </div>
        <Link href="/articles" className="text-[#B8860B] font-medium hover:text-[#2D3436] transition-colors">
          More articles &rarr;
        </Link>
      </footer>
    </article>
  );
}
