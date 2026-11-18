"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, Award, X, CheckCircle, GraduationCap, ShieldCheck } from "lucide-react";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import { updateQualificationsAction } from "../actions";
import type { QualificationRecord } from "@/lib/db/types";

const TYPE_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  academic: {
    label: "University Degree",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
  },
  ijazah: {
    label: "Traditional Ijazah & Sanad",
    badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300",
  },
  traditional: {
    label: "Traditional Ijazah & Sanad",
    badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300",
  },
  certificate: {
    label: "Certified Qualification",
    badgeClass: "bg-teal-50 text-teal-900 border-teal-300",
  },
  certification: {
    label: "Certified Qualification",
    badgeClass: "bg-teal-50 text-teal-900 border-teal-300",
  },
  other: {
    label: "Accreditation",
    badgeClass: "bg-slate-50 text-slate-800 border-slate-300",
  },
};

export function QualificationsClient({
  initialQualifications,
}: {
  initialQualifications: QualificationRecord[];
}) {
  const { toast, confirm } = useAdminFeedback();
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [qualifications, setQualifications] = useState<QualificationRecord[]>(initialQualifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingQual, setEditingQual] = useState<QualificationRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<QualificationRecord["type"]>("academic");
  const [description, setDescription] = useState("");

  const openNewModal = () => {
    setEditingQual(null);
    setTitle("");
    setIssuer("");
    setYear(new Date().getFullYear().toString());
    setType("academic");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (q: QualificationRecord) => {
    setEditingQual(q);
    setTitle(q.title);
    setIssuer(q.issuer);
    setYear(q.year);
    setType(q.type);
    setDescription(q.description);
    setIsModalOpen(true);
  };

  const persistQualifications = async (updated: QualificationRecord[], message: string) => {
    setIsSaving(true);
    try {
      const res = await updateQualificationsAction(updated);
      if (res.success) {
        setQualifications(res.qualifications);
        setFeedback(message);
        toast.success(message);
        return true;
      }
      toast.error("Failed to save qualifications");
      return false;
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !year.trim()) {
      toast.error("Title, issuer, and year are required.");
      return;
    }

    let updated: QualificationRecord[];
    if (editingQual) {
      updated = qualifications.map((q) =>
        q.id === editingQual.id
          ? { ...q, title: title.trim(), issuer: issuer.trim(), year: year.trim(), type, description: description.trim() }
          : q
      );
    } else {
      const newRecord: QualificationRecord = {
        id: `qual_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        issuer: issuer.trim(),
        year: year.trim(),
        type,
        description: description.trim(),
      };
      updated = [...qualifications, newRecord];
    }

    const ok = await persistQualifications(updated, tCommon("successSave"));
    if (ok) setIsModalOpen(false);
  };

  const handleDelete = async (id: string, qTitle: string) => {
    if (!(await confirm(`${tCommon("confirmDelete")} (${qTitle})`))) return;
    const updated = qualifications.filter((q) => q.id !== id);
    await persistQualifications(updated, tCommon("successDelete"));
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= qualifications.length) return;

    const copy = [...qualifications];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Optimistic update
    setQualifications(copy);
    await persistQualifications(copy, "Credential order updated.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#1B5E20]" />
            <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
              Qualifications &amp; Scholarly Credentials ({qualifications.length})
            </h1>
          </div>
          <p className="text-xs text-[#636E72] mt-1">
            Manage the Sheikh&apos;s academic degrees, traditional Sanad/Ijazahs, and AAOIFI Sharia certifications in real sequential order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/qualifications`}
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
            <span>Add Credential</span>
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

      {/* Credentials List */}
      <div className="space-y-3">
        {qualifications.map((q, idx) => {
          const cfg = TYPE_CONFIG[q.type] || TYPE_CONFIG.other;
          return (
            <div
              key={q.id}
              className="bg-white border border-[#E0D8CE] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-[#1B5E20] transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E0D8CE] text-[#B8860B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  #{idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${cfg.badgeClass}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#FAF8F5] text-[#2D3436] px-2 py-0.5 rounded border border-[#E0D8CE]">
                      {q.year}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#2D3436] break-words">
                    {q.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#B8860B] mt-0.5 break-words">
                    {q.issuer}
                  </p>
                  {q.description && (
                    <p className="text-xs text-[#636E72] mt-1.5 leading-relaxed line-clamp-2 break-words">
                      {q.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end border-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0 || isSaving}
                  title="Move Up"
                  className="p-1.5 rounded border border-[#E0D8CE] bg-[#FAF8F5] text-[#2D3436] hover:bg-emerald-50 hover:text-[#1B5E20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === qualifications.length - 1 || isSaving}
                  title="Move Down"
                  className="p-1.5 rounded border border-[#E0D8CE] bg-[#FAF8F5] text-[#2D3436] hover:bg-emerald-50 hover:text-[#1B5E20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(q)}
                  className="px-3 py-1.5 rounded bg-emerald-50 text-[#1B5E20] hover:bg-emerald-100 font-semibold text-xs transition-colors"
                >
                  {tCommon("edit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id, q.title)}
                  className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-colors"
                >
                  {tCommon("delete")}
                </button>
              </div>
            </div>
          );
        })}

        {qualifications.length === 0 && (
          <div className="text-center py-12 bg-white border border-[#E0D8CE] rounded-lg p-6">
            <Award className="w-12 h-12 text-[#636E72]/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#2D3436]">No qualifications listed yet.</p>
            <p className="text-xs text-[#636E72] mt-1">Click &quot;Add Credential&quot; to showcase university degrees, traditional ijazahs, and certifications.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg z-10 border border-[#E0D8CE] overflow-hidden">
            <div className="p-5 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1B5E20]" />
                <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                  {editingQual ? "Edit Credential" : "Add Scholarly Credential"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#636E72] hover:text-[#2D3436]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Degree / Credential Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master's in Islamic Studies (Distinction)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Issuing Institution / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Islamic University of Minnesota"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">Year / Date of Completion *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 or 1422H"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D3436] mb-1">Credential Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QualificationRecord["type"])}
                    className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]"
                  >
                    <option value="academic">University Degree (Academic)</option>
                    <option value="ijazah">Traditional Ijazah &amp; Sanad</option>
                    <option value="certificate">Certified Qualification</option>
                    <option value="other">Accreditation / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D3436] mb-1">Field of Study / Description</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding faculty, research specialization, honors, or transmission chain..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0D8CE] rounded bg-[#FAF8F5]/30 focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="pt-4 border-t border-[#E0D8CE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D8CE] rounded text-[#636E72] hover:bg-gray-50 font-semibold"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded font-semibold disabled:opacity-50"
                >
                  {isSaving ? tCommon("saving") : tCommon("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
