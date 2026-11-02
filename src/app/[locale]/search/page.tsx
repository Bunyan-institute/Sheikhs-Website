import { getTranslations, setRequestLocale } from 'next-intl/server';
import { searchContent } from '@/lib/api/search';
import { Link } from '@/i18n/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { SearchResult } from '@/lib/api/types';

export default async function SearchPage(props: { params: Promise<{ locale: string }>, searchParams: Promise<{ q?: string, type?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "search" });
  
  const query = searchParams.q || '';
  const typeFilter = searchParams.type || 'all';
  
  let searchResults: SearchResult[] = [];
  if (query) {
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
  
  const types = ['all', 'lecture', 'article', 'fatwa', 'course', 'series'];

  const getResultUrl = (result: SearchResult) => {
    switch (result.object) {
      case 'lecture': return `/media`;
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
      <section className="relative bg-[#0F3446] text-[#EDF2EE] py-16 overflow-hidden">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  البحث في الخزانة العلمية
                </span>
                <span className="star-sep" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/80 font-semibold">
                  Instant Archive Search
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[#EDF2EE]">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-[#EDF2EE]/75 max-w-xl font-sans leading-relaxed">
              {t("placeholder")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Search Input Bar */}
        <div className="mb-8 relative max-w-3xl">
          <form action={params.locale === 'en' ? '/search' : `/${params.locale}/search`} method="GET" className="relative">
             <SearchIcon className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D6A5A]" />
             <input 
               type="text" 
               name="q" 
               defaultValue={query}
               placeholder="Search lessons, series, topics, fatwas and treatises..." 
               className="w-full bg-white border border-[#14262E]/15 rounded-2xl ps-13 pe-28 py-4 text-base font-sans text-[#14262E] focus:outline-none focus:border-[#1D6A5A] shadow-xs"
             />
             {typeFilter !== 'all' && <input type="hidden" name="type" value={typeFilter} />}
             <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 bg-[#BF9A45] text-[#0A2532] px-5 py-2 rounded-full font-semibold text-xs hover:bg-[#E6D3A3] transition-colors shadow-xs">
               Search
             </button>
          </form>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#14262E]/10">
          {types.map(type => (
             <Link 
               key={type} 
               href={`/search?q=${encodeURIComponent(query)}&type=${type}`}
               className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                 typeFilter === type 
                   ? 'bg-[#0F3446] text-[#EDF2EE] shadow-xs' 
                   : 'bg-white border border-[#14262E]/15 text-[#14262E]/70 hover:border-[#1D6A5A] hover:text-[#14262E]'
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
               <div className="py-20 text-center border border-[#14262E]/10 bg-white rounded-2xl p-8">
                 <p className="text-[#14262E]/70 text-base">Nothing matches &ldquo;{query}&rdquo;. Try another term such as tafsir, Friday or charity.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {searchResults.map((result: SearchResult) => (
                   <Link
                     key={`${result.object}-${result.id}`}
                     href={getResultUrl(result)}
                     className="block p-5 bg-white border border-[#14262E]/10 rounded-2xl hover:border-[#1D6A5A] transition-all group shadow-xs"
                   >
                     <div className="flex items-center justify-between text-xs mb-2">
                       <span className="text-[#1D6A5A] font-semibold uppercase tracking-wider text-[11px] bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 px-2.5 py-0.5 rounded-full">
                         {result.object}
                       </span>
                       <span className="text-[#BF9A45] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         <span>Open</span>
                         <ArrowRight className="w-3 h-3" />
                       </span>
                     </div>
                     <h3 className="font-display font-semibold text-lg text-[#14262E] group-hover:text-[#1D6A5A] transition-colors break-words">
                       {result.title}
                     </h3>
                     {result.summary && (
                       <p className="text-xs text-[#14262E]/70 line-clamp-2 mt-2 leading-relaxed">
                         {result.summary}
                       </p>
                     )}
                   </Link>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#14262E]/10 bg-white rounded-2xl p-8 max-w-xl mx-auto">
            <h3 className="font-display font-semibold text-xl text-[#14262E] mb-2">Search the Sheikh&apos;s Archive</h3>
            <p className="text-xs text-[#14262E]/60 leading-relaxed">
              Enter any keyword above to search through recorded halaqat, exegesis series, written treatises, and verified legal rulings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}