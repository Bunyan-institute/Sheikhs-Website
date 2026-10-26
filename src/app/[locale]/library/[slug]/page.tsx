import { setRequestLocale } from 'next-intl/server';
import { getLibraryItem, AUTHENTIC_BOOKS } from '@/lib/api/library';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Download, ExternalLink, ArrowLeft, Bookmark } from 'lucide-react';
import type { PublicBook } from '@/lib/api/types';

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const b of AUTHENTIC_BOOKS) {
      params.push({ locale, slug: b.slug });
    }
  }
  return params;
}

export default async function LibraryItemPage(props: { params: Promise<{ locale: string, slug: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  let item: PublicBook | null = null;
  try {
    item = await getLibraryItem(params.slug, params.locale);
  } catch {
    return notFound();
  }

  if (!item) return notFound();

  return (
    <article className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      <Link href="/library" className="inline-flex items-center text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
        Back to Library & Kitab Archives
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr] gap-8 md:gap-12 lg:gap-16">
        <div className="md:sticky md:top-8 self-start w-full">
           <div className="aspect-[2/3] max-w-[240px] sm:max-w-[280px] md:max-w-none mx-auto md:mx-0 bg-[#FAF8F5] flex items-center justify-center border border-[#E0D8CE] shadow-md rounded-md overflow-hidden relative">
               {item.cover?.url ? (
                 <img src={item.cover.url} alt={item.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-[#2D3436] p-6 flex flex-col items-center justify-center text-center border-s-8 border-[#1B5E20]">
                    <span className="text-white font-heading font-medium text-xl opacity-90">{item.title}</span>
                    <span className="text-white/60 font-body text-sm mt-4">{item.author}</span>
                 </div>
               )}
           </div>

           <div className="mt-6 md:mt-8 flex flex-col gap-3 max-w-[280px] md:max-w-none mx-auto md:mx-0">
              {item.file?.url && (
                <a href={item.file.url} className="inline-flex items-center justify-center w-full bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white font-medium py-3 px-4 rounded-md transition-colors" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 me-2" />
                  Download Document (PDF)
                </a>
              )}
              {item.external_url && (
                <a href={item.external_url} className="inline-flex items-center justify-center w-full bg-white border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#FAF8F5] font-medium py-3 px-4 rounded-md transition-colors" target="_blank" rel="noopener noreferrer">
                  Read External Reference
                  <ExternalLink className="w-4 h-4 ms-2" />
                </a>
              )}
              {item.kind === 'recommended_text' && !item.file?.url && !item.external_url && (
                <div className="bg-[#FFF8E1] border border-[#B8860B] text-[#B8860B] p-4 rounded-md flex items-start">
                  <Bookmark className="w-5 h-5 me-3 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Recommended by the Sheikh for study.</p>
                </div>
              )}
           </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
             <span className="bg-[#FAF8F5] text-[#2D3436] text-xs font-semibold px-2.5 py-0.5 rounded border border-[#E0D8CE] uppercase tracking-wider">{item.kind.replace('_', ' ')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2D3436] mb-4 leading-tight break-words">
            {item.title}
          </h1>
          <div className="text-lg sm:text-xl text-[#636E72] mb-6 sm:mb-8 font-body break-words">
            {item.author}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[#E0D8CE] mb-8">
            {item.publisher && (
              <div>
                <dt className="text-sm font-medium text-[#636E72] mb-1">Publisher</dt>
                <dd className="text-[#2D3436] font-medium">{item.publisher}</dd>
              </div>
            )}
            {item.year && (
              <div>
                <dt className="text-sm font-medium text-[#636E72] mb-1">Year</dt>
                <dd className="text-[#2D3436] font-medium">{item.year}</dd>
              </div>
            )}
            {item.isbn && (
              <div>
                <dt className="text-sm font-medium text-[#636E72] mb-1">ISBN</dt>
                <dd className="text-[#2D3436] font-medium">{item.isbn}</dd>
              </div>
            )}
          </div>

          <div className="prose prose-lg prose-headings:font-heading prose-headings:text-[#2D3436] prose-p:text-[#2D3436]/80 max-w-none font-body">
            {item.description || item.summary}
          </div>
        </div>
      </div>
    </article>
  );
}
