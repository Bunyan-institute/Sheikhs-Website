import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwa, AUTHENTIC_FATWAS } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const f of AUTHENTIC_FATWAS) {
      params.push({ locale, slug: f.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const fatwa = await getFatwa(slug, locale);
    return {
      title: `${fatwa.title} | Sheikh Ferej`,
      description: fatwa.summary || "Islamic ruling by Sheikh Ferej.",
    };
  } catch {
    return {
      title: "Ruling Not Found | Sheikh Ferej",
    };
  }
}

function formatMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, '<h3 class="font-heading text-xl font-bold text-[#2D3436] mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-heading text-2xl font-bold text-[#2D3436] mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-[#2D3436]">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ms-5 list-disc text-[#2D3436] mb-1">$1</li>')
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) return trimmed;
      return `<p class="leading-relaxed mb-4 text-[#2D3436] break-words">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

export default async function FatwaPage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let fatwa;
  try {
    fatwa = await getFatwa(slug, locale);
  } catch (error) {
    notFound();
  }

  return (
    <article className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      <div className="mb-8 sm:mb-10">
        <Link 
          href="/fatwas" 
          className="inline-flex items-center text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors"
        >
          <span className="me-2 rtl:rotate-180 inline-block">&larr;</span> All Fatwas & Fiqh Rulings
        </Link>
      </div>

      <header className="mb-8 sm:mb-10">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D3436] leading-tight mb-6 break-words">
          {fatwa.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 border-y border-[#E0D8CE] text-xs sm:text-sm">
          {fatwa.categories?.map((cat) => (
            <span key={cat} className="text-[#1B5E20] font-medium capitalize">
              {cat}
            </span>
          ))}
          {fatwa.categories?.length > 0 && <span className="text-[#E0D8CE]">&bull;</span>}
          <span className="text-[#636E72]">
            {formatDate(fatwa.published_at, locale)}
          </span>
          <span className="text-[#E0D8CE]">&bull;</span>
          <span className="text-[#636E72] font-medium">
            Ref: {fatwa.id.substring(0, 8)}
          </span>
        </div>
      </header>

      <div className="space-y-6 sm:space-y-8">
        {fatwa.question && (
          <section className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-[4px] p-5 sm:p-8">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#B8860B] mb-4">
              Question:
            </h2>
            <div 
              className="prose prose-lg max-w-none text-[#2D3436] leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(fatwa.question) }}
            />
          </section>
        )}

        {fatwa.answer && (
          <section className="bg-white border border-[#E0D8CE] rounded-[4px] p-5 sm:p-8 shadow-sm">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1B5E20] mb-6 border-b border-[#E0D8CE] pb-4">
              Ruling / Sheikh&apos;s Answer:
            </h2>
            <div 
              className="prose prose-lg max-w-none prose-scholarly text-[#2D3436] break-words"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(fatwa.answer) }}
            />
          </section>
        )}
      </div>
      
      <div className="mt-12 text-center text-sm text-[#636E72] border-t border-[#E0D8CE] pt-8">
        <p>This ruling is issued based on the specific circumstances presented in the question.</p>
        <p className="mt-2">Have your own question? <Link href="/ask" className="text-[#1B5E20] hover:underline">Submit an inquiry</Link>.</p>
      </div>
    </article>
  );
}
