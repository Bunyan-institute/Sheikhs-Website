import { setRequestLocale } from 'next-intl/server';
import { getLibrary } from '@/lib/api/library';
import { Link } from '@/i18n/navigation';
import { Book, FileText, Bookmark } from 'lucide-react';
import type { PublicBook } from '@/lib/api/types';

export default async function LibraryPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  let bookList: PublicBook[] = [];
  try {
    const items = await getLibrary({ locale: params.locale });
    bookList = items?.data || [];
  } catch (err) {
    console.error("Failed to load library items", err);
  }

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16 lg:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Library
        </h1>
        <p className="text-lg md:text-xl text-[#636E72] max-w-3xl font-body">
          Explore the Sheikh's scholarly archives, including books, documents, and recommended references.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {bookList.map((item: PublicBook) => (
          <Link key={item.id} href={`/library/${item.slug}`} className="group flex flex-col h-full bg-white rounded-md border border-[#E0D8CE] overflow-hidden hover:border-[#1B5E20] transition-colors duration-200">
            <div className="aspect-[2/3] bg-[#FAF8F5] flex items-center justify-center relative p-6 border-b border-[#E0D8CE]">
               {item.cover?.url ? (
                 <img src={item.cover.url} alt={item.title} className="w-full h-full object-cover rounded shadow-sm" />
               ) : (
                 <div className="w-full h-full bg-[#2D3436] rounded shadow-md flex items-center justify-center p-4 text-center border-s-8 border-[#1B5E20]">
                    <span className="text-white font-heading font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.title}</span>
                 </div>
               )}
               <div className="absolute top-3 end-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-[#1B5E20] shadow-sm flex items-center gap-1">
                 {item.kind === 'book' && <Book className="w-3 h-3" />}
                 {item.kind === 'document' && <FileText className="w-3 h-3" />}
                 {item.kind === 'recommended_text' && <Bookmark className="w-3 h-3" />}
                 <span className="capitalize">{item.kind.replace('_', ' ')}</span>
               </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-heading font-bold text-lg text-[#2D3436] mb-2 line-clamp-2 group-hover:text-[#1B5E20] transition-colors break-words">
                {item.title}
              </h3>
              {item.author && (
                <p className="text-sm text-[#636E72] mb-1">
                  {item.author}
                </p>
              )}
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[#636E72] border-t border-[#E0D8CE]/50">
                <span>{item.publisher}</span>
                <span>{item.year}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {bookList.length === 0 && (
        <div className="text-center py-20 bg-[#FAF8F5] rounded-md border border-[#E0D8CE]">
          <Book className="w-12 h-12 text-[#636E72]/50 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">No items found</h3>
          <p className="text-[#636E72]">Check back later for library publications and references.</p>
        </div>
      )}
    </div>
  );
}
