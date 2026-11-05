"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  CheckCircle,
  ExternalLink,
  Plus,
  ShieldCheck,
  Ban,
  Trash2,
  Mail,
  X,
  Loader2,
} from "lucide-react";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations, useLocale } from "next-intl";
import { revokeCertificateAction, issueCertificateAction, deleteCertificateAction } from "../actions";
import type { IssuedCertificateRecord } from "@/lib/db/types";
import type { PublicCourse } from "@/lib/api/types";

export function CertificatesClient({
  initialCertificates,
  courses,
}: {
  initialCertificates: IssuedCertificateRecord[];
  courses: PublicCourse[];
}) {
  const { toast, confirm, prompt } = useAdminFeedback();
  const t = useTranslations("admin.certificates");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [certificates, setCertificates] = useState<IssuedCertificateRecord[]>(initialCertificates);
  const [searchTerm, setSearchTerm] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Manual Issue Form State
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(courses[0]?.slug || "comprehensive-riyadus-saliheen");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [scorePercentage, setScorePercentage] = useState(100);
  const [gradeTitle, setGradeTitle] = useState("Mumtaz with Distinction (ممتاز مع مرتبة الشرف)");

  const filtered = certificates.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q) ||
      c.student_email.toLowerCase().includes(q) ||
      c.course_title.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string, sName: string) => {
    if (!(await confirm({ message: `Permanently delete certificate ${id} (${sName})? Its public verification link will stop working. Revoke it instead if you want the link to show it as invalid.` }))) return;
    try {
      await deleteCertificateAction(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      setFeedback(`Certificate ${id} deleted.`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleRevoke = async (id: string, sName: string) => {
    const reason = await prompt({
      title: "Revoke certificate",
      message: `Enter revocation reason for certificate ${id} (Student: ${sName}):`,
      defaultValue: "Revoked by administrative review",
      confirmLabel: "Revoke",
    });
    if (!reason) return;

    try {
      const res = await revokeCertificateAction(id, reason);
      if (res.certificate) {
        setCertificates((prev) =>
          prev.map((c) => (c.id === id ? res.certificate! : c))
        );
        setFeedback(`Certificate ${id} has been officially revoked.`);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      toast.error("Student name and email are required.");
      return;
    }

    const course = courses.find((c) => c.slug === selectedCourseSlug);

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await issueCertificateAction({
        course_id: selectedCourseSlug,
        course_slug: selectedCourseSlug,
        course_title: course?.title || "Comprehensive Islamic Studies",
        student_name: studentName.trim(),
        student_email: studentEmail.trim(),
        score_percentage: scorePercentage,
        grade_title: gradeTitle,
      });

      if (res.certificate) {
        setCertificates((prev) => [
          res.certificate,
          ...prev.filter((c) => c.id !== res.certificate.id),
        ]);
        setIsIssueModalOpen(false);
        setFeedback(`Certificate ${res.certificate.id} successfully issued to ${studentName}!`);
        setStudentName("");
        setStudentEmail("");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = certificates.filter((c) => !c.revoked).length;
  const revokedCount = certificates.filter((c) => c.revoked).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({certificates.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            {t("subheading")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/verify`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border border-[#E0D8CE] bg-white hover:border-[#1B5E20] text-xs font-semibold text-[#2D3436] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
            <span>{tCommon("viewLive")}</span>
          </Link>

          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{tCommon("add")}</span>
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

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {tCommon("all")}
          </span>
          <p className="font-heading text-2xl font-bold text-[#2D3436] mt-1">
            {certificates.length}
          </p>
        </div>

        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {t("valid")}
          </span>
          <p className="font-heading text-2xl font-bold text-[#1B5E20] mt-1">
            {activeCount}
          </p>
        </div>

        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {t("revoked")}
          </span>
          <p className="font-heading text-2xl font-bold text-red-700 mt-1">
            {revokedCount}
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg p-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#636E72] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs ps-9 pe-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E0D8CE] text-[#636E72] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t("colCode")}</th>
                <th className="py-3 px-4">{t("colStudent")}</th>
                <th className="py-3 px-4">{t("colCourse")}</th>
                <th className="py-3 px-4">{t("colGrade")}</th>
                <th className="py-3 px-4">{t("colDate")}</th>
                <th className="py-3 px-4 text-right">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#FCFBF7] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/${locale}/verify/${cert.id}`}
                        target="_blank"
                        className="font-mono font-bold text-sm text-[#1B5E20] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{cert.id}</span>
                        <ExternalLink className="w-3 h-3 text-[#636E72]" />
                      </Link>
                    </div>

                    <div className="text-[10px] text-[#636E72] font-mono truncate max-w-xs mt-0.5" title={cert.verification_token}>
                      Hash: {cert.verification_token.slice(0, 20)}...
                    </div>

                    {cert.revoked ? (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                        {t("revoked")}: {cert.revoked_reason}
                      </span>
                    ) : (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {t("valid")}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-sm text-[#2D3436]">
                      {cert.student_name}
                    </div>
                    <div className="text-[11px] text-[#636E72] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{cert.student_email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#2D3436] line-clamp-1">
                      {cert.course_title}
                    </span>
                    <span className="text-[10px] text-[#636E72] font-mono">
                      {cert.course_slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#E0D8CE] px-2 py-0.5 rounded text-[11px] font-semibold text-[#1B5E20]">
                      <Award className="w-3 h-3 text-[#C5A059]" />
                      <span>{cert.score_percentage}% • {cert.grade_title}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#636E72] text-[11px]">
                    <div>
                      {new Date(cert.issued_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    {cert.hijri_date && (
                      <div className="text-[10px] text-[#C5A059] font-serif">
                        {cert.hijri_date}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {!cert.revoked ? (
                      <button
                        onClick={() => handleRevoke(cert.id, cert.student_name)}
                        className="p-1.5 text-[#636E72] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title={t("revokeCertificate")}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-red-600 font-semibold italic">
                        {t("revoked")}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(cert.id, cert.student_name)}
                      className="ms-1 p-1.5 text-[#636E72] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete record"
                      aria-label={`Delete certificate ${cert.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#636E72]">
                    {tCommon("noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#2D3436]">
                {tCommon("certificates")}
              </h2>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  {t("colCourse")} *
                </label>
                <select
                  value={selectedCourseSlug}
                  onChange={(e) => setSelectedCourseSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] bg-white"
                >
                  {courses.map((crs) => (
                    <option key={crs.slug} value={crs.slug}>
                      {crs.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  {t("colStudent")} *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Score (%)
                  </label>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={scorePercentage}
                    onChange={(e) => setScorePercentage(parseInt(e.target.value, 10))}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    {t("colGrade")}
                  </label>
                  <input
                    type="text"
                    value={gradeTitle}
                    onChange={(e) => setGradeTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E0D8CE]">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#636E72] hover:bg-[#F5F1EB] rounded transition-colors"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{tCommon("save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
