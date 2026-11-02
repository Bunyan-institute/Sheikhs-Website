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
      <div className="-mx-4 px-4 overflow-x-auto pb-2">
        <div role="tablist" aria-label="Filter articles by topic" className="flex gap-2 w-max">
          {tabKeys.map((key) => {
            const isSelected = selectedTopic === key;
            return (
              <button
                key={key}
                role="tab"
                onClick={() => setSelectedTopic(key)}
                aria-selected={isSelected}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#0F3446] text-[#EDF2EE] border border-[#0F3446] shadow-xs'
                    : 'border border-[#14262E]/20 text-[#14262E]/80 hover:border-[#1D6A5A] hover:text-[#14262E]'
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
        <ol className="mt-6 grid md:grid-cols-2 gap-x-12">
          {filtered.map((item, idx) => (
            <li key={idx} className="border-t border-[#14262E]/15 py-7">
              <Link href={item.slug ? `/articles/${item.slug}` : "/articles"} className="group block">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#1D6A5A] font-medium">{TOPICS[item.topic] || item.topic}</span>
                  <span className="text-[#14262E]/45">{item.min} min read</span>
                </div>
                <h3
                  className={`mt-2 text-[1.3rem] leading-snug group-hover:text-[#1D6A5A] transition-colors ${
                    item.lang === 'am' ? 'font-ethiopic' : 'font-display'
                  }`}
                  lang={item.lang}
                >
                  {item.title}
                </h3>
                {item.sub && (
                  <p className="mt-1 font-display text-[#14262E]/60 text-sm">{item.sub}</p>
                )}
                <p
                  className="mt-3 text-[#14262E]/70 text-[15px] leading-relaxed max-w-[60ch]"
                  lang={item.lang}
                >
                  {item.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#0F3446] underline decoration-[#BF9A45]/70 underline-offset-4 group-hover:decoration-[#BF9A45] transition-colors">
                  Read the lesson
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-8 text-[#14262E]/60 text-sm">
          No lessons in this topic yet. Choose another topic above.
        </p>
      )}
    </div>
  );
}

export default HomeArticleTabs;