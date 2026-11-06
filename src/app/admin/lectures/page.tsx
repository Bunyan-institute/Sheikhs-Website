"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AudioLines, ExternalLink, Pencil, Plus, Trash2, Video } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { useStandalone } from "@/components/admin/pwa/use-standalone";
import { Modal } from "@/components/admin/ui/modal";
import { DataList } from "@/components/admin/ui/data-list";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { FormField, buttonPrimary, buttonSecondary, inputClass, selectClass, textareaClass } from "@/components/admin/ui/form-field";
import { SlugField } from "@/components/admin/ui/slug-field";
import { TagInput } from "@/components/admin/ui/tag-input";
import { SourceField, formatDuration, parseDuration, useProviderLabel } from "@/components/admin/ui/source-field";
import { UploadField } from "@/components/admin/ui/upload-field";
import { parseMediaUrl } from "@/lib/media-source";
import { saveLectureAction, deleteLectureAction } from "../actions";
import type { PublicLecture } from "@/lib/api/types";

type Format = "all" | "video" | "audio";

const primarySource = (l: PublicLecture) => l.media?.video || l.media?.audio || "";

export default function AdminLecturesPage() {
  const { toast, confirm } = useAdminFeedback();
  const t = useTranslations("admin.lectures");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();
  const standalone = useStandalone();
  const providerLabel = useProviderLabel();

  const [lectures, setLectures] = useState<PublicLecture[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [format, setFormat] = useState<Format>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<PublicLecture | null>(null);

  // Form state
  const [sourceUrl, setSourceUrl] = useState("");
  const [extraAudio, setExtraAudio] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [durationText, setDurationText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [published, setPublished] = useState(true);
  const durationTouched = useRef(false);

  const fetchLectures = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/lectures");
      if (res.ok) {
        const data = await res.json();
        setLectures(data.lectures || []);
        setSeriesOptions(data.series || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const topicSuggestions = useMemo(() => [...new Set(lectures.flatMap((l) => l.categories ?? []))].sort(), [lectures]);

  const openNew = () => {
    setEditing(null);
    setSourceUrl("");
    setExtraAudio("");
    setTitle("");
    setSlug("");
    setSummary("");
    setSeriesId("");
    setTopics([]);
    setKeywords([]);
    setCoverUrl("");
    setDurationText("");
    setTranscript("");
    setPublished(true);
    durationTouched.current = false;
    setModalOpen(true);
  };

  useOpenNewFromQuery(openNew);

  const openEdit = (lec: PublicLecture) => {
    setEditing(lec);
    setSourceUrl(primarySource(lec));
    setExtraAudio(lec.media?.video && lec.media?.audio ? lec.media.audio : "");
    setTitle(lec.title);
    setSlug(lec.slug);
    setSummary(lec.summary || "");
    setSeriesId(lec.series?.id || "");
    setTopics(lec.categories ?? []);
    setKeywords(lec.tags ?? []);
    setCoverUrl(lec.cover?.url || "");
    setDurationText(lec.duration_seconds ? formatDuration(lec.duration_seconds) : "");
    setTranscript(lec.media?.transcript || "");
    setPublished(lec.status !== "draft");
    durationTouched.current = true; // keep the stored length unless the user changes it
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseMediaUrl(sourceUrl);
    if (!parsed.valid) {
      toast.error(t("sourceRequired"));
      return;
    }
    setSaving(true);
    try {
      const isAudio = parsed.kind === "audio";
      const res = await saveLectureAction({
        status: published ? "published" : "draft",
        id: editing?.id,
        title: title.trim(),
        slug,
        summary,
        videoUrl: isAudio ? undefined : parsed.url,
        audioUrl: isAudio ? parsed.url : extraAudio.trim() || undefined,
        durationSeconds: parseDuration(durationText) ?? undefined,
        seriesId: seriesId || undefined,
        categories: topics,
        tags: keywords,
        transcript: transcript || undefined,
        coverUrl: coverUrl.trim(),
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setModalOpen(false);
      toast.success(tCommon("successSave"));
      fetchLectures();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lec: PublicLecture) => {
    if (!(await confirm({ message: `${tCommon("confirmDelete")} (${lec.title})` }))) return;
    try {
      await deleteLectureAction(lec.id);
      setLectures((prev) => prev.filter((l) => l.id !== lec.id));
      toast.success(tCommon("successDelete"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    }
  };

  const visible = lectures.filter((l) => {
    if (format === "video") return Boolean(l.media?.video);
    if (format === "audio") return Boolean(l.media?.audio && !l.media?.video);
    return true;
  });

  const sourceChip = (l: PublicLecture) => {
    const main = parseMediaUrl(primarySource(l));
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-adm-soft px-2.5 py-1 text-xs font-semibold text-adm-primary">
        {l.media?.video ? <Video className="size-3.5" /> : <AudioLines className="size-3.5" />}
        {providerLabel(main) || "—"}
        {l.media?.video && l.media?.audio && <AudioLines className="size-3.5 opacity-70" />}
      </span>
    );
  };

  const actions = (l: PublicLecture) => (
    <div className="flex items-center justify-end gap-1.5">
      {!standalone && (
        <Link href={`/${locale}/lectures/${l.slug}`} target="_blank" aria-label={tCommon("viewLive")} title={tCommon("viewLive")} className="grid size-11 place-items-center rounded-lg text-adm-muted hover:bg-adm-soft">
          <ExternalLink className="size-4" />
        </Link>
      )}
      <button type="button" onClick={() => openEdit(l)} aria-label={`${tCommon("edit")} ${l.title}`} className={`${buttonSecondary} !px-3`}>
        <Pencil className="size-4" />
        <span>{tCommon("edit")}</span>
      </button>
      <button type="button" onClick={() => handleDelete(l)} aria-label={`${tCommon("delete")} ${l.title}`} className={`${buttonSecondary} !px-3 text-adm-danger`}>
        <Trash2 className="size-4" />
        <span>{tCommon("delete")}</span>
      </button>
    </div>
  );

  const pills: { key: Format; label: string; count: number }[] = [
    { key: "all", label: tCommon("all"), count: lectures.length },
    { key: "video", label: t("filterVideo"), count: lectures.filter((l) => l.media?.video).length },
    { key: "audio", label: t("filterAudio"), count: lectures.filter((l) => l.media?.audio && !l.media?.video).length },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-adm-text">
            {t("heading")} <span className="text-adm-muted">({lectures.length})</span>
          </h1>
          <p className="mt-0.5 text-sm text-adm-muted">{t("subheading")}</p>
        </div>
        <button type="button" onClick={openNew} className={buttonPrimary}>
          <Plus className="size-5" />
          {t("newLecture")}
        </button>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-adm-muted">{tCommon("loading")}</p>
      ) : (
        <DataList
          items={visible}
          getKey={(l) => l.id}
          searchText={(l) => `${l.title} ${l.slug} ${l.summary ?? ""}`}
          emptyTitle={t("emptyTitle")}
          emptyHint={t("emptyHint")}
          emptyAction={
            <button type="button" onClick={openNew} className={buttonPrimary}>
              <Plus className="size-5" />
              {t("newLecture")}
            </button>
          }
          toolbar={
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
              {pills.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={format === p.key}
                  onClick={() => setFormat(p.key)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${format === p.key ? "bg-adm-primary text-white" : "border border-adm-border bg-white text-adm-text"}`}
                >
                  {p.label} ({p.count})
                </button>
              ))}
            </div>
          }
          header={
            <tr>
              <th className="px-4 py-3">{t("colTitle")}</th>
              <th className="px-4 py-3">{tCommon("status")}</th>
              <th className="px-4 py-3">{t("colDuration")}</th>
              <th className="px-4 py-3 text-end">{t("colActions")}</th>
            </tr>
          }
          renderRow={(l) => (
            <tr key={l.id} className="align-middle">
              <td className="max-w-md px-4 py-3">
                <p className="truncate font-semibold text-adm-text">{l.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {sourceChip(l)}
                  {l.series && <span className="truncate text-xs text-adm-muted">{l.series.title}</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={l.status} />
              </td>
              <td className="px-4 py-3 text-adm-muted">{l.duration_seconds ? formatDuration(l.duration_seconds) : "—"}</td>
              <td className="px-4 py-3">{actions(l)}</td>
            </tr>
          )}
          renderCard={(l) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-adm-text">{l.title}</p>
                <StatusBadge status={l.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-adm-muted">
                {sourceChip(l)}
                {l.duration_seconds ? <span>{formatDuration(l.duration_seconds)}</span> : null}
                {l.series && <span className="truncate">{l.series.title}</span>}
              </div>
              {actions(l)}
            </div>
          )}
        />
      )}

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
            <button type="submit" form="lecture-form" className={buttonPrimary} disabled={saving}>
              {saving ? tCommon("saving") : t("saveLecture")}
            </button>
          </>
        }
      >
        <form id="lecture-form" onSubmit={handleSave} className="space-y-7">
          <section className="space-y-3">
            <h3 className="text-base font-bold text-adm-primary">{t("stepSource")}</h3>
            <p className="text-sm text-adm-muted">{t("sourceHelp")}</p>
            <SourceField
              value={sourceUrl}
              onChange={setSourceUrl}
              onTitle={setTitle}
              onThumbnail={setCoverUrl}
              onDuration={(sec) => {
                if (!durationTouched.current) setDurationText(formatDuration(sec));
              }}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-base font-bold text-adm-primary">{t("stepDetails")}</h3>
            <FormField label={t("fieldTitle")} required>
              {(id) => <input id={id} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />}
            </FormField>
            <FormField label={t("shortDescription")}>
              {(id) => <textarea id={id} rows={3} className={textareaClass} value={summary} onChange={(e) => setSummary(e.target.value)} />}
            </FormField>
            <FormField label={t("fieldSeries")}>
              {(id) => (
                <select id={id} className={selectClass} value={seriesId} onChange={(e) => setSeriesId(e.target.value)}>
                  <option value="">{t("standalone")}</option>
                  {seriesOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              )}
            </FormField>
            <FormField label={t("topicsLabel")}>{(id) => <TagInput id={id} value={topics} onChange={setTopics} suggestions={topicSuggestions} />}</FormField>
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
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-adm-primary">{t("stepPublish")}</h3>
            <label className="flex min-h-11 cursor-pointer items-start gap-3">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="mt-1 size-5 accent-[#1B6A50]" />
              <span>
                <span className="block font-semibold text-adm-text">{t("publishNow")}</span>
                <span className="block text-sm text-adm-muted">{t("publishHint")}</span>
              </span>
            </label>
          </section>

          <details className="rounded-xl border border-adm-border">
            <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold text-adm-text">{t("moreOptions")}</summary>
            <div className="space-y-4 border-t border-adm-border p-4">
              <SlugField title={title} value={slug} onChange={setSlug} label={t("fieldSlug")} autoFollowTitle={!editing} fallbackPrefix="lesson" />
              <FormField label={t("lengthLabel")} hint={t("lengthHint")}>
                {(id) => (
                  <input
                    id={id}
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="38:12"
                    className={inputClass}
                    value={durationText}
                    onChange={(e) => {
                      durationTouched.current = true;
                      setDurationText(e.target.value);
                    }}
                  />
                )}
              </FormField>
              <FormField label={t("extraAudio")}>
                {(id) => <SourceField id={id} value={extraAudio} onChange={setExtraAudio} accept="audio/*" />}
              </FormField>
              <FormField label={t("keywordsLabel")}>{(id) => <TagInput id={id} value={keywords} onChange={setKeywords} />}</FormField>
              <FormField label={t("transcriptLabel")}>
                {(id) => <textarea id={id} rows={5} className={textareaClass} value={transcript} onChange={(e) => setTranscript(e.target.value)} />}
              </FormField>
            </div>
          </details>
        </form>
      </Modal>
    </div>
  );
}
