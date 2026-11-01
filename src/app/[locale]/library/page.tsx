import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLibrary } from '@/lib/api/library';
import { Link } from '@/i18n/navigation';
import { Book, FileText, Bookmark, ArrowRight } from 'lucide-react';
import type { PublicBook } from '@/lib/api/types';

export default async function LibraryPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "library" });

  let bookList: PublicBook[] = [];
  try {
    const items = await getLibrary({ locale: params.locale });
    bookList = items?.data || [];
  } catch (err) {
    console.error("Failed to load library items", err);
  }

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      {/* Classical Scholarly Library Header */}
      <header className="mb-12 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                {t("arabicBadge")}
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                {t("subtitle")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t("description")}
          </p>
        </div>
      </header>

      {/* Official App Access Banner */}
      <div className="mb-10 p-5 rounded-[4px] bg-[#FAF8F5] border border-[#1A4D2E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#1A4D2E] text-[#B8860B] flex items-center justify-center font-bold font-heading text-lg shrink-0">
            م
          </div>
          <div>
            <span className="font-heading font-bold text-sm text-[#2D3436] block">
              ሸይኽ ሙሃመድ ፈረጅ — Android Mobile App
            </span>
            <span className="text-xs text-[#555E61]">
              Download complete audio halaqat &amp; Africa TV video series directly to your phone for offline study.
            </span>
          </div>
        </div>
        <a
          href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#1A4D2E] text-white rounded-[3px] text-xs font-bold hover:bg-[#143d24] whitespace-nowrap shrink-0 transition-colors"
        >
          Download from Google Play &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bookList.map((item: PublicBook) => (
          <Link 
            key={item.id} 
            href={`/library/${item.slug}`} 
            className="group flex flex-col h-full bg-white rounded-[4px] border border-[#E6E0D8] overflow-hidden hover:border-[#1A4D2E] transition-colors"
          >
            <div className="aspect-[2/3] bg-[#FAF8F5] flex items-center justify-center relative p-6 border-b border-[#E6E0D8]">
               {item.cover?.url ? (
                 <img src={item.cover.url} alt={item.title} className="w-full h-full object-cover rounded-[2px]" />
               ) : (
                 <div className="w-full h-full bg-[#1A4D2E] rounded-[2px] flex flex-col items-center justify-center p-4 text-center border border-[#B8860B]/40">
                    <span className="text-[#FAF8F5] font-heading font-bold text-lg">{item.title}</span>
                    <span className="text-[#B8860B] font-body text-xs mt-3">{item.author}</span>
                 </div>
               )}
               <div className="absolute top-3 end-3 bg-[#FAF8F5] border border-[#E6E0D8] px-2.5 py-1 rounded-[2px] text-[11px] font-semibold text-[#1A4D2E] flex items-center gap-1.5 shadow-2xs">
                 {item.kind === 'book' && <Book className="w-3 h-3 text-[#B8860B]" />}
                 {item.kind === 'document' && <FileText className="w-3 h-3 text-[#1A4D2E]" />}
                 {item.kind === 'recommended_text' && <Bookmark className="w-3 h-3 text-[#8C6D23]" />}
                 <span className="capitalize">{item.kind.replace('_', ' ')}</span>
               </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#2D3436] mb-2 line-clamp-2 group-hover:text-[#1A4D2E] transition-colors break-words">
                {item.title}
              </h3>
              {item.author && (
                <p className="text-xs text-[#555E61] mb-2">
                  {item.author}
                </p>
              )}
              {item.summary && (
                <p className="text-xs text-[#7A8285] line-clamp-2 mb-4 leading-relaxed">
                  {item.summary}
                </p>
              )}
              <div className="mt-auto pt-3 flex items-center justify-between text-xs text-[#8C6D23] font-semibold border-t border-[#FAF8F5]">
                <span>Study Treatise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {bookList.length === 0 && (
        <div className="text-center py-20 bg-[#FAF8F5] rounded-[4px] border border-[#E6E0D8]">
          <Book className="w-12 h-12 text-[#7A8285]/50 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">No items found</h3>
          <p className="text-[#7A8285] text-sm">Library records are being synchronized.</p>
        </div>
      )}
    </div>
  );
}
