"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { slugify } from "@/lib/slugify";
import { FormField, inputClass } from "./form-field";

interface SlugFieldProps {
  /** The title the slug is derived from. */
  title: string;
  value: string;
  onChange: (slug: string) => void;
  label: string;
  /** New items follow the title until the user edits the slug by hand. */
  autoFollowTitle?: boolean;
  fallbackPrefix?: string;
}

export function SlugField({ title, value, onChange, label, autoFollowTitle = true, fallbackPrefix = "item" }: SlugFieldProps) {
  const t = useTranslations("admin.common");
  const touched = useRef(!autoFollowTitle || value !== "");
  const [, force] = useState(0);

  useEffect(() => {
    if (!touched.current && title.trim()) onChange(slugify(title, { fallbackPrefix }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <FormField label={label} hint={t("slugHint")} required>
      {(id) => (
        <div className="flex gap-2">
          <input
            id={id}
            dir="ltr"
            className={`${inputClass} font-mono text-sm`}
            value={value}
            onChange={(e) => {
              touched.current = true;
              force((n) => n + 1);
              onChange(e.target.value);
            }}
            required
          />
          <button
            type="button"
            title={t("regenerate")}
            aria-label={t("regenerate")}
            onClick={() => {
              touched.current = false;
              onChange(slugify(title, { fallbackPrefix }));
            }}
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-adm-border text-adm-primary hover:bg-adm-soft"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      )}
    </FormField>
  );
}
