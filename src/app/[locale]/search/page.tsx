import { getTranslations, setRequestLocale } from 'next-intl/server';
import { searchContent } from '@/lib/api/search';
import { Link } from '@/i18n/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { SearchResult } from '@/lib/api/types';

export default async function SearchPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "search" });
  
  const query = searchParams.q || '';
  const typeFilter = searchParams.type || 'all';

  const types = ['all', 'lecture', 'article', 'fatwa', 'course', 'series'];

  let searchResults: SearchResult[] = [];
  if (query.trim()) {
    try {
      const res = await searchContent({
        q: query,
        type: typeFilter !== 'all' ? [typeFilter] : undefined,
        locale: params.locale
      });
      searchResults = res?.data || [];
    } catch (err) {
      console.error("Search query failed:", err);
    }
  }

  const getResultUrl = (result: SearchResult) => {
    switch (result.object) {
      case 'article': return `/articles/${result.slug}`;
      case 'fatwa': return `/fatwas/${result.slug}`;
      case 'course': return `/courses/${result.slug}`;
      case 'series': return `/series/${result.slug}`;
      case 'event': return `/events/${result.slug}`;
      default: return `/media`;
    }
  };

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  البحث في الخزانة العلمية
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  Instant Archive Search
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("placeholder")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        {/* Search Input Bar */}
        <div className="mb-8 relative max-w-3xl">
          <form action={params.locale === 'en' ? '/search' : `/${params.locale}/search`} method="GET" className="relative">
             <SearchIcon className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B6A50]" />
             <input 
               type="text" 
               name="q" 
               defaultValue={query}
               placeholder="Search lessons, series, topics, fatwas and treatises..." 
               className="w-full bg-white border border-[#0F241C]/15 rounded-2xl ps-13 pe-28 py-3.5 sm:py-4 text-sm sm:text-base font-sans text-[#0F241C] focus:outline-none focus:border-[#1B6A50] shadow-xs"
             />
             {typeFilter !== 'all' && <input type="hidden" name="type" value={typeFilter} />}
             <button type="submit" className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 bg-[#BF9A45] text-[#072118] px-4 sm:px-5 py-2 rounded-full font-bold text-xs hover:bg-[#E6D3A3] transition-colors shadow-xs">
               Search
             </button>
          </form>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-10 pb-4 border-b border-[#0F241C]/10">
          {types.map(type => (
             <Link 
               key={type} 
               href={`/search?q=${encodeURIComponent(query)}&type=${type}`}
               className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors min-h-[36px] flex items-center ${
                 typeFilter === type 
                   ? 'bg-[#0D3E2F] text-[#EDF4F0] shadow-xs' 
                   : 'bg-white border border-[#0F241C]/15 text-[#0F241C]/75 hover:border-[#1B6A50] hover:text-[#0F241C]'
               }`}
             >
               {type === 'lecture' ? 'Media' : type}
             </Link>
          ))}
        </div>

        {/* Results List */}
        {query ? (
          <div className="space-y-4">
             {searchResults.length === 0 ? (
               <div className="py-20 text-center border border-[#0F241C]/10 bg-white rounded-2xl p-8">
                 <p className="text-[#0F241C]/70 text-base">Nothing matches &ldquo;{query}&rdquo;. Try another term such as tafsir, Friday or charity.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {searchResults.map((result: SearchResult) => (
                   <Link
                     key={`${result.object}-${result.id}`}
                     href={getResultUrl(result)}
                     className="block p-5 bg-white border border-[#0F241C]/10 rounded-2xl hover:border-[#1B6A50] transition-all group shadow-xs"
                   >
                     <div className="flex items-center justify-between text-xs mb-2">
                       <span className="text-[#1B6A50] font-semibold uppercase tracking-wider text-[11px] bg-[#1B6A50]/10 border border-[#1B6A50]/20 px-2.5 py-0.5 rounded-full">
                         {result.object}
                       </span>
                       <span className="text-[#BF9A45] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         <span>Open</span>
                         <ArrowRight className="w-3 h-3" />
                       </span>
                     </div>
                     <h3 className="font-display font-semibold text-base sm:text-lg text-[#0F241C] group-hover:text-[#1B6A50] transition-colors break-words">
                       {result.title}
                     </h3>
                     {result.summary && (
                       <p className="text-xs text-[#0F241C]/70 line-clamp-2 mt-2 leading-relaxed">
                         {result.summary}
                       </p>
                     )}
                   </Link>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[#0F241C]/15 rounded-2xl p-8">
            <p className="text-sm text-[#0F241C]/60">Enter a keyword above to search through decades of lectures, fatwas, articles, and audio series.</p>
          </div>
        )}
      </div>
    </div>
  );
}
