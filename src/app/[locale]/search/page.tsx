import { setRequestLocale } from 'next-intl/server';
import { searchContent } from '@/lib/api/search';
import { Link } from '@/i18n/navigation';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-20">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Search Knowledge
        </h1>
      </header>

      <div className="mb-8 relative">
        <form action={params.locale === 'en' ? '/search' : `/${params.locale}/search`} method="GET" className="relative">
           <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
           <input 
             type="text" 
             name="q" 
             defaultValue={query}
             placeholder="Search across all lectures, articles, rulings, and books..." 
             className="w-full bg-white border-2 border-[#E0D8CE] rounded-lg ps-12 pe-24 sm:pe-28 py-3.5 text-sm sm:text-base font-body text-[#2D3436] focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] shadow-sm"
           />
           {typeFilter !== 'all' && <input type="hidden" name="type" value={typeFilter} />}
           <button type="submit" className="absolute end-2 sm:end-2.5 top-1/2 -translate-y-1/2 bg-[#1B5E20] text-white px-3 sm:px-4 py-2 rounded-md font-bold text-xs sm:text-sm hover:bg-[#1B5E20]/90 transition-colors">
             Search
           </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {types.map(type => (
           <Link 
             key={type} 
             href={`/search?q=${encodeURIComponent(query)}&type=${type}`}
             className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold capitalize transition-colors ${typeFilter === type ? 'bg-[#2D3436] text-white' : 'bg-[#FAF8F5] border border-[#E0D8CE] text-[#636E72] hover:text-[#2D3436]'}`}
           >
             {type === 'book' ? 'Library' : type}
           </Link>
        ))}
      </div>

      {query && (
        <div>
          <h2 className="text-lg font-bold text-[#2D3436] mb-6 border-b border-[#E0D8CE] pb-2 break-words">
            Showing results for "{query}"
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result: SearchResult) => (
                <Link key={result.id} href={getResultUrl(result)} className="block bg-white p-4 sm:p-6 rounded-lg border border-[#E0D8CE] hover:border-[#1B5E20] group transition-all shadow-sm hover:shadow-md">
                   <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] bg-[#1B5E20]/10 px-2 py-0.5 rounded">
                            {result.object}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors mb-2 break-words">
                          {result.title}
                        </h3>
                        {result.summary && (
                          <p className="text-[#636E72] font-body text-xs sm:text-sm line-clamp-2 break-words">
                            {result.summary}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#E0D8CE] group-hover:text-[#1B5E20] shrink-0 ms-2 sm:ms-4 mt-2 transition-colors rtl:rotate-180" />
                   </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FAF8F5] rounded-md border border-[#E0D8CE]">
               <p className="text-lg text-[#636E72]">No content matched your search.</p>
               <p className="text-sm text-[#636E72]/80 mt-1">Try another term or browse our categories.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
