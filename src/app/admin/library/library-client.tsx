"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, BookOpen, FileText, X, Loader2, CheckCircle, Download } from "lucide-react";
import { saveBookAction, deleteBookAction } from "../actions";
import type { PublicBook } from "@/lib/api/types";

export function LibraryClient({ initialBooks }: { initialBooks: PublicBook[] }) {
  const [books, setBooks] = useState<PublicBook[]>(initialBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBook, setEditingBook] = useState<PublicBook | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Sheikh Muhammed Ferej");
  const [publisher, setPublisher] = useState("Al-Fajr Islamic Foundation");
  const [year, setYear] = useState(new Date().getFullYear());
  const [kind, setKind] = useState<"book" | "document" | "recommended_text">("document");
  const [fileUrl, setFileUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [categories, setCategories] = useState("treatise, aqeedah");

  const openNewModal = () => {
    setEditingBook(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setAuthor("Sheikh Muhammed Ferej");
    setPublisher("Al-Fajr Islamic Foundation");
    setYear(new Date().getFullYear());
    setKind("document");
    setFileUrl("");
    setExternalUrl("");
    setCoverUrl("");
    setCategories("treatise, aqeedah");
    setIsModalOpen(true);
  };

  const openEditModal = (b: PublicBook) => {
    setEditingBook(b);
    setTitle(b.title);
    setSlug(b.slug);
    setSummary(b.summary || "");
    setAuthor(b.author || "");
    setPublisher(b.publisher || "");
    setYear(b.year || new Date().getFullYear());
    setKind(b.kind || "document");
    setFileUrl(b.file?.url || "");
    setExternalUrl(b.external_url || "");
    setCoverUrl(b.cover?.url || "");
    setCategories(b.categories?.join(", ") || "treatise");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBook) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 45) || `bk-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveBookAction({
        id: editingBook?.id,
        title,
        slug,
        summary,
        author,
        publisher,
        year,
        kind,
        fileUrl: fileUrl || undefined,
        externalUrl: externalUrl || undefined,
        coverUrl: coverUrl || undefined,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
      });

      if (editingBook) {
        setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? res.book : b)));
      } else {
        setBooks((prev) => [res.book, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback("Kitab/Document saved successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, bTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${bTitle}"?`)) return;
    try {
      await deleteBookAction(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setFeedback(`Kitab "${bTitle}" removed.`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            Public Library & Treatises ({books.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            Manage classical Arabic kitabs, PDF syllabus documents, authorized translations, and CV treatises.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Kitab</span>
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
        {books.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-[#E0D8CE] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-[#1B5E20] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#1B5E20] border border-[#E0D8CE]">
                  <FileText className="w-3 h-3" />
                  <span>{b.kind}</span>
                </span>
                <div className="flex items-center gap-1">
                  {(b.file?.url || b.external_url) && (
                    <a
                      href={b.file?.url || b.external_url || "#"}
                      target="_blank"
                      className="text-[#1B5E20] hover:text-[#154a19] p-1"
                      title="Download/Open File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/library/${b.slug}`}
                    target="_blank"
                    className="text-[#636E72] hover:text-[#1B5E20] p-1"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <h3 className="font-heading font-bold text-base text-[#2D3436] mb-1">
                {b.title}
              </h3>
              <div className="text-[11px] text-[#636E72] font-mono mb-2">
                /library/{b.slug}
              </div>
              <p className="text-xs text-[#636E72] line-clamp-3 leading-relaxed mb-4">
                {b.summary || b.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#FAF8F5] flex items-center justify-between text-xs text-[#636E72]">
              <span>{b.year || "Year —"}</span>
              <div className="space-x-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="px-3 py-1.5 rounded bg-emerald-50 text-[#1B5E20] hover:bg-emerald-100 font-semibold text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs"
                >
                  Delete
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
                {editingBook ? "Edit Treatise / Kitab" : "New Treatise / Kitab"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#636E72]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Title *</label>
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
                  <label className="block font-bold text-[#2D3436] mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded font-mono bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">Type</label>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  >
                    <option value="document">PDF Document / Treatise</option>
                    <option value="book">Published Classical Book</option>
                    <option value="recommended_text">Recommended Syllabus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">PDF File URL</label>
                  <input
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/documents/kitabu-tawhid-complete.pdf"
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">External Link (optional)</label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="/images/photo_11_...jpg"
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="pt-4 border-t border-[#E0D8CE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D8CE] rounded text-[#636E72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-bold"
                >
                  {isSaving ? "Saving..." : "Save Kitab"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
