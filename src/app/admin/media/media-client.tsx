"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, FileText, Film, Image as ImageIcon, Music, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { Modal } from "@/components/admin/ui/modal";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { FormField, buttonPrimary, buttonSecondary, inputClass, selectClass, textareaClass } from "@/components/admin/ui/form-field";
import { SourceField, useProviderLabel } from "@/components/admin/ui/source-field";
import { UploadField } from "@/components/admin/ui/upload-field";
import { parseMediaUrl, type MediaSourceKind } from "@/lib/media-source";
import { saveMediaAction, deleteMediaAction } from "../actions";
import type { MediaRef } from "@/lib/api/types";

type Kind = MediaRef["kind"];
type Filter = "all" | Kind;

const kindIcon = { image: ImageIcon, audio: Music, video: Film, document: FileText } as const;
const toKind = (k: MediaSourceKind): Kind | null => (k === "unknown" ? null : k);

export function MediaClient({ initialMedia }: { initialMedia: MediaRef[] }) {
  const { toast, confirm } = useAdminFeedback();
  const t = useTranslations("admin.media");
  const tCommon = useTranslations("admin.common");
  const tSource = useTranslations("admin.source");
  const providerLabel = useProviderLabel();

  const [items, setItems] = useState<MediaRef[]>(initialMedia);
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [id, setId] = useState("");
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<Kind | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [editing, setEditing] = useState(false);

  const parsed = useMemo(() => parseMediaUrl(url), [url]);
  const detectedKind = toKind(parsed.kind);
  const effectiveKind: Kind | "" = detectedKind ?? kind;

  const openNew = () => {
    setEditing(false);
    setId("");
    setUrl("");
    setKind("");
    setTitle("");
    setDescription("");
    setThumbnailUrl("");
    setModalOpen(true);
  };
  useOpenNewFromQuery(openNew);

  const openEdit = (m: MediaRef) => {
    setEditing(true);
    setId(m.id);
    setUrl(m.url);
    setKind(m.kind);
    setTitle(m.title ?? "");
    setDescription(m.description ?? "");
    setThumbnailUrl(m.thumbnail_url ?? "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.valid || !effectiveKind) {
      toast.error(t("sourceNeeded"));
      return;
    }
    setSaving(true);
    try {
      const res = await saveMediaAction({ id: id || undefined, url: parsed.url, kind: effectiveKind, title, description, thumbnailUrl });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setItems((prev) => [res.media, ...prev.filter((m) => m.id !== res.media.id)]);
      setModalOpen(false);
      toast.success(tCommon("successSave"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: MediaRef) => {
    if (!(await confirm({ message: `${tCommon("confirmDelete")} (${m.title ?? m.id})` }))) return;
    try {
      await deleteMediaAction(m.id);
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      toast.success(tCommon("successDelete"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tCommon("errorSave"));
    }
  };

  const copy = async (m: MediaRef) => {
    try {
      await navigator.clipboard.writeText(m.url);
      setCopiedId(m.id);
      toast.success(t("copied"));
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: t("tabAll") },
    { key: "image", label: t("tabImages") },
    { key: "video", label: t("tabVideos") },
    { key: "audio", label: t("tabAudios") },
    { key: "document", label: t("tabDocuments") },
  ];
  const countFor = (k: Filter) => (k === "all" ? items.length : items.filter((m) => m.kind === k).length);
  const shown = items.filter((m) => filter === "all" || m.kind === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-adm-text">
            {t("heading")} <span className="text-adm-muted">({items.length})</span>
          </h1>
          <p className="mt-0.5 text-sm text-adm-muted">{t("subheading")}</p>
        </div>
        <button type="button" onClick={openNew} className={buttonPrimary}>
          <Plus className="size-5" />
          {t("uploadMedia")}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            onClick={() => setFilter(tab.key)}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${filter === tab.key ? "bg-adm-primary text-white" : "border border-adm-border bg-white text-adm-text"}`}
          >
            {tab.label} ({countFor(tab.key)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState title={t("emptyTitle")} hint={t("emptyHint")} action={<button type="button" onClick={openNew} className={buttonPrimary}><Plus className="size-5" />{t("uploadMedia")}</button>} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((m) => {
            const Icon = kindIcon[m.kind];
            const p = parseMediaUrl(m.url);
            const thumb = m.thumbnail_url ?? (m.kind === "image" ? m.url : p.thumbnailUrl);
            return (
              <li key={m.id} className="flex flex-col overflow-hidden rounded-2xl border border-adm-border bg-white">
                <div className="relative grid aspect-video place-items-center bg-adm-soft">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <Icon className="size-10 text-adm-primary/50" />
                  )}
                  <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
                    <Icon className="size-3.5" />
                    {providerLabel(p) || m.kind}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3.5">
                  <p className="line-clamp-2 font-semibold text-adm-text">{m.title ?? m.id}</p>
                  <div className="mt-auto flex items-center gap-1">
                    <button type="button" onClick={() => copy(m)} aria-label={`${t("copyLink")}: ${m.title ?? m.id}`} title={t("copyLink")} className="grid size-11 place-items-center rounded-lg text-adm-muted hover:bg-adm-soft">
                      {copiedId === m.id ? <Check className="size-4 text-adm-primary" /> : <Copy className="size-4" />}
                    </button>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" aria-label={tCommon("viewLive")} title={tCommon("viewLive")} className="grid size-11 place-items-center rounded-lg text-adm-muted hover:bg-adm-soft">
                      <ExternalLink className="size-4" />
                    </a>
                    <span className="flex-1" />
                    <button type="button" onClick={() => openEdit(m)} aria-label={`${tCommon("edit")} ${m.title ?? m.id}`} title={tCommon("edit")} className="grid size-11 place-items-center rounded-lg text-adm-primary hover:bg-adm-soft">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(m)} aria-label={`${tCommon("delete")} ${m.title ?? m.id}`} title={tCommon("delete")} className="grid size-11 place-items-center rounded-lg text-adm-danger hover:bg-adm-danger-soft">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t("editTitle") : t("modalTitle")}
        size="md"
        footer={
          <>
            <button type="button" className={buttonSecondary} onClick={() => setModalOpen(false)}>
              {tCommon("cancel")}
            </button>
            <button type="submit" form="media-form" className={buttonPrimary} disabled={saving}>
              {saving ? tCommon("saving") : t("saveMedia")}
            </button>
          </>
        }
      >
        <form id="media-form" onSubmit={handleSave} className="space-y-5">
          <FormField label={t("fieldUrl")} required>
            {(fid) => (
              <SourceField
                id={fid}
                value={url}
                onChange={setUrl}
                onTitle={setTitle}
                onThumbnail={setThumbnailUrl}
                accept="image/*,audio/*,video/mp4,video/webm,application/pdf"
              />
            )}
          </FormField>

          {parsed.valid && !detectedKind && (
            <FormField label={t("kindLabel")} required>
              {(fid) => (
                <select id={fid} className={selectClass} value={kind} onChange={(e) => setKind(e.target.value as Kind)} required>
                  <option value="" disabled />
                  <option value="video">{t("tabVideos")}</option>
                  <option value="audio">{t("tabAudios")}</option>
                  <option value="image">{tSource("imageFile")}</option>
                  <option value="document">{tSource("documentFile")}</option>
                </select>
              )}
            </FormField>
          )}

          <FormField label={t("fieldTitle")} required>
            {(fid) => <input id={fid} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />}
          </FormField>
          <FormField label={t("fieldDescription")}>
            {(fid) => <textarea id={fid} rows={3} className={textareaClass} value={description} onChange={(e) => setDescription(e.target.value)} />}
          </FormField>
          <FormField label={t("fieldThumbnail")}>
            {(fid) => (
              <div className="space-y-2">
                <UploadField id={fid} value={thumbnailUrl} onChange={setThumbnailUrl} accept="image/*" placeholder="https://…" />
                {thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnailUrl} alt="" className="h-24 w-auto rounded-lg border border-adm-border object-cover" />
                )}
              </div>
            )}
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
