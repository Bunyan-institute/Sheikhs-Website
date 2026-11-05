"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

export interface ArticleItem {
  id?: string;
  topic: string;
  min: number;
  lang: string;
  title: string;
  sub?: string;
  excerpt: string;
  slug: string;
}

const TOPICS_FALLBACK: Record<string, string> = {
  all: "All topics",
  tarbiyah: "Tarbiyah",
  jumah: "Jumu'ah",
  hadith: "Hadith",
  spirituality: "Spirituality",
  tafsir: "Tafsir",
  worship: "Worship",
  family: "Family",
  unity: "Unity",
  "islamic-finance": "Islamic finance",
};

export function HomeArticleTabs({ articles }: { articles: ArticleItem[] }) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  let tTopics = (key: string) => TOPICS_FALLBACK[key] || key;
  let readLessonLabel = "Read the lesson";

  try {
    const tArt = useTranslations("articles");
    const tHome = useTranslations("home");
    tTopics = (key: string) => {
      try {
        return tArt(`topics.${key}`);
      } catch {
        return TOPICS_FALLBACK[key] || key;
      }
    };
    try {
      readLessonLabel = tHome("readLesson");
    } catch {
      readLessonLabel = "Read the lesson";
    }
  } catch {
    // fallback if context not ready
  }

  const tabKeys = ["all", ...Array.from(new Set(articles.map((a) => a.topic).filter(Boolean)))];
  const filtered = articles.filter((a) => selectedTopic === "all" || a.topic === selectedTopic);

  return (
    <div>
      {/* Scrollable pill tabs */}
      <div className="-mx-4 px-4 overflow-x-auto pb-3 scrollbar-none">
        <div role="tablist" aria-label="Filter articles by topic" className="flex gap-2 w-max">
          {tabKeys.map((key) => {
            const isSelected = selectedTopic === key;
            return (
              <button
                key={key}
                role="tab"
                onClick={() => setSelectedTopic(key)}
                aria-selected={isSelected}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[38px] ${
                  isSelected
                    ? "bg-[#0D3E2F] text-white border border-[#0D3E2F] shadow-sm ring-1 ring-[#BF9A45]/40"
                    : "border border-[#0F241C]/15 text-[#0F241C]/80 hover:border-[#1B6A50] hover:text-[#0D3E2F] hover:bg-white bg-white/70"
                }`}
              >
                {tTopics(key)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-column interactive article cards */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, idx) => (
            <article key={idx}>
              <Link
                href={`/articles/${item.slug}`}
                className="interactive-card group block bg-white border border-[#0F241C]/10 hover:border-[#BF9A45] p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3E2F]/10 text-[#0D3E2F] font-bold text-[11px] uppercase tracking-wider">
                      <BookOpen className="w-3 h-3 text-[#1B6A50]" />
                      {tTopics(item.topic)}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#0F241C]/50 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                      <span>{item.min} min read</span>
                    </span>
                  </div>

                  <h3
                    className={`mt-3.5 text-lg sm:text-xl font-bold leading-snug text-[#0F241C] group-hover:text-[#1B6A50] transition-colors ${
                      item.lang === "am" ? "font-ethiopic" : "font-display"
                    }`}
                    lang={item.lang}
                  >
                    {item.title}
                  </h3>

                  {item.sub && (
                    <p className="mt-1 font-display text-[#0F241C]/60 text-xs sm:text-sm font-medium">{item.sub}</p>
                  )}

                  <p
                    className="mt-2.5 text-[#0F241C]/75 text-sm sm:text-[14.5px] leading-relaxed line-clamp-3"
                    lang={item.lang}
                  >
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0F241C]/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D3E2F] group-hover:text-[#1B6A50] transition-colors">
                    <span>{readLessonLabel}</span>
                    <ArrowRight className="w-4 h-4 text-[#BF9A45] group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <span className="text-[11px] font-semibold text-[#BF9A45] opacity-0 group-hover:opacity-100 transition-opacity">
                    ★
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center py-12 border border-dashed border-[#0F241C]/20 rounded-2xl bg-white/50">
          <p className="text-[#0F241C]/60 text-sm">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default HomeArticleTabs;
