"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, X, Loader2, CheckCircle, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { saveFatwaAction, deleteFatwaAction } from "../actions";
import type { PublicFatwa } from "@/lib/api/types";

export function FatwasClient({ initialFatwas }: { initialFatwas: PublicFatwa[] }) {
  const t = useTranslations("admin.fatwas");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [fatwas, setFatwas] = useState<PublicFatwa[]>(initialFatwas);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFatwa, setEditingFatwa] = useState<PublicFatwa | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categories, setCategories] = useState("fiqh");
  const [tags, setTags] = useState("");

  const openNewModal = () => {
    setEditingFatwa(null);
    setTitle("");
    setSlug("");
    setQuestion("");
    setAnswer("");
    setCategories("fiqh");
    setTags("");
    setIsModalOpen(true);
  };

  const openEditModal = (f: PublicFatwa) => {
    setEditingFatwa(f);
    setTitle(f.title);
    setSlug(f.slug);
    setQuestion(f.question || "");
    setAnswer(f.answer || "");
    setCategories(f.categories?.join(", ") || "fiqh");
    setTags(f.tags?.join(", ") || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingFatwa) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 45) || `fat-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveFatwaAction({
        id: editingFatwa?.id,
        title,
        slug,
        question,
        answer,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });

      if (editingFatwa) {
        setFatwas((prev) => prev.map((f) => (f.id === editingFatwa.id ? res.fatwa : f)));
      } else {
        setFatwas((prev) => [res.fatwa, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback(tCommon("successSave"));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, fTitle: string) => {
    if (!confirm(`${tCommon("confirmDelete")} (${fTitle})`)) return;
    try {
      await deleteFatwaAction(id);
      setFatwas((prev) => prev.filter((f) => f.id !== id));
      setFeedback(tCommon("successDelete"));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const filtered = fatwas.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.question && f.question.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({fatwas.length})
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
          <span>{t("newFatwa")}</span>
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
      <div className="bg-white border border-[#E0D8CE] p-3 rounded-lg shadow-2xs">
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
                <th className="py-3 px-4 text-start">{t("colDate")}</th>
                <th className="py-3 px-4 text-end">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D8CE]/60">
              {filtered.map((fat) => (
                <tr key={fat.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-[#2D3436] line-clamp-1">{fat.title}</div>
                    <div className="text-[11px] text-[#636E72] font-mono mt-0.5">/{fat.slug}</div>
                    {fat.question && (
                      <div className="text-[11px] text-[#636E72] line-clamp-1 mt-1 italic">
                        {t("fieldQuestion")}: {fat.question}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {fat.categories?.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-semibold uppercase tracking-wider"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#636E72]">
                    {fat.published_at ? new Date(fat.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-end space-x-2">
                    <Link
                      href={`/${locale}/fatwas/${fat.slug}`}
                      target="_blank"
                      className="inline-block p-1.5 rounded hover:bg-gray-100 text-[#636E72] hover:text-[#1B5E20]"
                      title={tCommon("viewLive")}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openEditModal(fat)}
                      className="p-1.5 rounded hover:bg-emerald-50 text-[#636E72] hover:text-[#1B5E20]"
                      title={tCommon("edit")}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fat.id, fat.title)}
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
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10 border border-[#E0D8CE]">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5] rounded-t-xl">
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                {editingFatwa ? t("modalTitleEdit") : t("modalTitleNew")}
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
                  <label className="block font-bold text-[#2D3436] mb-1">{t("fieldCategories")}</label>
                  <input
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldQuestion")} *</label>
                <textarea
                  rows={3}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">{t("fieldAnswer")} *</label>
                <textarea
                  rows={8}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
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
                  className="px-6 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-bold flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? tCommon("saving") : t("saveFatwa")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
