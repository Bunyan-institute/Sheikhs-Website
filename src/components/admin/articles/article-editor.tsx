"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Heading2, Italic, Link2, List, PlayCircle, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/admin/ui/modal";
import { SourceField } from "@/components/admin/ui/source-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { buttonPrimary, buttonSecondary, textareaClass } from "@/components/admin/ui/form-field";
import { expandMediaPlaceholders, markdownLiteToHtml } from "@/lib/rich-text";
import { parseMediaUrl } from "@/lib/media-source";
import { renderArticlePreview } from "@/app/admin/actions";

export type ArticleFormat = "text" | "html";

interface ArticleEditorProps {
  source: string;
  format: ArticleFormat;
  onChange: (next: { source: string; format: ArticleFormat }) => void;
  id?: string;
}

/** Plain text with a few big buttons and a live preview. Older HTML articles open in an HTML mode instead. */
export function ArticleEditor({ source, format, onChange, id }: ArticleEditorProps) {
  const t = useTranslations("admin.editor");
  const tCommon = useTranslations("admin.common");
  const { prompt, confirm } = useAdminFeedback();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [legacyPreview, setLegacyPreview] = useState("");

  const set = (next: string) => onChange({ source: next, format });

  // Older HTML is sanitised on the server before it is previewed.
  useEffect(() => {
    if (format !== "html" || tab !== "preview") return;
    let cancelled = false;
    const timer = setTimeout(() => renderArticlePreview(source).then((h) => !cancelled && setLegacyPreview(h)).catch(() => {}), 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [format, source, tab]);

  const previewHtml = format === "text" ? expandMediaPlaceholders(markdownLiteToHtml(source)) : legacyPreview;

  /** Run an edit on the current selection, then restore focus and selection. */
  const edit = (fn: (selected: string, before: string, after: string) => { text: string; select?: [number, number] }) => {
    const el = areaRef.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const result = fn(value.slice(a, b), value.slice(0, a), value.slice(b));
    const next = value.slice(0, a) + result.text + value.slice(b);
    set(next);
    requestAnimationFrame(() => {
      el.focus();
      const [s, e] = result.select ?? [a + result.text.length, a + result.text.length];
      el.setSelectionRange(a + s, a + e);
    });
  };

  const wrap = (mark: string) => () =>
    edit((sel) => ({ text: `${mark}${sel || ""}${mark}`, select: sel ? [mark.length, mark.length + sel.length] : [mark.length, mark.length] }));

  const prefixLines = (prefix: string) => () =>
    edit((sel) => {
      const lines = (sel || "").split("\n");
      return { text: lines.map((l) => (l.startsWith(prefix) ? l : prefix + l)).join("\n") };
    });

  const addLink = async () => {
    const el = areaRef.current;
    const selected = el ? el.value.slice(el.selectionStart, el.selectionEnd) : "";
    const url = await prompt({ message: t("linkPrompt"), placeholder: "https://", confirmLabel: t("insert") });
    if (!url?.trim()) return;
    edit((sel) => ({ text: `[${sel || selected || t("linkText")}](${url.trim()})` }));
  };

  const insertMedia = () => {
    const p = parseMediaUrl(mediaUrl);
    if (!p.valid) return;
    setMediaOpen(false);
    setMediaUrl("");
    edit((_sel, before) => ({ text: `${before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : ""}${p.url}\n\n` }));
  };

  const startOver = async () => {
    if (await confirm({ message: t("startOverConfirm"), danger: true, confirmLabel: tCommon("confirm") })) onChange({ source: "", format: "text" });
  };

  const tools = [
    { key: "bold", icon: Bold, run: wrap("**") },
    { key: "italic", icon: Italic, run: wrap("_") },
    { key: "heading", icon: Heading2, run: prefixLines("## ") },
    { key: "list", icon: List, run: prefixLines("- ") },
    { key: "quote", icon: Quote, run: prefixLines("> ") },
    { key: "link", icon: Link2, run: addLink },
    { key: "media", icon: PlayCircle, run: () => setMediaOpen(true) },
  ] as const;

  return (
    <div className="overflow-hidden rounded-xl border border-adm-border bg-white focus-within:border-adm-primary focus-within:ring-2 focus-within:ring-adm-primary/20">
      {format === "html" && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-adm-border bg-adm-warn-soft px-4 py-2.5 text-sm text-adm-text">
          <span>{t("legacyNotice")}</span>
          <button type="button" onClick={startOver} className="font-semibold text-adm-primary underline">
            {t("startOver")}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-b border-adm-border bg-adm-soft/50 px-2 py-1.5">
        <div className="flex gap-1 overflow-x-auto">
          {format === "text" &&
            tools.map(({ key, icon: Icon, run }) => (
              <button
                key={key}
                type="button"
                onClick={run}
                aria-label={t(key)}
                title={t(key)}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-adm-text hover:bg-white"
              >
                <Icon className="size-5" />
                <span className="hidden lg:inline">{t(key)}</span>
              </button>
            ))}
        </div>
        <div className="flex shrink-0 rounded-lg bg-white p-0.5" role="tablist">
          {(["write", "preview"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`min-h-10 rounded-md px-3.5 text-sm font-semibold ${tab === k ? "bg-adm-primary text-white" : "text-adm-muted"}`}
            >
              {t(k)}
            </button>
          ))}
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          id={id}
          ref={areaRef}
          value={source}
          onChange={(e) => set(e.target.value)}
          rows={14}
          placeholder={t("placeholder")}
          dir="auto"
          spellCheck
          className={`${textareaClass} min-h-72 resize-y rounded-none border-0 !ring-0 focus:!ring-0 ${format === "html" ? "font-mono text-sm" : ""}`}
        />
      ) : (
        <div className="min-h-72 px-5 py-4">
          {previewHtml.trim() ? (
            <div
              dir="auto"
              className="article-body max-w-none text-base text-adm-text"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <p className="py-10 text-center text-adm-muted">{t("emptyPreview")}</p>
          )}
        </div>
      )}

      {tab === "write" && format === "text" && <p className="border-t border-adm-border px-4 py-2 text-xs text-adm-muted">{t("help")}</p>}

      <Modal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        title={t("mediaTitle")}
        size="md"
        footer={
          <>
            <button type="button" className={buttonSecondary} onClick={() => setMediaOpen(false)}>
              {tCommon("cancel")}
            </button>
            <button type="button" className={buttonPrimary} onClick={insertMedia} disabled={!parseMediaUrl(mediaUrl).valid}>
              {t("insert")}
            </button>
          </>
        }
      >
        <SourceField value={mediaUrl} onChange={setMediaUrl} />
      </Modal>
    </div>
  );
}
