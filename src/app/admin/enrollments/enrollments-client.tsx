"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  GraduationCap,
  Search,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
  BookOpen,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import type { CourseEnrollmentRecord } from "@/lib/db/types";

export function EnrollmentsClient({
  initialEnrollments,
}: {
  initialEnrollments: CourseEnrollmentRecord[];
}) {
  const t = useTranslations("admin.enrollments");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  const [enrollments] = useState<CourseEnrollmentRecord[]>(initialEnrollments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "enrolled" | "in_progress" | "completed">("all");

  const filtered = enrollments.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.student_name.toLowerCase().includes(q) ||
      e.student_email.toLowerCase().includes(q) ||
      e.course_title.toLowerCase().includes(q) ||
      (e.city && e.city.toLowerCase().includes(q))
    );
  });

  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const inProgressCount = enrollments.filter((e) => e.status === "in_progress").length;
  const certifiedCount = enrollments.filter((e) => Boolean(e.certificate_id)).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")} ({enrollments.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            {t("subheading")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>{tCommon("certificates")} ({certifiedCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {tCommon("all")}
          </span>
          <p className="font-heading text-2xl font-bold text-[#2D3436] mt-1">
            {enrollments.length}
          </p>
        </div>

        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {t("inProgress")}
          </span>
          <p className="font-heading text-2xl font-bold text-amber-700 mt-1">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {t("completed")}
          </span>
          <p className="font-heading text-2xl font-bold text-emerald-700 mt-1">
            {completedCount}
          </p>
        </div>

        <div className="bg-white border border-[#E0D8CE] p-4 rounded-lg">
          <span className="text-[11px] text-[#636E72] uppercase font-bold block">
            {t("issued")}
          </span>
          <p className="font-heading text-2xl font-bold text-[#1B5E20] mt-1">
            {certifiedCount}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#E0D8CE] rounded-lg p-3">
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: "all", label: tCommon("all"), count: enrollments.length },
              { id: "in_progress", label: t("inProgress"), count: inProgressCount },
              { id: "completed", label: t("completed"), count: completedCount },
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

        <div className="relative">
          <Search className="w-4 h-4 text-[#636E72] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs ps-9 pe-3 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E0D8CE] text-[#636E72] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t("colStudent")}</th>
                <th className="py-3 px-4">{t("colCourse")}</th>
                <th className="py-3 px-4">{t("colProgress")}</th>
                <th className="py-3 px-4">{t("colStatus")}</th>
                <th className="py-3 px-4">{t("colCertificate")}</th>
                <th className="py-3 px-4 text-right">{t("colDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filtered.map((enr) => {
                const highestScore =
                  enr.exam_attempts.length > 0
                    ? Math.max(...enr.exam_attempts.map((a) => a.score))
                    : null;

                return (
                  <tr key={enr.id} className="hover:bg-[#FCFBF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-sm text-[#2D3436]">
                        {enr.student_name}
                      </div>
                      <div className="text-[11px] text-[#636E72] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-[#636E72]" />
                        <span>{enr.student_email}</span>
                      </div>
                      {enr.city && (
                        <div className="text-[10px] text-[#636E72] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#C5A059]" />
                          <span>{enr.city}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#2D3436] line-clamp-1">
                        {enr.course_title}
                      </span>
                      <span className="text-[10px] text-[#636E72] font-mono">
                        {enr.course_slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1B5E20]">
                          {enr.completed_lessons.length} lessons
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {highestScore !== null ? (
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                              highestScore >= 70 ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            Score: {highestScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#636E72] italic text-[11px]">
                          —
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {enr.certificate_id ? (
                        <Link
                          href={`/${locale}/verify/${enr.certificate_id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B5E20] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-colors"
                        >
                          <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{enr.certificate_id}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            enr.status === "in_progress"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-[#F5F1EB] text-[#636E72]"
                          }`}
                        >
                          {enr.status === "in_progress" ? t("inProgress") : enr.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#636E72] text-[11px]">
                      {new Date(enr.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}

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
    </div>
  );
}
