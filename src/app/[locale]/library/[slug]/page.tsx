import { setRequestLocale } from 'next-intl/server';
import { getLibraryItem, AUTHENTIC_BOOKS } from '@/lib/api/library';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Download, ExternalLink, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
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
      <Link 
        href="/library" 
        className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#555E61] hover:text-[#1A4D2E] mb-8"
      >
        <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180 text-[#8C6D23]" />
        Back to Library &amp; Treatises
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr] gap-8 md:gap-12 lg:gap-16">
        <div className="md:sticky md:top-24 self-start w-full space-y-6">
          {/* Classical Book Cover Presentation */}
          <div className="aspect-[2/3] max-w-[240px] sm:max-w-[280px] md:max-w-none mx-auto md:mx-0 bg-white flex items-center justify-center border border-[#E6E0D8] rounded-[4px] p-2 relative shadow-xs">
            <div className="w-full h-full rounded-[2px] overflow-hidden bg-[#FAF8F5] relative flex items-center justify-center border border-[#B8860B]/40">
              {item.cover?.url ? (
                <img src={item.cover.url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1A4D2E] p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[#FAF8F5] font-heading font-bold text-lg">{item.title}</span>
                  <span className="text-[#B8860B] font-body text-xs mt-3">{item.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Downloads / Access */}
          <div className="flex flex-col gap-2.5 max-w-[280px] md:max-w-none mx-auto md:mx-0">
            {item.file?.url && (
              <a 
                href={item.file.url} 
                className="inline-flex items-center justify-center gap-2 w-full bg-[#1A4D2E] hover:bg-[#143d24] text-[#FAF8F5] font-semibold py-3 px-4 rounded-[4px] text-xs sm:text-sm shadow-xs border border-[#143d24]" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 text-[#B8860B]" />
                Download Document (PDF)
              </a>
            )}
            {item.external_url && (
              <a 
                href={item.external_url} 
                className="inline-flex items-center justify-center gap-2 w-full bg-white border border-[#E6E0D8] text-[#2D3436] hover:border-[#1A4D2E] font-medium py-3 px-4 rounded-[4px] text-xs sm:text-sm" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                External Reference Link
                <ExternalLink className="w-4 h-4 text-[#8C6D23]" />
              </a>
            )}
            <div className="bg-[#FAF8F5] border border-[#E6E0D8] p-3.5 rounded-[4px] text-xs space-y-1.5 text-[#555E61]">
              <div className="flex items-center gap-1.5 font-semibold text-[#1A4D2E]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Scholarly Work of Sheikh Muhammed Ferej</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Authored, translated, or verified by Sheikh Muhammed Ferej Megeno.
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="bg-[#FAF8F5] text-[#1A4D2E] text-xs font-semibold px-2.5 py-0.5 rounded-[2px] border border-[#E6E0D8] uppercase tracking-wider">
                {item.kind.replace('_', ' ')}
              </span>
              <span className="text-xs text-[#8C6D23] font-medium">• Verified Publication</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2D3436] mb-3 leading-tight break-words">
              {item.title}
            </h1>
            <div className="text-base sm:text-lg text-[#555E61] font-body break-words">
              {item.author}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 border-y border-[#E6E0D8] text-xs">
            {item.publisher && (
              <div>
                <dt className="font-semibold text-[#7A8285] mb-1">Publisher</dt>
                <dd className="text-[#2D3436] font-medium">{item.publisher}</dd>
              </div>
            )}
            {item.year && (
              <div>
                <dt className="font-semibold text-[#7A8285] mb-1">Year</dt>
                <dd className="text-[#2D3436] font-medium">{item.year}</dd>
              </div>
            )}
            {item.isbn && (
              <div>
                <dt className="font-semibold text-[#7A8285] mb-1">ISBN</dt>
                <dd className="text-[#2D3436] font-medium">{item.isbn}</dd>
              </div>
            )}
          </div>

          <div className="prose prose-base sm:prose-lg font-body text-[#2D3436] max-w-none leading-relaxed">
            <h3 className="font-heading font-bold text-lg text-[#1A4D2E] mb-2">Description &amp; Academic Scope</h3>
            <p className="text-sm sm:text-base text-[#555E61] whitespace-pre-line">
              {item.description || item.summary}
            </p>
          </div>

          {/* Embedded Local PDF Reader if PDF file exists */}
          {item.file?.url && (
            <div className="space-y-4 pt-4 border-t border-[#E6E0D8]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1A4D2E]" />
                  <h3 className="font-heading font-bold text-lg text-[#2D3436]">
                    Document Viewer
                  </h3>
                </div>
                <a 
                  href={item.file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#1A4D2E] hover:underline"
                >
                  Open in New Window &rarr;
                </a>
              </div>
              <div className="w-full h-[650px] sm:h-[800px] border border-[#E6E0D8] rounded-[4px] bg-[#FAF8F5] overflow-hidden">
                <iframe 
                  src={`${item.file.url}#toolbar=1&navpanes=1`} 
                  className="w-full h-full"
                  title={item.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
