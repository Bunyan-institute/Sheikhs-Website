"use client";

import { useTranslations } from "next-intl";

/** Published / draft chip used on every content list. */
export function StatusBadge({ status }: { status?: "draft" | "published" | string }) {
  const t = useTranslations("admin.common");
  const draft = status === "draft";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
        draft ? "bg-adm-warn-soft text-[#7a5b00]" : "bg-adm-soft text-adm-primary"
      }`}
    >
      {draft ? t("draft") : t("published")}
    </span>
  );
}
