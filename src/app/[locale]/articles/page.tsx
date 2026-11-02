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
              {t("author")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="mb-8 sm:mb-10 flex flex-wrap gap-2">
            <Link 
              href="/articles" 
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-colors min-h-[36px] flex items-center ${
                !category
                  ? 'bg-[#0D3E2F] text-[#EDF4F0] border-[#0D3E2F] shadow-xs'
                  : 'bg-white text-[#0F241C]/75 border-[#0F241C]/15 hover:border-[#1B6A50] hover:text-[#0F241C]'
              }`}
            >
              All Topics
            </Link>
            {categories.map((c) => (
              <Link 
                key={c.id}
                href={`/articles?category=${c.slug}`}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-colors min-h-[36px] flex items-center ${
                  category === c.slug
                    ? 'bg-[#0D3E2F] text-[#EDF4F0] border-[#0D3E2F] shadow-xs'
                    : 'bg-white text-[#0F241C]/75 border-[#0F241C]/15 hover:border-[#1B6A50] hover:text-[#0F241C]'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-12 sm:mb-14">
            <Link href={`/articles/${featuredArticle.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center border border-[#0F241C]/10 bg-white rounded-2xl overflow-hidden hover:border-[#1B6A50] transition-all shadow-xs p-5 sm:p-8">
                {featuredArticle.cover ? (
                  <div className="aspect-[16/10] relative bg-[#EDF4F0] rounded-xl overflow-hidden">
                    <img 
                      src={featuredArticle.cover.url} 
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-[#EDF4F0] rounded-xl flex items-center justify-center p-6 sm:p-8 border border-[#BF9A45]/30">
                    <span className="text-[#1B6A50] font-display font-semibold text-xl sm:text-2xl text-center break-words">
                      {featuredArticle.title}
                    </span>
                  </div>
                )}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-[#1B6A50] font-semibold bg-[#1B6A50]/10 border border-[#1B6A50]/20 px-3 py-0.5 rounded-full uppercase tracking-wider text-[11px]">
                      Featured Treatise
                    </span>
                    <span className="text-[#0F241C]/50">
                      {formatDate(featuredArticle.published_at, locale)}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F241C] group-hover:text-[#1B6A50] transition-colors break-words">
                    {featuredArticle.title}
                  </h2>
                  {featuredArticle.summary && (
                    <p className="text-[#0F241C]/75 text-sm sm:text-base leading-relaxed line-clamp-3 break-words">
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
                  <article className="border border-[#0F241C]/10 bg-white rounded-2xl p-5 sm:p-6 h-full flex flex-col hover:border-[#1B6A50] transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs mb-3 text-[#0F241C]/50">
                      {article.categories?.[0] ? (
                        <span className="text-[#1B6A50] font-semibold uppercase tracking-wider text-[11px]">
                          {article.categories[0]}
                        </span>
                      ) : (
                        <span>Treatise</span>
                      )}
                      <span>
                        {formatDate(article.published_at, locale)}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F241C] mb-2 group-hover:text-[#1B6A50] transition-colors line-clamp-2 break-words">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-xs text-[#0F241C]/70 line-clamp-3 mb-4 leading-relaxed flex-grow">
                        {article.summary}
                      </p>
                    )}
                    <div className="mt-auto text-xs font-semibold text-[#BF9A45] flex items-center justify-between border-t border-[#0F241C]/10 pt-3">
                      <span className="flex items-center gap-1">
                        <span>Read Lesson</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {article.reading_minutes && (
                        <span className="text-[#0F241C]/50 font-normal">{article.reading_minutes} min read</span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#0F241C]/10 bg-white rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-[#0F241C]/30 mx-auto mb-3" />
              <p className="text-[#0F241C]/60 text-sm">No articles found matching the current criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
