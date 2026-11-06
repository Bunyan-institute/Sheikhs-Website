"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { useStandalone } from "@/components/admin/pwa/use-standalone";
import { Modal } from "@/components/admin/ui/modal";
import { DataList } from "@/components/admin/ui/data-list";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { FormField, buttonPrimary, buttonSecondary, inputClass, textareaClass } from "@/components/admin/ui/form-field";
import { SlugField } from "@/components/admin/ui/slug-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import { UploadField } from "@/components/admin/ui/upload-field";
import { ArticleEditor, type ArticleFormat } from "@/components/admin/articles/article-editor";
import { estimateReadingMinutes, readSourceMarker } from "@/lib/rich-text";
import { saveArticleAction, deleteArticleAction } from "../actions";
import type { PublicArticle } from "@/lib/api/types";

const DRAFT_KEY = "sheikh:article-draft:new";

interface LocalDraft {
  title: string;
  summary: string;
  source: string;
  topics: string[];
  keywords: string[];
  coverUrl: string;
}

export function ArticlesClient({ initialArticles }: { initialArticles: PublicArticle[] }) {
  const { toast, confirm } = useAdminFeedback();
  const t = useTranslations("admin.articles");
  const tCommon = useTranslations("admin.common");
  const tEditor = useTranslations("admin.editor");
  const locale = useLocale();
  const standalone = useStandalone();

  const [articles, setArticles] = useState<PublicArticle[]>(initialArticles);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<PublicArticle | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("");
  const [format, setFormat] = useState<ArticleFormat>("text");
  const [topics, setTopics] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [readingOverride, setReadingOverride] = useState("");
  const [published, setPublished] = useState(true);
  const draftReady = useRef(false);

  const topicSuggestions = useMemo(() => [...new Set(articles.flatMap((a) => a.categories ?? []))].sort(), [articles]);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setSource("");
    setFormat("text");
    setTopics([]);
    setKeywords([]);
    setCoverUrl("");
    setReadingOverride("");
    setPublished(true);
  };

  const openNew = async () => {
    reset();
    draftReady.current = false;
    setModalOpen(true);
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as LocalDraft;
        if ((draft.title || draft.source) && (await confirm({ message: tEditor("draftFound"), danger: false, confirmLabel: tCommon("confirm") }))) {
          setTitle(draft.title);
          setSummary(draft.summary);
          setSource(draft.source);
          setTopics(draft.topics ?? []);
          setKeywords(draft.keywords ?? []);
          setCoverUrl(draft.coverUrl ?? "");
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      // storage unavailable: no draft recovery
    }
    draftReady.current = true;
  };

  useOpenNewFromQuery(openNew);

  const openEdit = (a: PublicArticle) => {
    reset();
    draftReady.current = false;
    setEditing(a);
    setTitle(a.title);
    setSlug(a.slug);
    setSummary(a.summary || "");
    const typed = readSourceMarker(a.body);
    setSource(typed ?? a.body ?? "");
    setFormat(typed !== null || !a.body ? "text" : "html");
    setTopics(a.categories ?? []);
    setKeywords(a.tags ?? []);
    setCoverUrl(a.cover?.url || "");
    setReadingOverride(a.reading_minutes ? String(a.reading_minutes) : "");
    setPublished(a.status !== "draft");
    setModalOpen(true);
  };

  // New articles are kept on this device while typing, so a closed tab or dropped connection loses nothing.
  useEffect(() => {
    if (!modalOpen || editing || !draftReady.current) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, summary, source, topics, keywords, coverUrl } satisfies LocalDraft));
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [modalOpen, editing, title, summary, source, topics, keywords, coverUrl]);

  const autoMinutes = estimateReadingMinutes(source);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveArticleAction({
        status: published ? "published" : "draft",
        id: editing?.id,
        title: title.trim(),
        slug,
        summary,
        bodySource: source,
        bodyFormat: format,
        readingMinutes: Number(readingOverride) > 0 ? Number(readingOverride) : undefined,
        categories: topics,
        tags: keywords,
        coverUrl: coverUrl.trim() || undefined,
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setArticles((prev) => (editing ? prev.map((a) => (a.id === editing.id ? res.article : a)) : [res.article, ...prev]));
      if (!editing) localStorage.removeItem(DRAFT_KEY);
      setModalOpen(false);
      toast.success(tCommon("successSave"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: PublicArticle) => {
    if (!(await confirm({ message: `${t("deleteConfirm")} (${a.title})` }))) return;
    try {
      await deleteArticleAction(a.id);
      setArticles((prev) => prev.filter((x) => x.id !== a.id));
      toast.success(tCommon("successDelete"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    }
  };

  const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : "—");

  const actions = (a: PublicArticle) => (
    <div className="flex items-center justify-end gap-1.5">
      {!standalone && (
        <Link href={`/${locale}/articles/${a.slug}`} target="_blank" aria-label={tCommon("viewLive")} title={tCommon("viewLive")} className="grid size-11 place-items-center rounded-lg text-adm-muted hover:bg-adm-soft">
          <ExternalLink className="size-4" />
        </Link>
      )}
      <button type="button" onClick={() => openEdit(a)} aria-label={`${tCommon("edit")} ${a.title}`} className={`${buttonSecondary} !px-3`}>
        <Pencil className="size-4" />
        <span>{tCommon("edit")}</span>
      </button>
      <button type="button" onClick={() => handleDelete(a)} aria-label={`${tCommon("delete")} ${a.title}`} className={`${buttonSecondary} !px-3 text-adm-danger`}>
        <Trash2 className="size-4" />
        <span>{tCommon("delete")}</span>
      </button>
    </div>
  );

  const topicChips = (a: PublicArticle) =>
    (a.categories ?? []).slice(0, 2).map((c) => (
      <span key={c} className="rounded-full bg-adm-soft px-2.5 py-0.5 text-xs font-semibold text-adm-primary">
        {c}
      </span>
    ));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-adm-text">
            {t("heading")} <span className="text-adm-muted">({articles.length})</span>
          </h1>
          <p className="mt-0.5 text-sm text-adm-muted">{t("subheading")}</p>
        </div>
        <button type="button" onClick={openNew} className={buttonPrimary}>
          <Plus className="size-5" />
          {t("newArticle")}
        </button>
      </div>

      <DataList
        items={articles}
        getKey={(a) => a.id}
        searchText={(a) => `${a.title} ${a.slug} ${a.summary ?? ""} ${(a.categories ?? []).join(" ")}`}
        emptyTitle={t("emptyTitle")}
        emptyHint={t("emptyHint")}
        emptyAction={
          <button type="button" onClick={openNew} className={buttonPrimary}>
            <Plus className="size-5" />
            {t("newArticle")}
          </button>
        }
        header={
          <tr>
            <th className="px-4 py-3">{t("colTitle")}</th>
            <th className="px-4 py-3">{tCommon("status")}</th>
            <th className="px-4 py-3">{t("colDate")}</th>
            <th className="px-4 py-3 text-end">{t("colActions")}</th>
          </tr>
        }
        renderRow={(a) => (
          <tr key={a.id} className="align-middle">
            <td className="max-w-md px-4 py-3">
              <p className="truncate font-semibold text-adm-text">{a.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {topicChips(a)}
                {a.reading_minutes ? (
                  <span className="inline-flex items-center gap-1 text-xs text-adm-muted">
                    <Clock className="size-3.5" />
                    {a.reading_minutes}
                  </span>
                ) : null}
              </div>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={a.status} />
            </td>
            <td className="px-4 py-3 text-adm-muted">{date(a.published_at)}</td>
            <td className="px-4 py-3">{actions(a)}</td>
          </tr>
        )}
        renderCard={(a) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-adm-text">{a.title}</p>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-adm-muted">
              {topicChips(a)}
              <span>{date(a.published_at)}</span>
            </div>
            {actions(a)}
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t("editTitle") : t("addTitle")}
        size="lg"
        footer={
          <>
            <button type="button" className={buttonSecondary} onClick={() => setModalOpen(false)}>
              {tCommon("cancel")}
            </button>
            <button type="submit" form="article-form" className={buttonPrimary} disabled={saving}>
              {saving ? tCommon("saving") : t("saveArticle")}
            </button>
          </>
        }
      >
        <form id="article-form" onSubmit={handleSave} className="space-y-5">
          <FormField label={t("fieldTitle")} required>
            {(id) => <input id={id} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />}
          </FormField>

          <FormField label={t("bodyLabel")}>
            {(id) => (
              <ArticleEditor
                id={id}
                source={source}
                format={format}
                onChange={(next) => {
                  setSource(next.source);
                  setFormat(next.format);
                }}
              />
            )}
          </FormField>
          <p className="-mt-3 text-xs text-adm-muted">{t("readingAuto", { minutes: autoMinutes })}</p>

          <FormField label={t("summaryLabel")}>
            {(id) => <textarea id={id} rows={3} className={textareaClass} value={summary} onChange={(e) => setSummary(e.target.value)} />}
          </FormField>

          <FormField label={tCommon("topics")}>{(id) => <TagInput id={id} value={topics} onChange={setTopics} suggestions={topicSuggestions} />}</FormField>

          <FormField label={t("coverLabel")}>
            {(id) => (
              <div className="space-y-2">
                <UploadField id={id} value={coverUrl} onChange={setCoverUrl} accept="image/*" placeholder="https://…" />
                {coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="" className="h-28 w-auto rounded-lg border border-adm-border object-cover" />
                )}
              </div>
            )}
          </FormField>

          <label className="flex min-h-11 cursor-pointer items-start gap-3">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="mt-1 size-5 accent-[#1B6A50]" />
            <span>
              <span className="block font-semibold text-adm-text">{tCommon("publishNow")}</span>
              <span className="block text-sm text-adm-muted">{tCommon("publishHint")}</span>
            </span>
          </label>

          <details className="rounded-xl border border-adm-border">
            <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold text-adm-text">{tCommon("moreOptions")}</summary>
            <div className="space-y-4 border-t border-adm-border p-4">
              <SlugField title={title} value={slug} onChange={setSlug} label={t("fieldSlug")} autoFollowTitle={!editing} fallbackPrefix="article" />
              <FormField label={tCommon("keywords")}>{(id) => <TagInput id={id} value={keywords} onChange={setKeywords} />}</FormField>
              <FormField label={t("readingOverride")}>
                {(id) => <input id={id} inputMode="numeric" className={inputClass} value={readingOverride} onChange={(e) => setReadingOverride(e.target.value.replace(/\D/g, ""))} />}
              </FormField>
            </div>
          </details>
        </form>
      </Modal>
    </div>
  );
}
