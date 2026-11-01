import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Scholarly Treatises & Articles | Sheikh Ferej",
  description: "Read authentic Islamic articles, exegesis, and legal essays by Sheikh Muhammed Ferej Megeno.",
};

export default async function ArticlesPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const { category } = await searchParams;

  const [articlesRes, categoriesRes] = await Promise.all([
    getArticles({ locale, category: category ? [category] : undefined }),
    getCategories()
  ]);

  const articles = articlesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const featuredArticle = category ? null : articles[0];
  const latestArticles = category ? articles : articles.slice(1);

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                البحوث والمقالات الشرعية
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                Authentic Exegesis &amp; Treatises
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              Articles &amp; Hadith Studies
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            Peer-reviewed essays, Hadith commentaries, and legal treatises authored by Sheikh Muhammed Ferej Megeno.
          </p>
        </div>
      </header>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link 
            href="/articles" 
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-[3px] border transition-colors ${
              !category ? 'bg-[#1A4D2E] text-white border-[#1A4D2E]' : 'bg-white text-[#555E61] border-[#E6E0D8] hover:border-[#1A4D2E]'
            }`}
          >
            All Fields
          </Link>
          {categories.map((c) => (
            <Link 
              key={c.id}
              href={`/articles?category=${c.slug}`}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-[3px] border transition-colors ${
                category === c.slug ? 'bg-[#1A4D2E] text-white border-[#1A4D2E]' : 'bg-white text-[#555E61] border-[#E6E0D8] hover:border-[#1A4D2E]'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {featuredArticle && (
        <section className="mb-12">
          <Link href={`/articles/${featuredArticle.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center border border-[#E6E0D8] bg-white rounded-[4px] overflow-hidden hover:border-[#1A4D2E] transition-colors">
              {featuredArticle.cover ? (
                <div className="aspect-[4/3] relative bg-[#FAF8F5]">
                  <img 
                    src={featuredArticle.cover.url} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-[#FAF8F5] flex items-center justify-center border-b md:border-b-0 md:border-e border-[#E6E0D8]">
                  <span className="text-[#1A4D2E] font-heading font-bold text-xl px-8 text-center break-words">
                    {featuredArticle.title}
                  </span>
                </div>
              )}
              <div className="p-6 sm:p-8 md:pe-12 space-y-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="text-[#1A4D2E] font-bold bg-[#FAF8F5] border border-[#E6E0D8] px-2.5 py-1 rounded-[2px] uppercase tracking-wider text-[11px]">
                    Featured Treatise
                  </span>
                  <span className="text-[#7A8285]">
                    {formatDate(featuredArticle.published_at, locale)}
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors break-words">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.summary && (
                  <p className="text-[#555E61] text-sm sm:text-base leading-relaxed line-clamp-3 break-words">
                    {featuredArticle.summary}
                  </p>
                )}
                <div className="pt-2 text-xs font-semibold text-[#8C6D23] flex items-center gap-1.5">
                  <span>Read Full Discourse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section>
        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group block h-full">
                <article className="border border-[#E6E0D8] bg-white rounded-[4px] p-5 h-full flex flex-col hover:border-[#1A4D2E] transition-colors">
                  <div className="flex items-center justify-between text-xs mb-3 text-[#7A8285]">
                    {article.categories?.[0] ? (
                      <span className="text-[#1A4D2E] font-bold uppercase tracking-wider text-[11px]">
                        {article.categories[0]}
                      </span>
                    ) : (
                      <span>Treatise</span>
                    )}
                    <span>
                      {formatDate(article.published_at, locale)}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-[#2D3436] mb-2 group-hover:text-[#1A4D2E] transition-colors line-clamp-2 break-words">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-xs text-[#555E61] line-clamp-3 mb-4 leading-relaxed flex-grow">
                      {article.summary}
                    </p>
                  )}
                  <div className="mt-auto text-xs font-semibold text-[#8C6D23] flex items-center justify-between border-t border-[#FAF8F5] pt-3">
                    <span className="flex items-center gap-1">
                      <span>Read Discourse</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {article.reading_minutes && (
                      <span className="text-[#7A8285] font-normal">{article.reading_minutes} min read</span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E6E0D8] bg-white rounded-[4px]">
            <BookOpen className="w-12 h-12 text-[#7A8285]/50 mx-auto mb-3" />
            <p className="text-[#555E61] text-sm">No articles found matching the current criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
