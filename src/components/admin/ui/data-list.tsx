"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "./empty-state";
import { inputClass, buttonSecondary } from "./form-field";

interface DataListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  /** Text the search box matches against; omit to hide the search box. */
  searchText?: (item: T) => string;
  /** Pre-filtered by the page's own tabs/filters before search and paging are applied. */
  toolbar?: React.ReactNode;
  /** Desktop table head, e.g. <tr><th>…</th></tr>. */
  header: React.ReactNode;
  /** Desktop table row (a <tr>). */
  renderRow: (item: T) => React.ReactNode;
  /** Phone card. */
  renderCard: (item: T) => React.ReactNode;
  pageSize?: number;
  emptyTitle: string;
  emptyHint?: string;
  emptyAction?: React.ReactNode;
}

/** A table on desktop and stacked cards on phones, with search and "show more". No sideways scrolling. */
export function DataList<T>({
  items,
  getKey,
  searchText,
  toolbar,
  header,
  renderRow,
  renderCard,
  pageSize = 20,
  emptyTitle,
  emptyHint,
  emptyAction,
}: DataListProps<T>) {
  const t = useTranslations("admin.common");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(pageSize);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q && searchText ? items.filter((i) => searchText(i).toLowerCase().includes(q)) : items;
  }, [items, query, searchText]);
  const visible = filtered.slice(0, limit);

  return (
    <div className="space-y-4">
      {(searchText || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchText && (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-adm-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(pageSize);
                }}
                placeholder={t("search")}
                aria-label={t("search")}
                className={`${inputClass} ps-9`}
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {filtered.length === 0 ? (
        items.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />
        ) : (
          <EmptyState title={t("noResults")} />
        )
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-adm-border bg-white md:block">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-adm-border bg-adm-soft/60 text-xs font-bold uppercase tracking-wide text-adm-muted">{header}</thead>
              <tbody className="divide-y divide-adm-border">
                {visible.map((item) => (
                  <FragmentKey key={getKey(item)}>{renderRow(item)}</FragmentKey>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 md:hidden">
            {visible.map((item) => (
              <li key={getKey(item)} className="rounded-2xl border border-adm-border bg-white p-4">
                {renderCard(item)}
              </li>
            ))}
          </ul>
          {filtered.length > limit && (
            <div className="flex justify-center">
              <button type="button" className={buttonSecondary} onClick={() => setLimit((l) => l + pageSize)}>
                {t("showMore")} ({filtered.length - limit})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FragmentKey({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
