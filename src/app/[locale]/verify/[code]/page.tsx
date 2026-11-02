import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { getCertificateByCode } from "@/lib/db/repository";
import { CertificateView } from "@/components/certificate/certificate-view";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Award,
  User,
  BookOpen,
} from "lucide-react";

export default async function CertificateDetailVerificationPage(props: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await props.params;
  setRequestLocale(locale);

  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  const certificate = getCertificateByCode(cleanCode);

  return (
    <div className="w-full bg-[#EDF2EE] py-10 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <div className="mb-8 print:hidden">
          <Link
            href="/verify"
            className="inline-flex items-center text-xs font-semibold text-[#1D6A5A] hover:text-[#0F3446] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 me-1.5 text-[#BF9A45]" />
            <span>Back to Verification Search</span>
          </Link>
        </div>

        {certificate && !certificate.revoked ? (
          <div className="space-y-8">
            {/* Verified Banner */}
            <div className="bg-[#1D6A5A]/10 border-2 border-[#1D6A5A] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1D6A5A] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-[#E6D3A3]" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1D6A5A] bg-white border border-[#1D6A5A]/30 px-3 py-0.5 rounded-full mb-1.5">
                    Official Scholarly Record Verified
                  </span>
                  <h1 className="font-display text-xl sm:text-2xl font-bold text-[#14262E]">
                    Authentic Certificate of Islamic Studies
                  </h1>
                  <p className="text-xs text-[#14262E]/70 mt-0.5">
                    This certificate has been matched against the official registry of Sheikh Muhammed Ferej Megeno.
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <span className="text-[11px] text-[#14262E]/60 uppercase font-semibold block">
                  Certificate Serial
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#BF9A45]">
                  {certificate.id}
                </span>
              </div>
            </div>

            {/* Quick Verified Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-[#14262E]/10 p-5 rounded-2xl shadow-xs print:hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-[#14262E]/60 uppercase font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#BF9A45]" />
                  Student Name
                </span>
                <p className="font-display font-semibold text-base text-[#14262E] truncate">
                  {certificate.student_name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#14262E]/60 uppercase font-semibold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#BF9A45]" />
                  Course Title
                </span>
                <p className="font-display font-semibold text-base text-[#14262E] truncate">
                  {certificate.course_title}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#14262E]/60 uppercase font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#BF9A45]" />
                  Score &amp; Merit
                </span>
                <p className="font-display font-semibold text-base text-[#1D6A5A]">
                  {certificate.score_percentage}% • {certificate.grade_title}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#14262E]/60 uppercase font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#BF9A45]" />
                  Issue Date
                </span>
                <p className="font-display font-semibold text-base text-[#14262E]">
                  {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Full Rendered Certificate */}
            <div>
              <CertificateView certificate={certificate} showActions={true} />
            </div>
          </div>
        ) : certificate && certificate.revoked ? (
          /* Revoked Certificate Warning */
          <div className="max-w-2xl mx-auto bg-amber-50 border-2 border-amber-400 rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-amber-900">
              Certificate Officially Revoked
            </h1>
            <p className="text-sm text-amber-800 leading-relaxed font-sans">
              Certificate <span className="font-mono font-bold">{certificate.id}</span> was revoked by the Scholarly Board.
            </p>
            {certificate.revoked_reason && (
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-300 text-xs text-amber-900 font-medium">
                Reason: {certificate.revoked_reason}
              </div>
            )}
            <Link
              href="/verify"
              className="inline-block mt-4 px-6 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors"
            >
              Verify Another Certificate
            </Link>
          </div>
        ) : (
          /* Invalid / Forged Alert */
          <div className="max-w-2xl mx-auto bg-white border-2 border-red-300 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] uppercase font-semibold text-red-600 tracking-wider">
                Verification Failure
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14262E] mt-1">
                Certificate Not Found / Unverified
              </h1>
              <p className="text-xs sm:text-sm text-[#14262E]/70 mt-2 leading-relaxed">
                No authentic record matches the verification code:
                <span className="font-mono font-bold text-red-700 block mt-1 text-base">
                  &ldquo;{cleanCode}&rdquo;
                </span>
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-left text-xs text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-red-700 shrink-0" />
                <span>Anti-Forgery &amp; Tamper Protection Advisory</span>
              </div>
              <p className="text-[#14262E]/70 leading-relaxed font-sans">
                All authentic certificates issued by Sheikh Muhammed Ferej Megeno and the Al-Fajr Islamic Foundation are cryptographically cataloged in our registry. If you were presented with a paper or digital certificate bearing this code, it may be invalid or counterfeit.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/verify"
                className="px-6 py-2.5 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#0A2532] text-xs font-semibold rounded-full shadow-xs transition-colors"
              >
                Search Another Code
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2.5 border border-[#14262E]/15 hover:border-[#1D6A5A] text-[#14262E] text-xs font-semibold rounded-full transition-colors"
              >
                Report Suspected Fraud
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}