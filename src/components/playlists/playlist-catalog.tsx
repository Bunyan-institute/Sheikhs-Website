"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { FolderKanban, Search, BookOpen } from "lucide-react";

export interface PlaylistCatalogItem {
  id: string;
  title: string;
  description: string | null;
  href: string;
  count: number;
  kind: "playlist" | "course";
}

export function PlaylistCatalog({ items, locale }: { items: PlaylistCatalogItem[]; locale: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const labels = locale === "am"
    ? { title: "የድምፅ ስብስቦችና ትምህርቶች", search: "በስም ፈልግ", all: "ሁሉም", playlist: "የድምፅ ስብስቦች", course: "ትምህርቶች", lessons: "ደርሶች", open: "ክፈት", empty: "ምንም አልተገኘም" }
    : locale === "ar"
    ? { title: "قوائم الصوت والدورات", search: "البحث بالاسم", all: "الكل", playlist: "قوائم التشغيل", course: "الدورات", lessons: "دروس", open: "فتح", empty: "لا توجد نتائج" }
    : locale === "om"
    ? { title: "Tarree Sagalee fi Barnootaa", search: "Maqaan barbaadi", all: "Hunda", playlist: "Tarree Sagalee", course: "Barnoota", lessons: "darsii", open: "Bani", empty: "Bu'aan hin argamne" }
    : { title: "Audio Playlists & Courses", search: "Search by name", all: "All", playlist: "Audio playlists", course: "Courses", lessons: "lessons", open: "Open", empty: "No matching playlists or courses." };
  const filtered = useMemo(() => {
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
    const needle = query.trim().toLocaleLowerCase(locale);
    return items.filter((item) => (category === "all" || item.kind === category) &&
      `${item.title} ${item.description ?? ""}`.toLocaleLowerCase(locale).includes(needle))
      .sort((a, b) => collator.compare(a.title, b.title));
  }, [items, query, category, locale]);

  return (
    <section aria-label={labels.title} className="space-y-6 mb-10">
      <h2 className="font-display text-2xl font-bold text-[#0D3E2F]">{labels.title}</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search aria-hidden="true" className="absolute start-3 top-3.5 size-4 text-[#1B6A50]" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.search}
            className="w-full rounded-xl border border-[#0F241C]/20 bg-white py-3 ps-10 pe-4 text-base" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label={labels.title}>
          {(["all", "playlist", "course"] as const).map((kind) => (
            <button key={kind} type="button" aria-pressed={category === kind} onClick={() => setCategory(kind)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold border ${category === kind ? "bg-[#0D3E2F] text-white border-[#0D3E2F]" : "bg-white text-[#0D3E2F] border-[#0F241C]/20"}`}>
              {labels[kind]}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-[#0F241C]/70" role="status">{filtered.length} / {items.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Link key={item.id} href={item.href} className="group flex flex-col gap-3 rounded-2xl border border-[#0F241C]/15 bg-white p-5 hover:border-[#1B6A50] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-3 text-sm text-[#1B6A50]">
              {item.kind === "playlist" ? <FolderKanban aria-hidden="true" className="size-6" /> : <BookOpen aria-hidden="true" className="size-6" />}
              <span>{item.count} {labels.lessons}</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-[#0D3E2F] break-words">{item.title}</h3>
            {item.description && <p className="text-sm text-[#0F241C]/70 line-clamp-2">{item.description}</p>}
            <span className="mt-auto pt-2 text-sm font-semibold text-[#1B6A50]">{labels.open} · {labels[item.kind]}</span>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="rounded-2xl bg-white border p-8 text-center">{labels.empty}</p>}
    </section>
  );
}
