"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Layers, X, Loader2, CheckCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { saveSeriesAction, deleteSeriesAction } from "../actions";
import type { PublicSeries } from "@/lib/api/types";

export function SeriesClient({ initialSeries }: { initialSeries: PublicSeries[] }) {
  const t = useTranslations("admin.series");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [series, setSeries] = useState<PublicSeries[]>(initialSeries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSeries, setEditingSeries] = useState<PublicSeries | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [lectureCount, setLectureCount] = useState(32);
  const [coverUrl, setCoverUrl] = useState("");

  const openNewModal = () => {
    setEditingSeries(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setLectureCount(32);
    setCoverUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: PublicSeries) => {
    setEditingSeries(s);
    setTitle(s.title);
    setSlug(s.slug);
    setDescription(s.description || "");
    setLectureCount(s.lecture_count || 0);
    setCoverUrl(s.cover?.url || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingSeries) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 40) || `ser-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveSeriesAction({
        id: editingSeries?.id,
        title,
        slug,
        description,
        lectureCount,
        coverUrl: coverUrl || undefined,
      });

      if (editingSeries) {
        setSeries((prev) => prev.map((s) => (s.id === editingSeries.id ? res.series : s)));
      } else {
        setSeries((prev) => [res.series, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback(tCommon("successSave"));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, sTitle: string) => {
    if (!confirm(`${tCommon("confirmDelete")} (${sTitle})`)) return;
    try {
      await deleteSeriesAction(id);
      setSeries((prev) => prev.filter((s) => s.id !== id));
      setFeedback(tCommon("successDelete"));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({series.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            {t("subheading")}
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newSeries")}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-[#E0D8CE] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-[#1B5E20] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF8F5] text-[#B8860B] border border-[#E0D8CE] font-bold text-[11px]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{s.lecture_count} {t("colLectures")}</span>
                </span>
                <Link
                  href={`/${locale}/series/${s.slug}`}
                  target="_blank"
                  className="text-[#636E72] hover:text-[#1B5E20] p-1"
                  title={tCommon("viewLive")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <h3 className="font-heading font-bold text-base text-[#2D3436] mb-1">
                {s.title}
              </h3>
              <div className="text-[11px] text-[#636E72] font-mono mb-3">
                /series/{s.slug}
              </div>
              {s.description && (
                <p className="text-xs text-[#636E72] line-clamp-3 leading-relaxed mb-4">
                  {s.description}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#FAF8F5] flex items-center justify-between">
              <span className="text-[11px] text-[#636E72]">ID: {s.id}</span>
              <div className="space-x-2">
                <button
                  onClick={() => openEditModal(s)}
                  className="px-3 py-1.5 rounded bg-emerald-50 text-[#1B5E20] hover:bg-emerald-100 font-semibold text-xs"
                >
                  {tCommon("edit")}
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.title)}
                  className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs"
                >
                  {tCommon("delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg z-10 border border-[#E0D8CE] overflow-hidden">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                {editingSeries ? t("editSeries") : t("newSeries")}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#636E72]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldTitle")} *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldSlug")} *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("colLectures")}</label>
                  <input
                    type="number"
                    value={lectureCount}
                    onChange={(e) => setLectureCount(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDescription")}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldCoverUrl")}</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="/images/photo_11_...jpg"
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="pt-4 border-t border-[#E0D8CE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D8CE] rounded text-[#636E72]"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-bold"
                >
                  {isSaving ? tCommon("saving") : t("saveSeries")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
