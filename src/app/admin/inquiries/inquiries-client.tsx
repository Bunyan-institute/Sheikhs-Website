"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Clock,
  User,
  Mail,
  CheckCircle,
  Archive,
  RefreshCw,
  Trash2,
  BookOpen,
  X,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  updateInquiryStatusAction,
  deleteInquiryAction,
  convertInquiryToFatwaAction,
} from "../actions";
import type { InquiryRecord } from "@/lib/db/types";

export function InquiriesClient({ initialInquiries }: { initialInquiries: InquiryRecord[] }) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "answered" | "archived">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Convert to Fatwa modal state
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [fatwaTitle, setFatwaTitle] = useState("");
  const [fatwaSlug, setFatwaSlug] = useState("");
  const [fatwaAnswer, setFatwaAnswer] = useState("");
  const [fatwaCategory, setFatwaCategory] = useState("fiqh");
  const [isConverting, setIsConverting] = useState(false);

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      inq.question.toLowerCase().includes(q) ||
      (inq.name && inq.name.toLowerCase().includes(q)) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.notes && inq.notes.toLowerCase().includes(q))
    );
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "answered" | "archived"
  ) => {
    try {
      const res = await updateInquiryStatusAction(id, newStatus);
      if (res.inquiry) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        setFeedback(`Inquiry marked as ${newStatus}.`);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this community inquiry?")) return;
    try {
      await deleteInquiryAction(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setFeedback("Inquiry deleted.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const openConvertModal = (inq: InquiryRecord) => {
    setSelectedInquiry(inq);
    setFatwaTitle(inq.question);
    setFatwaSlug(
      inq.question
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 45) || `fatwa-${Date.now()}`
    );
    setFatwaAnswer(
      "In the Name of Allah, the Most Gracious, the Most Merciful.\n\nAll praise is due to Allah, and peace and blessings be upon His Messenger...\n\n"
    );
    setFatwaCategory("fiqh");
    setIsConvertModalOpen(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !fatwaTitle || !fatwaSlug || !fatwaAnswer) return;

    setIsConverting(true);
    setFeedback(null);

    try {
      const res = await convertInquiryToFatwaAction({
        inquiryId: selectedInquiry.id,
        title: fatwaTitle,
        slug: fatwaSlug,
        answer: fatwaAnswer,
        category: fatwaCategory,
      });

      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id
              ? {
                  ...i,
                  status: "answered",
                  notes: `Converted to public Fatwa: ${res.fatwa.slug}`,
                }
              : i
          )
        );
        setIsConvertModalOpen(false);
        setFeedback(`Successfully created public Fatwa: "${res.fatwa.title}"`);
      }
    } catch (err: any) {
      alert("Error converting to fatwa: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const answeredCount = inquiries.filter((i) => i.status === "answered").length;
  const archivedCount = inquiries.filter((i) => i.status === "archived").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            Community Inquiries & Questions ({inquiries.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            Public queries submitted by students and seekers from the /ask page. Review, respond, and publish scholarly fatwas.
          </p>
        </div>

        <Link
          href="/ask"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] border border-[#E0D8CE] bg-white text-[#2D3436] hover:border-[#1B5E20] text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <span>View Public Ask Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#1B5E20]" />
        </Link>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-[#E0D8CE] rounded-lg p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "pending", label: "Pending", count: pendingCount, color: "text-amber-700 bg-amber-50" },
              { id: "answered", label: "Answered", count: answeredCount, color: "text-emerald-700 bg-emerald-50" },
              { id: "archived", label: "Archived", count: archivedCount, color: "text-zinc-600 bg-zinc-50" },
              { id: "all", label: "All Questions", count: inquiries.length, color: "text-[#2D3436] bg-transparent" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#1B5E20] text-white"
                  : "bg-white text-[#636E72] hover:text-[#2D3436] border border-[#E0D8CE]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search question text, sender name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs px-3 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] md:w-72"
        />
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inq) => {
          const date = new Date(inq.created_at);

          return (
            <div
              key={inq.id}
              className="bg-white border border-[#E0D8CE] rounded-lg p-5 shadow-2xs hover:border-[#1B5E20] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : inq.status === "answered"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {inq.status}
                    </span>

                    <span className="text-[11px] font-mono text-[#636E72]">
                      #{inq.id}
                    </span>

                    <span className="text-[11px] text-[#636E72] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {date.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <span className="text-[10px] uppercase font-bold text-[#1B5E20] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Locale: {inq.locale}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="bg-[#FBF9F5] border border-[#F0EAE1] p-4 rounded-md">
                    <p className="text-sm font-medium text-[#2D3436] leading-relaxed whitespace-pre-wrap">
                      &ldquo;{inq.question}&rdquo;
                    </p>
                  </div>

                  {/* Submitter Info & Notes */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#636E72]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>
                        {inq.is_anonymous ? (
                          <span className="italic text-zinc-500">Anonymous Seeker</span>
                        ) : (
                          <span className="font-semibold text-[#2D3436]">{inq.name || "Anonymous"}</span>
                        )}
                      </span>
                    </div>

                    {inq.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#636E72]" />
                        <a
                          href={`mailto:${inq.email}?subject=Response from Sheikh Muhammed Ferej Office`}
                          className="hover:underline text-emerald-800"
                        >
                          {inq.email}
                        </a>
                      </div>
                    )}

                    {inq.notes && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>{inq.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EAE1]">
                  <button
                    onClick={() => openConvertModal(inq)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold transition-colors cursor-pointer w-full md:w-auto justify-center"
                    title="Publish as public Fatwa"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Convert to Fatwa</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {inq.status !== "answered" && (
                      <button
                        onClick={() => handleStatusChange(inq.id, "answered")}
                        className="p-1.5 text-[#636E72] hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        title="Mark as Answered"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {inq.status !== "pending" && (
                      <button
                        onClick={() => handleStatusChange(inq.id, "pending")}
                        className="p-1.5 text-[#636E72] hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                        title="Mark as Pending"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}

                    {inq.status !== "archived" && (
                      <button
                        onClick={() => handleStatusChange(inq.id, "archived")}
                        className="p-1.5 text-[#636E72] hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
                        title="Archive Inquiry"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="p-1.5 text-[#636E72] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredInquiries.length === 0 && (
          <div className="py-12 text-center text-[#636E72] bg-white border border-[#E0D8CE] rounded-lg">
            No inquiries found matching this filter.
          </div>
        )}
      </div>

      {/* Convert to Public Fatwa Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#2D3436]">
                  Convert Inquiry to Public Fatwa
                </h2>
                <p className="text-xs text-[#636E72]">
                  This will publish an authoritative Islamic ruling accessible to all Muslims worldwide on the portal.
                </p>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Fatwa Title / Question Summary *
                </label>
                <input
                  type="text"
                  required
                  value={fatwaTitle}
                  onChange={(e) => setFatwaTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={fatwaSlug}
                    onChange={(e) => setFatwaSlug(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Jurisprudence Category
                  </label>
                  <select
                    value={fatwaCategory}
                    onChange={(e) => setFatwaCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] bg-white"
                  >
                    <option value="fiqh">Fiqh (Jurisprudence)</option>
                    <option value="aqeedah">Aqeedah (Creed)</option>
                    <option value="ibadah">Ibadah (Worship)</option>
                    <option value="muamalat">Muamalat (Transactions)</option>
                    <option value="family">Family & Marriage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Sheikh&apos;s Authoritative Ruling & Answer *
                </label>
                <textarea
                  rows={8}
                  required
                  value={fatwaAnswer}
                  onChange={(e) => setFatwaAnswer(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E0D8CE]">
                <button
                  type="button"
                  onClick={() => setIsConvertModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#636E72] hover:bg-[#F5F1EB] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isConverting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Fatwa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
