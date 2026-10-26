import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Sheikh Ferej",
  description: "Read scholarly articles, essays, and reflections.",
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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-bold text-[#2D3436] mb-4">Articles</h1>
        <p className="text-lg text-[#636E72] max-w-2xl">
          Scholarly writings, essays, and reflections on various topics.
        </p>
      </header>

      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <Link 
            href="/articles" 
            className={`px-4 py-2 text-sm rounded-[4px] border ${!category ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-[#FAF8F5] text-[#2D3436] border-[#E0D8CE] hover:bg-white'} transition-colors`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link 
              key={c.id}
              href={`/articles?category=${c.slug}`}
              className={`px-4 py-2 text-sm rounded-[4px] border ${category === c.slug ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-[#FAF8F5] text-[#2D3436] border-[#E0D8CE] hover:bg-white'} transition-colors`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {featuredArticle && (
        <section className="mb-16">
          <Link href={`/articles/${featuredArticle.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center border border-[#E0D8CE] bg-white rounded-[4px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {featuredArticle.cover ? (
                <div className="aspect-[4/3] relative bg-[#FAF8F5]">
                  <img 
                    src={featuredArticle.cover.url} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-[#FAF8F5] flex items-center justify-center border-b md:border-b-0 md:border-e border-[#E0D8CE]">
                  <span className="text-[#B8860B] font-heading font-bold text-xl px-8 text-center break-words">
                    {featuredArticle.title}
                  </span>
                </div>
              )}
              <div className="p-6 sm:p-8 md:pe-12">
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className="text-[#1B5E20] font-medium bg-[#FAF8F5] border border-[#E0D8CE] px-3 py-1 rounded-[4px]">
                    Featured
                  </span>
                  <span className="text-[#636E72]">
                    {formatDate(featuredArticle.published_at, locale)}
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436] mb-4 group-hover:text-[#1B5E20] transition-colors break-words">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.summary && (
                  <p className="text-[#636E72] text-base sm:text-lg mb-6 line-clamp-3 break-words">
                    {featuredArticle.summary}
                  </p>
                )}
                <div className="text-[#B8860B] font-medium flex items-center gap-2">
                  <span>Read full article</span>
                  <span aria-hidden="true">&rarr;</span>
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
                <article className="border border-[#E0D8CE] bg-white rounded-[4px] p-5 sm:p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-xs mb-4">
                    {article.categories?.[0] && (
                      <span className="text-[#1B5E20] font-medium bg-[#FAF8F5] border border-[#E0D8CE] px-2 py-1 rounded-[4px]">
                        {article.categories[0]}
                      </span>
                    )}
                    <span className="text-[#636E72]">
                      {formatDate(article.published_at, locale)}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1B5E20] transition-colors line-clamp-2 break-words">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-[#636E72] line-clamp-3 mb-6 flex-grow">
                      {article.summary}
                    </p>
                  )}
                  <div className="mt-auto text-sm font-medium text-[#B8860B] flex items-center justify-between border-t border-[#E0D8CE] pt-4">
                    <span>Read article</span>
                    {article.reading_minutes && (
                      <span className="text-[#636E72]">{article.reading_minutes} min read</span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E0D8CE] bg-white rounded-[4px]">
            <p className="text-[#636E72] text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
