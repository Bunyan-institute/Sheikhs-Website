import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFatwas } from "@/lib/api/fatwas";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fatwas & Rulings | Sheikh Ferej",
  description: "Scholarly fatwas, Islamic rulings, and answers to inquiries.",
};

export default async function FatwasPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const { category } = await searchParams;

  const fatwasRes = await getFatwas({ locale, category: category ? [category] : undefined });
  const fatwas = fatwasRes?.data || [];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <header className="mb-12 border-b border-[#E0D8CE] pb-10 text-center">
        <h1 className="font-heading text-4xl font-bold text-[#2D3436] mb-4">Fatwas & Rulings</h1>
        <p className="text-lg text-[#636E72] max-w-2xl mx-auto">
          Formal scholarly answers and rulings provided by the Sheikh on various contemporary and classical issues.
        </p>
      </header>

      <section className="mb-16">
        {fatwas.length > 0 ? (
          <div className="space-y-6">
            {fatwas.map((fatwa) => (
              <Link key={fatwa.id} href={`/fatwas/${fatwa.slug}`} className="block group">
                <div className="border border-[#E0D8CE] bg-white rounded-[4px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute start-0 top-0 bottom-0 w-1 bg-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium">
                    {fatwa.categories?.[0] && (
                      <span className="text-[#1B5E20] uppercase tracking-wide">
                        {fatwa.categories[0]}
                      </span>
                    )}
                    <span className="text-[#E0D8CE]">&bull;</span>
                    <span className="text-[#636E72]">
                      {formatDate(fatwa.published_at, locale)}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1B5E20] transition-colors break-words">
                    {fatwa.title}
                  </h3>
                  
                  {fatwa.question && (
                    <div className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-[4px] p-4 mb-4">
                      <p className="text-[#2D3436] font-medium text-sm line-clamp-2 break-words">
                        <span className="text-[#636E72] font-bold me-2">Q:</span>
                        {fatwa.question}
                      </p>
                    </div>
                  )}
                  
                  {fatwa.summary && (
                    <p className="text-[#636E72] mb-4 line-clamp-2">
                      {fatwa.summary}
                    </p>
                  )}
                  
                  <div className="text-[#1B5E20] font-semibold text-sm flex items-center gap-2">
                    <span>Read ruling</span>
                    <span aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E0D8CE] bg-white rounded-[4px]">
            <p className="text-[#636E72] text-lg">No fatwas found matching your criteria.</p>
          </div>
        )}
      </section>

      <section className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-[4px] p-8 text-center max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-3">Have a question?</h2>
        <p className="text-[#636E72] mb-6">
          Submit an inquiry through Ask the Sheikh. All questions are treated with confidentiality.
        </p>
        <Link 
          href="/ask" 
          className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-[4px] font-medium hover:bg-[#2D3436] transition-colors"
        >
          Submit Inquiry
        </Link>
      </section>
    </div>
  );
}
