"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

export interface ArticleItem {
  id?: string;
  topic: string;
  min: number;
  lang: string;
  title: string;
  sub?: string;
  excerpt: string;
  slug?: string;
}

const TOPICS: Record<string, string> = {
  tarbiyah: 'Tarbiyah',
  jumah: "Jumu'ah",
  hadith: 'Hadith',
  spirituality: 'Spirituality',
  tafsir: 'Tafsir',
  worship: 'Worship',
  family: 'Family',
  unity: 'Unity',
  'islamic-finance': 'Islamic finance',
};

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    topic: 'tarbiyah',
    min: 4,
    lang: 'en',
    title: "Do not ruin your hereafter for people: putting Allah's pleasure above human approval",
    excerpt: "“Whoever seeks the pleasure of Allah at the risk of people's displeasure, Allah will be pleased with him and make people pleased with him.” (Ibn Hibban)",
  },
  {
    topic: 'jumah',
    min: 4,
    lang: 'en',
    title: 'Sending blessings upon the Prophet (ﷺ) on Friday and as-Salat al-Ibrahimiyyah',
    excerpt: "“Increase your prayers upon me on the day and night of Friday…” With the preferred Ibrahimiyyah formula.",
  },
  {
    topic: 'hadith',
    min: 3,
    lang: 'en',
    title: '“Shield yourselves from the Fire, even with half a date”: the virtue of charity and kind words',
    excerpt: 'Guard yourselves against the Fire even with half a date; whoever cannot, then with a good word. (Bukhari and Muslim)',
  },
  {
    topic: 'spirituality',
    min: 6,
    lang: 'am',
    title: 'ሰላማዊ ቀልብ — የልብ ንጽሕና እና መንፈሳዊ እርጋታ በኢስላም',
    sub: 'The sound heart',
    excerpt: 'በአላህ ዘንድ ዋጋ ያለው ንጹሕ ልብ (ቀልቡን ሰሊም) እንዴት ይገነባል? የልብ በሽታዎች፣ ቂም፣ ምቀኝነት እና ከንቱ ምኞቶችን የማከሚያ ቁርኣናዊ መፍትሔዎች።',
  },
  {
    topic: 'tafsir',
    min: 7,
    lang: 'am',
    title: 'ምህረትና እዝነት በቁርኣን አስተምህሮ — የሱረቱል ፈትህ እና ሱረቱል አሕቃፍ ማብራሪያ',
    excerpt: 'በሱረቱል ፈትህ ላይ የተገለጸው ግልጽ ድልና የአላህ ጽናት፣ በችግር ጊዜ የሚሰጥ ተስፋ እና በአሕቃፍ የተካተቱ ተግሣጾች ትንታኔ።',
  },
  {
    topic: 'worship',
    min: 5,
    lang: 'am',
    title: 'ዱዓእ ተቀባይነት የሚያገኝባቸው ቁልፍ ሁኔታዎችና ስነ-ስርዓቶች',
    excerpt: 'ዱዓእ የኢባዳህ አስኳል ነው። ተቀባይነት የሚያገኝባቸው የተወደዱ ወቅቶች፣ ውስጣዊ ትህትና፣ ሀላል ገቢና የአላህን ውሳኔ በትዕግስት መጠበቅ።',
  },
  {
    topic: 'family',
    min: 6,
    lang: 'am',
    title: 'የልጆች አስተዳደግ በኢስላማዊ መመሪያ — መሠረታዊ የቤተሰብ መርሆዎች',
    excerpt: 'ልጆችን በተውሂድ፣ በመልካም ስነ-ምግባር እና በአርአያነት ማሳደግ። የወላጆች ሃላፊነት፣ ሩህሩህ አቀራረብና ከዘመናዊ አፍራሽ ተጽእኖዎች የመጠበቅ ስልቶች።',
  },
  {
    topic: 'unity',
    min: 5,
    lang: 'am',
    title: 'ኢስላማዊ አንድነት እና የሰለፎች የትብብር መመሪያ',
    excerpt: 'አንድነት የሚመሠረተው በቁርኣንና ሐዲስ ትክክለኛ ግንዛቤ ላይ ነው። ጥቃቅን ልዩነቶችን በጥበብ ማስተናገድና ለኡማው የጋራ ህልውና መትጋት።',
  },
  {
    topic: 'islamic-finance',
    min: 8,
    lang: 'am',
    title: 'የሸሪዓዊ የፋይናንስ መርሆዎች እና ከወለድ የጸዳ የባንክ አገልግሎት በኢትዮጵያ',
    excerpt: 'ከወለድ ነፃ የባንክ አገልግሎት (Interest-free Banking) ምንነት፣ የአማናህ መስኮቶች አሰራር እና የAAOIFI የሸሪዓ ደረጃዎች ተግባራዊ ፋይዳ።',
  },
];

export function HomeArticleTabs({ initialArticles }: { initialArticles?: ArticleItem[] }) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const articles = initialArticles && initialArticles.length > 0 ? initialArticles : DEFAULT_ARTICLES;

  const tabKeys = ['all', ...Object.keys(TOPICS)];
  const filtered = articles.filter(a => selectedTopic === 'all' || a.topic === selectedTopic);

  return (
    <div>
      {/* Scrollable pill tabs */}
      <div className="-mx-4 px-4 overflow-x-auto pb-2 scrollbar-none">
        <div role="tablist" aria-label="Filter articles by topic" className="flex gap-2 w-max">
          {tabKeys.map((key) => {
            const isSelected = selectedTopic === key;
            return (
              <button
                key={key}
                role="tab"
                onClick={() => setSelectedTopic(key)}
                aria-selected={isSelected}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors min-h-[36px] ${
                  isSelected
                    ? 'bg-[#0D3E2F] text-[#EDF4F0] border border-[#0D3E2F] shadow-xs'
                    : 'border border-[#0F241C]/20 text-[#0F241C]/80 hover:border-[#1B6A50] hover:text-[#0F241C] bg-white'
                }`}
              >
                {key === 'all' ? 'All topics' : TOPICS[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-column article list */}
      {filtered.length > 0 ? (
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {filtered.map((item, idx) => (
            <li key={idx} className="border-t border-[#0F241C]/15 py-6 sm:py-7">
              <Link href={item.slug ? `/articles/${item.slug}` : "/articles"} className="group block">
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="text-[#1B6A50] font-semibold">{TOPICS[item.topic] || item.topic}</span>
                  <span className="text-[#0F241C]/45">{item.min} min read</span>
                </div>
                <h3
                  className={`mt-2 text-lg sm:text-[1.3rem] leading-snug group-hover:text-[#1B6A50] transition-colors ${
                    item.lang === 'am' ? 'font-ethiopic font-semibold' : 'font-display font-medium'
                  }`}
                  lang={item.lang}
                >
                  {item.title}
                </h3>
                {item.sub && (
                  <p className="mt-1 font-display text-[#0F241C]/60 text-xs sm:text-sm">{item.sub}</p>
                )}
                <p
                  className="mt-2.5 sm:mt-3 text-[#0F241C]/75 text-sm sm:text-[15px] leading-relaxed max-w-[60ch]"
                  lang={item.lang}
                >
                  {item.excerpt}
                </p>
                <span className="mt-3.5 sm:mt-4 inline-block text-xs sm:text-sm font-semibold text-[#0D3E2F] underline decoration-[#BF9A45]/70 underline-offset-4 group-hover:decoration-[#BF9A45] transition-colors">
                  Read the lesson
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-10 text-center py-12 border border-dashed border-[#0F241C]/20 rounded-2xl">
          <p className="text-[#0F241C]/60 text-sm">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default HomeArticleTabs;
