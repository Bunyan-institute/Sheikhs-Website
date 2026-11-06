"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  id?: string;
}

/** Chips for tags/categories: Enter or comma adds, the x removes. Replaces "comma separated" text boxes. */
export function TagInput({ value, onChange, suggestions = [], placeholder, id }: TagInputProps) {
  const t = useTranslations("admin.common");
  const [draft, setDraft] = useState("");
  const listId = useId();

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    setDraft("");
    if (tag && !value.some((v) => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
  };

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-adm-border bg-white px-2 py-1.5 focus-within:border-adm-primary focus-within:ring-2 focus-within:ring-adm-primary/25">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-adm-soft py-1 ps-3 pe-1 text-sm text-adm-text">
          {tag}
          <button
            type="button"
            aria-label={`${t("removeTag")} ${tag}`}
            onClick={() => onChange(value.filter((v) => v !== tag))}
            className="grid size-6 place-items-center rounded-full text-adm-muted hover:bg-white"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        id={id}
        list={suggestions.length ? listId : undefined}
        value={draft}
        onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length ? undefined : (placeholder ?? t("addTag"))}
        className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-base text-adm-text outline-none placeholder:text-adm-muted/60"
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
