import { setRequestLocale } from 'next-intl/server';
import { searchContent } from '@/lib/api/search';
import { Link } from '@/i18n/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { SearchResult } from '@/lib/api/types';

export default async function SearchPage(props: { params: Promise<{ locale: string }>, searchParams: Promise<{ q?: string, type?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  setRequestLocale(params.locale);
  
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
  
  const types = ['all', 'lecture', 'article', 'fatwa', 'course', 'book', 'series'];

  const getResultUrl = (result: SearchResult) => {
    switch (result.object) {
      case 'lecture': return `/lectures/${result.slug}`;
      case 'article': return `/articles/${result.slug}`;
      case 'fatwa': return `/fatwas/${result.slug}`;
      case 'course': return `/courses/${result.slug}`;
      case 'book': return `/library/${result.slug}`;
      case 'series': return `/series/${result.slug}`;
      case 'event': return `/events/${result.slug}`;
      default: return `/lectures/${result.slug}`;
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                البحث في الخزانة العلمية
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                Instant Local Knowledge Base
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              Search Knowledge Archives
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            Search instantaneously across all 32 Kitab At-Tawheed lessons, recorded halaqat, published fatwas, and treatises.
          </p>
        </div>
      </header>

      <div className="mb-8 relative max-w-3xl">
        <form action={params.locale === 'en' ? '/search' : `/${params.locale}/search`} method="GET" className="relative">
           <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8285]" />
           <input 
             type="text" 
             name="q" 
             defaultValue={query}
             placeholder="Search across all lectures, articles, rulings, and books..." 
             className="w-full bg-white border border-[#E6E0D8] rounded-[4px] ps-11 pe-24 sm:pe-28 py-3 text-sm font-body text-[#2D3436] focus:outline-none focus:border-[#1A4D2E]"
           />
           {typeFilter !== 'all' && <input type="hidden" name="type" value={typeFilter} />}
           <button type="submit" className="absolute end-2 top-1/2 -translate-y-1/2 bg-[#1A4D2E] text-white px-4 py-1.5 rounded-[3px] font-semibold text-xs hover:bg-[#143d24]">
             Search
           </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {types.map(type => (
           <Link 
             key={type} 
             href={`/search?q=${encodeURIComponent(query)}&type=${type}`}
             className={`px-3 py-1 rounded-[3px] text-xs font-semibold capitalize transition-colors ${
               typeFilter === type 
                 ? 'bg-[#1A4D2E] text-white' 
                 : 'bg-white border border-[#E6E0D8] text-[#555E61] hover:border-[#1A4D2E]'
             }`}
           >
             {type === 'book' ? 'Library' : type}
           </Link>
        ))}
      </div>

      {query && (
        <div>
          <h2 className="text-sm font-bold text-[#555E61] mb-6 border-b border-[#E6E0D8] pb-2 break-words">
            Showing results for &ldquo;{query}&rdquo; ({searchResults.length} found)
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result: SearchResult) => (
                <Link key={result.id} href={getResultUrl(result)} className="block bg-white p-5 rounded-[4px] border border-[#E6E0D8] hover:border-[#1A4D2E] group transition-colors">
                   <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A4D2E] bg-[#FAF8F5] border border-[#E6E0D8] px-2 py-0.5 rounded-[2px]">
                            {result.object}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-heading font-bold text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors break-words">
                          {result.title}
                        </h3>
                        {result.summary && (
                          <p className="text-[#555E61] font-body text-xs sm:text-sm line-clamp-2 break-words leading-relaxed">
                            {result.summary}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C6D23] shrink-0 ms-2 mt-2 rtl:rotate-180" />
                   </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-[4px] border border-[#E6E0D8]">
               <p className="text-base font-semibold text-[#2D3436]">No scholarly items matched your search query.</p>
               <p className="text-xs text-[#7A8285] mt-1">Try another keyword, or browse the lectures and library tabs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
