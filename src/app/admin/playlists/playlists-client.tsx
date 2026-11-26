"use client";

import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Music,
  Search,
  ListOrdered,
  FileAudio,
} from "lucide-react";
import { UploadField } from "@/components/admin/ui/upload-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import {
  savePlaylistAction,
  deletePlaylistAction,
  reorderPlaylistLecturesAction,
  removeLectureFromPlaylistAction,
} from "../actions";
import type { PublicSeries, PublicLecture } from "@/lib/api/types";
import { formatDuration } from "@/lib/utils";

export function PlaylistsClient({ initialPlaylists }: { initialPlaylists: PublicSeries[] }) {
  const { toast, confirm } = useAdminFeedback();
  const t = useTranslations("admin.playlists");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [playlists, setPlaylists] = useState<PublicSeries[]>(initialPlaylists);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Folder Edit / Create Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PublicSeries | null>(null);
  const [published, setPublished] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Ders Reordering Modal State
  const [activeManagingPlaylist, setActiveManagingPlaylist] = useState<PublicSeries | null>(null);
  const [lessonFilter, setLessonFilter] = useState("");
  const [isReordering, setIsReordering] = useState(false);

  const openNewModal = () => {
    setPublished(true);
    setEditingPlaylist(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setCoverUrl("");
    setIsFolderModalOpen(true);
  };

  useOpenNewFromQuery(openNewModal);

  const openEditModal = (p: PublicSeries) => {
    setPublished(p.status !== "draft");
    setEditingPlaylist(p);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description || "");
    setCoverUrl(p.cover?.url || "");
    setIsFolderModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPlaylist) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 40) || `playlist-${Date.now()}`
      );
    }
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await savePlaylistAction({
        status: published ? "published" : "draft",
        id: editingPlaylist?.id,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        lectureCount: editingPlaylist?.lecture_count || 0,
        coverUrl: coverUrl || undefined,
      });

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (editingPlaylist) {
        setPlaylists((prev) => prev.map((p) => (p.id === editingPlaylist.id ? res.series : p)));
      } else {
        setPlaylists((prev) => [res.series, ...prev]);
      }

      setIsFolderModalOpen(false);
      setFeedback(tCommon("successSave"));
      toast.success(tCommon("successSave"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFolder = async (id: string, folderTitle: string) => {
    if (!(await confirm(`${tCommon("confirmDelete")} (${folderTitle})`))) return;
    try {
      await deletePlaylistAction(id);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      if (activeManagingPlaylist?.id === id) setActiveManagingPlaylist(null);
      setFeedback(tCommon("successDelete"));
      toast.success(tCommon("successDelete"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  // Reorder lessons within active managing folder
  const handleMoveLesson = async (index: number, direction: "up" | "down") => {
    if (!activeManagingPlaylist || !activeManagingPlaylist.lectures) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const lessons = [...activeManagingPlaylist.lectures];
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    // Swap adjacent lessons
    const [moved] = lessons.splice(index, 1);
    lessons.splice(targetIndex, 0, moved);

    // Renumber sequential positions locally
    const renumbered = lessons.map((lec, idx) => ({
      ...lec,
      series: lec.series ? { ...lec.series, position: idx + 1 } : { id: activeManagingPlaylist.id, title: activeManagingPlaylist.title, position: idx + 1 },
    }));

    const updatedPlaylist: PublicSeries = {
      ...activeManagingPlaylist,
      lectures: renumbered,
    };

    // Optimistic UI update
    setActiveManagingPlaylist(updatedPlaylist);
    setPlaylists((prev) => prev.map((p) => (p.id === updatedPlaylist.id ? updatedPlaylist : p)));

    setIsReordering(true);
    try {
      const lectureIds = renumbered.map((l) => l.id);
      const res = await reorderPlaylistLecturesAction(activeManagingPlaylist.id, lectureIds);
      if (res.success && res.series) {
        setActiveManagingPlaylist(res.series);
        setPlaylists((prev) => prev.map((p) => (p.id === res.series.id ? res.series : p)));
        toast.success(t("reorderSuccess"));
      }
    } catch (err: any) {
      toast.error("Failed to reorder lessons: " + err.message);
    } finally {
      setIsReordering(false);
    }
  };

  const handleRemoveLessonFromFolder = async (lectureId: string, lecTitle: string) => {
    if (!(await confirm(`Remove "${lecTitle}" from this folder? It will remain in the general library as a standalone lecture.`))) return;
    if (!activeManagingPlaylist || !activeManagingPlaylist.lectures) return;

    try {
      await removeLectureFromPlaylistAction(lectureId);
      const remaining = activeManagingPlaylist.lectures.filter((l) => l.id !== lectureId);
      const renumbered = remaining.map((lec, idx) => ({
        ...lec,
        series: lec.series ? { ...lec.series, position: idx + 1 } : null,
      }));

      const updatedPlaylist: PublicSeries = {
        ...activeManagingPlaylist,
        lecture_count: renumbered.length,
        lectures: renumbered,
      };

      setActiveManagingPlaylist(updatedPlaylist);
      setPlaylists((prev) => prev.map((p) => (p.id === updatedPlaylist.id ? updatedPlaylist : p)));
      toast.success("Lecture removed from folder.");

      // Also persist the renumbered order for remaining items
      if (renumbered.length > 0) {
        await reorderPlaylistLecturesAction(activeManagingPlaylist.id, renumbered.map((l) => l.id));
      }
    } catch (err: any) {
      toast.error("Error removing lecture: " + err.message);
    }
  };

  // Filtered playlists
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists;
    const q = searchQuery.toLowerCase();
    return playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [playlists, searchQuery]);

  // Lessons inside currently opened modal
  const filteredModalLessons = useMemo(() => {
    if (!activeManagingPlaylist?.lectures) return [];
    if (!lessonFilter.trim()) return activeManagingPlaylist.lectures;
    const q = lessonFilter.toLowerCase();
    return activeManagingPlaylist.lectures.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.series?.position && l.series.position.toString().includes(q)) ||
        (l.summary && l.summary.toLowerCase().includes(q))
    );
  }, [activeManagingPlaylist, lessonFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#1B5E20]" />
            <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
              {t("heading")} ({playlists.length})
            </h1>
          </div>
          <p className="text-xs text-[#636E72] mt-1">
            {t("subheading")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/playlists`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[#E0D8CE] bg-white text-[#2D3436] hover:border-[#1B5E20] text-xs font-semibold transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#1B5E20]" />
            <span>{tCommon("viewLive")}</span>
          </Link>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t("newPlaylist")}</span>
          </button>
        </div>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#636E72]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-4 py-2 text-xs border border-[#E0D8CE] rounded-lg bg-white focus:outline-none focus:border-[#1B5E20]"
        />
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map((folder) => {
          const count = folder.lectures?.length ?? folder.lecture_count ?? 0;
          return (
            <div
              key={folder.id}
              className="bg-white border border-[#E0D8CE] rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:border-[#1B5E20] transition-all group"
            >
              <div>
                {/* Folder Top Bar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E0D8CE] flex items-center justify-center text-[#B8860B] group-hover:bg-emerald-50 group-hover:text-[#1B5E20] transition-colors">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE] font-bold text-[11px]">
                      <span>{count} {t("colLectures")}</span>
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/playlists/${folder.slug}`}
                    target="_blank"
                    className="text-[#636E72] hover:text-[#1B5E20] p-1 transition-colors"
                    title={tCommon("viewLive")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* Folder Cover Image (if available) */}
                {folder.cover?.url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 border border-[#E0D8CE]/60 bg-[#FAF8F5]">
                    <Image
                      src={folder.cover.url}
                      alt={folder.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                <h3 className="font-heading font-bold text-base text-[#2D3436] mb-1 leading-snug">
                  {folder.title}
                </h3>
                <div className="text-[11px] text-[#636E72] font-mono mb-2">
                  /playlists/{folder.slug}
                </div>
                {folder.description && (
                  <p className="text-xs text-[#636E72] line-clamp-3 leading-relaxed mb-4">
                    {folder.description}
                  </p>
                )}
              </div>

              {/* Folder Actions */}
              <div className="pt-4 border-t border-[#FAF8F5] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveManagingPlaylist(folder);
                    setLessonFilter("");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-[#1B5E20] hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{t("manageLessons")} ({count})</span>
                </button>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-[#636E72] font-mono truncate max-w-[120px]">
                    ID: {folder.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(folder)}
                      className="px-2.5 py-1 rounded border border-[#E0D8CE] bg-white text-[#2D3436] hover:bg-gray-50 font-semibold text-xs transition-colors"
                    >
                      {tCommon("edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFolder(folder.id, folder.title)}
                      className="px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-colors"
                    >
                      {tCommon("delete")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlaylists.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white border border-[#E0D8CE] rounded-xl p-8">
            <FolderKanban className="w-12 h-12 text-[#636E72]/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#2D3436]">{tCommon("noRecords")}</p>
            <p className="text-xs text-[#636E72] mt-1">{t("subheading")}</p>
          </div>
        )}
      </div>

      {/* Modal 1: Manage Derses in Folder (Sequential Numbering & Reordering) */}
      {activeManagingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveManagingPlaylist(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-10 border border-[#E0D8CE] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E0D8CE] bg-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1B5E20] uppercase tracking-wider mb-1">
                  <FolderKanban className="w-4 h-4 text-[#B8860B]" />
                  <span>{t("lessonsInFolder")}</span>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#2D3436] truncate">
                  {activeManagingPlaylist.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveManagingPlaylist(null)}
                className="w-8 h-8 rounded-full border border-[#E0D8CE] bg-white flex items-center justify-center text-[#636E72] hover:text-[#2D3436] hover:bg-gray-50 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Search inside Derses */}
            <div className="p-3 sm:p-4 border-b border-[#E0D8CE]/60 bg-white shrink-0 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="text"
                  value={lessonFilter}
                  onChange={(e) => setLessonFilter(e.target.value)}
                  placeholder="Filter lessons in this folder by title or ders #..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E0D8CE] rounded-md bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>
              <div className="text-xs text-[#636E72] font-semibold shrink-0">
                {filteredModalLessons.length} of {activeManagingPlaylist.lectures?.length ?? 0}
              </div>
            </div>

            {/* Scrollable Lesson List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2">
              {filteredModalLessons.map((lec, index) => {
                const trackNumber = lec.series?.position || index + 1;
                const formattedNum = trackNumber.toString().padStart(2, "0");
                const hasAudio = Boolean(lec.media?.audio);
                const originalIndex = activeManagingPlaylist.lectures?.findIndex((l) => l.id === lec.id) ?? -1;
                const isFirst = originalIndex <= 0;
                const isLast = originalIndex < 0 || originalIndex === (activeManagingPlaylist.lectures?.length ?? 0) - 1;

                return (
                  <div
                    key={lec.id}
                    className="p-3 rounded-lg border border-[#E0D8CE] bg-white hover:border-[#1B5E20] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Sequential Track Badge */}
                      <div className="px-2.5 py-1 rounded bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE] font-mono font-bold text-xs shrink-0">
                        {t("trackNumber")} {formattedNum}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#2D3436] truncate text-sm">
                          {lec.title}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#636E72] mt-0.5">
                          {lec.duration_seconds ? (
                            <span>{formatDuration(lec.duration_seconds)}</span>
                          ) : null}
                          {hasAudio && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <Music className="w-3 h-3" /> Audio MP3
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-gray-400 truncate max-w-[150px]">
                            {lec.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Move Up / Move Down & Remove actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveLesson(originalIndex, "up")}
                        disabled={isFirst || isReordering}
                        title={t("moveUp")}
                        className="p-1.5 rounded border border-[#E0D8CE] bg-[#FAF8F5] text-[#2D3436] hover:bg-emerald-50 hover:text-[#1B5E20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveLesson(originalIndex, "down")}
                        disabled={isLast || isReordering}
                        title={t("moveDown")}
                        className="p-1.5 rounded border border-[#E0D8CE] bg-[#FAF8F5] text-[#2D3436] hover:bg-emerald-50 hover:text-[#1B5E20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLessonFromFolder(lec.id, lec.title)}
                        title={t("removeFromFolder")}
                        className="p-1.5 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredModalLessons.length === 0 && (
                <div className="text-center py-10 text-[#636E72] text-xs">
                  No lessons found matching your filter in this folder.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E0D8CE] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#636E72] shrink-0">
              <span className="italic">
                Changes to lesson order (01, 02...) take effect immediately on public streaming pages.
              </span>
              <button
                type="button"
                onClick={() => setActiveManagingPlaylist(null)}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-semibold transition-colors"
              >
                {tCommon("ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create / Edit Folder Details */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFolderModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg z-10 border border-[#E0D8CE] overflow-hidden">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#1B5E20]" />
                <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                  {editingPlaylist ? t("editPlaylist") : t("newPlaylist")}
                </h3>
              </div>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-[#636E72] hover:text-[#2D3436]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldTitle")} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. أصول الإيمان (ኡሱሉል ኢማን)"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldSlug")} *</label>
                <input
                  type="text"
                  required
                  placeholder="usul-al-iman"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDescription")}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis of this lesson folder/playlist curriculum..."
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldCoverUrl")}</label>
                <UploadField
                  value={coverUrl}
                  onChange={setCoverUrl}
                  accept="image/*"
                  placeholder="Upload folder artwork or paste image URL"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="folder-published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-[#E0D8CE] text-[#1B5E20] focus:ring-[#1B5E20]"
                />
                <label htmlFor="folder-published" className="font-semibold text-[#2D3436] cursor-pointer">
                  {tCommon("publishNow")}
                </label>
              </div>

              <div className="pt-4 border-t border-[#E0D8CE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D8CE] rounded text-[#636E72] hover:bg-gray-50 font-semibold"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-semibold disabled:opacity-50"
                >
                  {isSaving ? tCommon("saving") : t("savePlaylist")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
