"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, X, Loader2, CheckCircle, Check, Ban } from "lucide-react";
import { UploadField } from "@/components/admin/ui/upload-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import { LessonsEditor, type LessonDraft } from "./lessons-editor";
import { ExamEditorModal } from "./exam-editor-modal";
import { saveCourseAction, deleteCourseAction } from "../actions";
import type { PublicCourse } from "@/lib/api/types";

export function CoursesClient({ initialCourses }: { initialCourses: PublicCourse[] }) {
  const { toast, confirm, prompt } = useAdminFeedback();
  const t = useTranslations("admin.courses");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [courses, setCourses] = useState<PublicCourse[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [published, setPublished] = useState(true);
  const [editingCourse, setEditingCourse] = useState<PublicCourse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [enrolmentOpen, setEnrolmentOpen] = useState(true);
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [examCourse, setExamCourse] = useState<PublicCourse | null>(null);
  const [categories, setCategories] = useState("aqeedah");
  const [coverUrl, setCoverUrl] = useState("");

  const openNewModal = () => {
    setPublished(true);
    setEditingCourse(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setDescription("");
    setEnrolmentOpen(true);
    setLessons([]);
    setCategories("aqeedah");
    setCoverUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: PublicCourse) => {
    setPublished(c.status !== "draft");
    setEditingCourse(c);
    setTitle(c.title);
    setSlug(c.slug);
    setSummary(c.summary || "");
    setDescription(c.description || "");
    setEnrolmentOpen(c.enrolment_open);
    setLessons((c.lessons ?? []).map((l) => ({ id: l.id, title: l.title, summary: l.summary ?? "", durationMinutes: l.duration_seconds ? Math.round(l.duration_seconds / 60) : 0 })));
    setCategories(c.categories?.join(", ") || "aqeedah");
    setCoverUrl(c.cover?.url || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCourse) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 45) || `crs-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveCourseAction({
        status: published ? "published" : "draft",
        id: editingCourse?.id,
        title,
        slug,
        summary,
        description,
        enrolmentOpen,
        lessons,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        coverUrl: coverUrl || undefined,
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (editingCourse) {
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? res.course : c)));
      } else {
        setCourses((prev) => [res.course, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback(tCommon("successSave"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, cTitle: string) => {
    if (!(await confirm(`${tCommon("confirmDelete")} (${cTitle})`))) return;
    try {
      await deleteCourseAction(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setFeedback(tCommon("successDelete"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({courses.length})
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
          <span>{t("newCourse")}</span>
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
        {courses.map((crs) => (
          <div
            key={crs.id}
            className="bg-white border border-[#E0D8CE] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-[#1B5E20] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    crs.enrolment_open
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {crs.enrolment_open ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                  <span>{crs.enrolment_open ? tCommon("active") : tCommon("completed")}</span>
                </span>
                <Link
                  href={`/${locale}/courses/${crs.slug}`}
                  target="_blank"
                  className="text-[#636E72] hover:text-[#1B5E20] p-1"
                  title={tCommon("viewLive")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <h3 className="font-heading font-bold text-base text-[#2D3436] mb-1">
                {crs.title}
              </h3>
              <div className="text-[11px] text-[#636E72] font-mono mb-2">
                /courses/{crs.slug}
              </div>
              <p className="text-xs text-[#636E72] line-clamp-3 leading-relaxed mb-4">
                {crs.summary || crs.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#FAF8F5] flex items-center justify-between text-xs text-[#636E72]">
              <span>{crs.lesson_count} {t("fieldLessonsCount")}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setExamCourse(crs)}
                  className="px-3 py-1.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-xs"
                >
                  Exam
                </button>
                <button
                  onClick={() => openEditModal(crs)}
                  className="px-3 py-1.5 rounded bg-emerald-50 text-[#1B5E20] hover:bg-emerald-100 font-semibold text-xs"
                >
                  {tCommon("edit")}
                </button>
                <button
                  onClick={() => handleDelete(crs.id, crs.title)}
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
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10 border border-[#E0D8CE]">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                {editingCourse ? t("editCourse") : t("newCourse")}
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
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldLessonsCount")}</label>
                  <p className="px-3 py-2 text-[#636E72]">{lessons.length}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDescription")}</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldDescription")}</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enrolment"
                  checked={enrolmentOpen}
                  onChange={(e) => setEnrolmentOpen(e.target.checked)}
                  className="w-4 h-4 text-[#1B5E20] rounded border-gray-300"
                />
                <label htmlFor="enrolment" className="font-semibold text-[#2D3436] cursor-pointer">
                  {tCommon("active")} ({tCommon("enrollments")})
                </label>
              </div>

              <LessonsEditor lessons={lessons} onChange={setLessons} />

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Cover image</label>
                <UploadField value={coverUrl} onChange={setCoverUrl} accept="image/*" placeholder="/uploads/cover.jpg or https://..." />
              </div>

              <label className="flex items-center gap-2 font-semibold text-[#2D3436] cursor-pointer">

                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-[#1B5E20]" />

                Published <span className="font-normal text-[#636E72]">(untick to keep as a draft, hidden from the public site)</span>

              </label>


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
                  {isSaving ? tCommon("saving") : t("saveCourse")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {examCourse && <ExamEditorModal courseSlug={examCourse.slug} courseTitle={examCourse.title} onClose={() => setExamCourse(null)} />}
    </div>
  );
}
