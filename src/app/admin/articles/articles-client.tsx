"use client";

import { useOpenNewFromQuery } from "@/components/admin/ui/use-open-new";
import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, X, Loader2, CheckCircle, Search, Clock } from "lucide-react";
import { UploadField } from "@/components/admin/ui/upload-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import { saveArticleAction, deleteArticleAction } from "../actions";
import type { PublicArticle } from "@/lib/api/types";

export function ArticlesClient({ initialArticles }: { initialArticles: PublicArticle[] }) {
  const { toast, confirm, prompt } = useAdminFeedback();
  const t = useTranslations("admin.articles");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [articles, setArticles] = useState<PublicArticle[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [published, setPublished] = useState(true);
  const [editingArticle, setEditingArticle] = useState<PublicArticle | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [readingMinutes, setReadingMinutes] = useState(5);
  const [categories, setCategories] = useState("hadith, ethics");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const openNewModal = () => {
    setPublished(true);
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setBody("");
    setReadingMinutes(5);
    setCategories("hadith, ethics");
    setTags("");
    setCoverUrl("");
    setIsModalOpen(true);
  };

  useOpenNewFromQuery(openNewModal);

  const openEditModal = (a: PublicArticle) => {
    setPublished(a.status !== "draft");
    setEditingArticle(a);
    setTitle(a.title);
    setSlug(a.slug);
    setSummary(a.summary || "");
    setBody(a.body || "");
    setReadingMinutes(a.reading_minutes || 5);
    setCategories(a.categories?.join(", ") || "hadith");
    setTags(a.tags?.join(", ") || "");
    setCoverUrl(a.cover?.url || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 50) || `art-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveArticleAction({
        status: published ? "published" : "draft",
        id: editingArticle?.id,
        title,
        slug,
        summary,
        body,
        readingMinutes,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        coverUrl: coverUrl || undefined,
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (editingArticle) {
        setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? res.article : a)));
      } else {
        setArticles((prev) => [res.article, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback(t("savedSuccess"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, aTitle: string) => {
    if (!(await confirm(`${t("deleteConfirm")} (${aTitle})`))) return;
    try {
      await deleteArticleAction(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setFeedback(t("deletedSuccess"));
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({articles.length})
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
          <span>{t("newArticle")}</span>
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

      {/* Search */}
      <div className="bg-white border border-[#E0D8CE] p-3 rounded-lg flex items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#636E72] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-[#FAF8F5] border border-[#E0D8CE] rounded text-xs text-[#2D3436] focus:outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#FAF8F5] text-[#2D3436] font-heading font-bold uppercase tracking-wider text-[10px] border-b border-[#E0D8CE]">
              <tr>
                <th className="py-3 px-4 text-start">{t("colTitle")}</th>
                <th className="py-3 px-4 text-start">{t("colCategory")}</th>
                <th className="py-3 px-4 text-start">{t("fieldReadingMinutes")}</th>
                <th className="py-3 px-4 text-start">{t("colDate")}</th>
                <th className="py-3 px-4 text-end">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D8CE]/60">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-[#2D3436] line-clamp-1">{art.title}</div>
                    <div className="text-[11px] text-[#636E72] font-mono mt-0.5">/{art.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {art.categories?.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE] font-semibold uppercase tracking-wider"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#636E72]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.reading_minutes || 5} min</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#636E72]">
                    {art.published_at ? new Date(art.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-end space-x-2">
                    <Link
                      href={`/${locale}/articles/${art.slug}`}
                      target="_blank"
                      className="inline-block p-1.5 rounded hover:bg-gray-100 text-[#636E72] hover:text-[#1B5E20]"
                      title={tCommon("viewLive")}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openEditModal(art)}
                      className="p-1.5 rounded hover:bg-emerald-50 text-[#636E72] hover:text-[#1B5E20]"
                      title={tCommon("edit")}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      className="p-1.5 rounded hover:bg-red-50 text-[#636E72] hover:text-red-600"
                      title={tCommon("delete")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10 border border-[#E0D8CE]">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5] rounded-t-xl">
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                {editingArticle ? t("modalTitleEdit") : t("modalTitleNew")}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#636E72]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldReadingMinutes")}</label>
                  <input
                    type="number"
                    value={readingMinutes}
                    onChange={(e) => setReadingMinutes(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldSummary")}</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldCategories")}</label>
                  <input
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldCoverUrl")}</label>
                  <UploadField value={coverUrl} onChange={setCoverUrl} accept="image/*" placeholder="/images/photo_2_...jpg" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">
                  {t("fieldBody")} *
                </label>
                <textarea
                  rows={10}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded font-mono text-xs bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
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
                  className="px-6 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-bold flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? tCommon("saving") : t("saveArticle")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
