"use client";

import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  AudioLines,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  Layers,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { UploadField } from "@/components/admin/ui/upload-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import { saveLectureAction, deleteLectureAction } from "../actions";
import type { PublicLecture } from "@/lib/api/types";

export default function AdminLecturesPage() {
  const { toast, confirm, prompt } = useAdminFeedback();
  const t = useTranslations("admin.lectures");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [lectures, setLectures] = useState<PublicLecture[]>([]);
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<"all" | "video" | "audio">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [published, setPublished] = useState(true);
  const [editingLecture, setEditingLecture] = useState<PublicLecture | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [seriesId, setSeriesId] = useState("");
  const [seriesOptions, setSeriesOptions] = useState<{ id: string; title: string }[]>([]);
  const [categories, setCategories] = useState("Lectures");
  const [tags, setTags] = useState("");
  const [transcript, setTranscript] = useState("");

  const fetchLectures = async () => {
    try {
      const res = await fetch("/api/admin/lectures");
      if (res.ok) {
        const data = await res.json();
        setLectures(data.lectures || []);
        setSeriesOptions(data.series || []);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const openNewModal = () => {
    setPublished(true);
    setEditingLecture(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setVideoUrl("");
    setAudioUrl("");
    setDurationMinutes(45);
    setSeriesId("");
    setCategories("Lectures");
    setTags("");
    setTranscript("");
    setIsModalOpen(true);
  };

  useOpenNewFromQuery(openNewModal);

  const openEditModal = (lec: PublicLecture) => {
    setPublished(lec.status !== "draft");
    setEditingLecture(lec);
    setTitle(lec.title);
    setSlug(lec.slug);
    setSummary(lec.summary || "");
    setVideoUrl(lec.media?.video || "");
    setAudioUrl(lec.media?.audio || "");
    setDurationMinutes(lec.duration_seconds ? Math.round(lec.duration_seconds / 60) : 45);
    setSeriesId(lec.series?.id || "");
    setCategories(lec.categories?.join(", ") || "Lectures");
    setTags(lec.tags?.join(", ") || "");
    setTranscript(lec.media?.transcript || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingLecture) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50);
      setSlug(autoSlug || `lec-${Date.now()}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveLectureAction({
        status: published ? "published" : "draft",
        id: editingLecture?.id,
        title,
        slug,
        summary,
        videoUrl: videoUrl || undefined,
        audioUrl: audioUrl || undefined,
        durationSeconds: durationMinutes * 60,
        seriesId: seriesId || undefined,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        transcript: transcript || undefined,
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      setIsModalOpen(false);
      setFeedback(tCommon("successSave"));
      fetchLectures();
    } catch (err: any) {
      toast.error("Error saving lecture: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, lecTitle: string) => {
    if (!(await confirm(`${tCommon("confirmDelete")} (${lecTitle})`))) return;

    try {
      await deleteLectureAction(id);
      setFeedback(tCommon("successDelete"));
      setLectures((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  const filtered = lectures.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.slug.toLowerCase().includes(search.toLowerCase()) ||
      (l.summary && l.summary.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (formatFilter === "video") return Boolean(l.media?.video);
    if (formatFilter === "audio") return Boolean(l.media?.audio && !l.media?.video);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({lectures.length})
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
          <span>{t("newLecture")}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0D8CE] p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#636E72] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-[#FAF8F5] border border-[#E0D8CE] rounded text-xs text-[#2D3436] focus:outline-none focus:border-[#1B5E20]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setFormatFilter("all")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              formatFilter === "all" ? "bg-[#1B5E20] text-white" : "bg-[#FAF8F5] text-[#636E72] hover:text-[#2D3436]"
            }`}
          >
            {tCommon("all")} ({lectures.length})
          </button>
          <button
            onClick={() => setFormatFilter("video")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              formatFilter === "video" ? "bg-red-600 text-white" : "bg-[#FAF8F5] text-[#636E72] hover:text-[#2D3436]"
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Videos ({lectures.filter((l) => Boolean(l.media?.video)).length})
          </button>
          <button
            onClick={() => setFormatFilter("audio")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              formatFilter === "audio" ? "bg-[#1B5E20] text-white" : "bg-[#FAF8F5] text-[#636E72] hover:text-[#2D3436]"
            }`}
          >
            <AudioLines className="w-3.5 h-3.5" /> Audio ({lectures.filter((l) => Boolean(l.media?.audio && !l.media?.video)).length})
          </button>
        </div>
      </div>

      {/* Lectures Table */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#636E72] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#1B5E20]" />
            <span>{tCommon("loading")}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#636E72]">
            {tCommon("noRecords")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#FAF8F5] text-[#2D3436] font-heading font-bold uppercase tracking-wider text-[10px] border-b border-[#E0D8CE]">
                <tr>
                  <th className="py-3 px-4 text-start">{t("colTitle")}</th>
                  <th className="py-3 px-4 text-start">Format</th>
                  <th className="py-3 px-4 text-start">{t("colSeries")}</th>
                  <th className="py-3 px-4 text-start">{t("colDuration")}</th>
                  <th className="py-3 px-4 text-end">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D8CE]/60">
                {filtered.map((lec) => (
                  <tr key={lec.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-[#2D3436] line-clamp-1">{lec.title}</div>
                      <div className="text-[11px] text-[#636E72] line-clamp-1 mt-0.5 font-mono">
                        /{lec.slug}
                      </div>
                      {lec.summary && (
                        <div className="text-[11px] text-[#636E72] line-clamp-1 mt-1">
                          {lec.summary}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lec.media?.video ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <Video className="w-3 h-3" /> YouTube Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <AudioLines className="w-3 h-3" /> Audio MP3
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#636E72]">
                      {lec.series ? (
                        <span className="inline-flex items-center gap-1 text-[#B8860B] font-medium">
                          <Layers className="w-3 h-3" />
                          <span>Lesson {lec.series.position || "•"}</span>
                        </span>
                      ) : (
                        <span className="text-[#636E72]/60">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#636E72]">
                      {lec.duration_seconds ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{Math.round(lec.duration_seconds / 60)} min</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-end space-x-2">
                      <Link
                        href={`/${locale}/lectures/${lec.slug}`}
                        target="_blank"
                        title={tCommon("viewLive")}
                        className="inline-block p-1.5 rounded hover:bg-gray-100 text-[#636E72] hover:text-[#1B5E20] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(lec)}
                        title={tCommon("edit")}
                        className="p-1.5 rounded hover:bg-emerald-50 text-[#636E72] hover:text-[#1B5E20] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lec.id, lec.title)}
                        title={tCommon("delete")}
                        className="p-1.5 rounded hover:bg-red-50 text-[#636E72] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10 border border-[#E0D8CE]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5] rounded-t-xl">
              <div>
                <h3 className="font-heading font-bold text-base text-[#2D3436]">
                  {editingLecture ? tCommon("edit") : t("newLecture")}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded text-[#636E72] hover:text-black hover:bg-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldTitle")} *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldSlug")} *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDuration")}</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDescription")}</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[#FAF8F5] rounded-md border border-[#E0D8CE]">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>{t("fieldYoutubeUrl")}</span>
                  </label>
                  <UploadField value={videoUrl} onChange={setVideoUrl} accept="video/mp4,video/webm" placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1 flex items-center gap-1.5">
                    <AudioLines className="w-3.5 h-3.5 text-[#1B5E20]" />
                    <span>{t("fieldAudioUrl")}</span>
                  </label>
                  <UploadField value={audioUrl} onChange={setAudioUrl} accept="audio/*" placeholder="https://.../lessons/lesson-01.mp3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldSeries")}</label>
                  <select
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs bg-white focus:outline-none focus:border-[#1B5E20]"
                  >
                    <option value="">Standalone</option>
                    {seriesOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{tCommon("category")}</label>
                  <input
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs bg-white focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Transcript</label>
                <textarea
                  rows={4}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded text-xs font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <label className="flex items-center gap-2 font-semibold text-[#2D3436] cursor-pointer">

                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-[#1B5E20]" />

                Published <span className="font-normal text-[#636E72]">(untick to keep as a draft, hidden from the public site)</span>

              </label>


              <div className="pt-4 border-t border-[#E0D8CE] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D8CE] text-[#636E72] hover:bg-[#FAF8F5] rounded font-semibold text-xs transition-colors"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-bold text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? tCommon("saving") : t("saveLecture")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
