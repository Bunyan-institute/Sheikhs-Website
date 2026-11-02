import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    description: t("subtitle"),
  };
}

export default async function ArticlesPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "articles" });
  
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
              {t("author")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Link 
              href="/articles" 
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                !category
                  ? 'bg-[#0F3446] text-[#EDF2EE] border-[#0F3446]'
                  : 'bg-white text-[#14262E]/70 border-[#14262E]/15 hover:border-[#1D6A5A] hover:text-[#14262E]'
              }`}
            >
              All Topics
            </Link>
            {categories.map((c) => (
              <Link 
                key={c.id}
                href={`/articles?category=${c.slug}`}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  category === c.slug
                    ? 'bg-[#0F3446] text-[#EDF2EE] border-[#0F3446]'
                    : 'bg-white text-[#14262E]/70 border-[#14262E]/15 hover:border-[#1D6A5A] hover:text-[#14262E]'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-14">
            <Link href={`/articles/${featuredArticle.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center border border-[#14262E]/10 bg-white rounded-2xl overflow-hidden hover:border-[#1D6A5A] transition-all shadow-xs p-6 sm:p-8">
                {featuredArticle.cover ? (
                  <div className="aspect-[16/10] relative bg-[#EDF2EE] rounded-xl overflow-hidden">
                    <img 
                      src={featuredArticle.cover.url} 
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-[#EDF2EE] rounded-xl flex items-center justify-center p-8 border border-[#BF9A45]/30">
                    <span className="text-[#1D6A5A] font-display font-semibold text-2xl text-center break-words">
                      {featuredArticle.title}
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-[#1D6A5A] font-semibold bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 px-3 py-0.5 rounded-full uppercase tracking-wider text-[11px]">
                      Featured Treatise
                    </span>
                    <span className="text-[#14262E]/50">
                      {formatDate(featuredArticle.published_at, locale)}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14262E] group-hover:text-[#1D6A5A] transition-colors break-words">
                    {featuredArticle.title}
                  </h2>
                  {featuredArticle.summary && (
                    <p className="text-[#14262E]/75 text-sm sm:text-base leading-relaxed line-clamp-3 break-words">
                      {featuredArticle.summary}
                    </p>
                  )}
                  <div className="pt-2 text-xs font-semibold text-[#BF9A45] flex items-center gap-1.5">
                    <span>Read Full Discourse</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Article Grid */}
        <section>
          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="group block h-full">
                  <article className="border border-[#14262E]/10 bg-white rounded-2xl p-6 h-full flex flex-col hover:border-[#1D6A5A] transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs mb-3 text-[#14262E]/50">
                      {article.categories?.[0] ? (
                        <span className="text-[#1D6A5A] font-semibold uppercase tracking-wider text-[11px]">
                          {article.categories[0]}
                        </span>
                      ) : (
                        <span>Treatise</span>
                      )}
                      <span>
                        {formatDate(article.published_at, locale)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#14262E] mb-2 group-hover:text-[#1D6A5A] transition-colors line-clamp-2 break-words">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-xs text-[#14262E]/70 line-clamp-3 mb-4 leading-relaxed flex-grow">
                        {article.summary}
                      </p>
                    )}
                    <div className="mt-auto text-xs font-semibold text-[#BF9A45] flex items-center justify-between border-t border-[#14262E]/10 pt-3">
                      <span className="flex items-center gap-1">
                        <span>Read Lesson</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {article.reading_minutes && (
                        <span className="text-[#14262E]/50 font-normal">{article.reading_minutes} min read</span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#14262E]/10 bg-white rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-[#14262E]/30 mx-auto mb-3" />
              <p className="text-[#14262E]/60 text-sm">No articles found matching the current criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}