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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      <div className="mb-8 print:hidden">
        <Link
          href="/verify"
          className="inline-flex items-center text-xs font-semibold text-[#636E72] hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 me-1" />
          <span>Back to Verification Search</span>
        </Link>
      </div>

      {certificate && !certificate.revoked ? (
        <div className="space-y-8">
          {/* Green Verified Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
                  Official Scholarly Record Verified
                </span>
                <h1 className="font-heading text-lg sm:text-2xl font-bold text-[#2D3436]">
                  Authentic Certificate of Islamic Studies
                </h1>
                <p className="text-xs text-[#636E72]">
                  This certificate has been matched against the official registry of Sheikh Muhammed Ferej Megeno.
                </p>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-[11px] text-[#636E72] uppercase font-bold block">
                Certificate Serial
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[#1B5E20]">
                {certificate.id}
              </span>
            </div>
          </div>

          {/* Quick Verified Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-[#E0D8CE] p-4 rounded-lg shadow-2xs print:hidden">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#636E72] uppercase font-bold flex items-center gap-1">
                <User className="w-3 h-3 text-[#C5A059]" />
                Student Name
              </span>
              <p className="font-heading font-bold text-sm text-[#2D3436] truncate">
                {certificate.student_name}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-[#636E72] uppercase font-bold flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#C5A059]" />
                Course Title
              </span>
              <p className="font-heading font-bold text-sm text-[#2D3436] truncate">
                {certificate.course_title}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-[#636E72] uppercase font-bold flex items-center gap-1">
                <Award className="w-3 h-3 text-[#C5A059]" />
                Score & Merit
              </span>
              <p className="font-heading font-bold text-sm text-[#1B5E20]">
                {certificate.score_percentage}% • {certificate.grade_title}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-[#636E72] uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C5A059]" />
                Issue Date
              </span>
              <p className="font-heading font-bold text-sm text-[#2D3436]">
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
        <div className="max-w-2xl mx-auto bg-amber-50 border-2 border-amber-400 rounded-xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-amber-900">
            Certificate Officially Revoked
          </h1>
          <p className="text-sm text-amber-800 leading-relaxed">
            Certificate <span className="font-mono font-bold">{certificate.id}</span> was revoked by the Scholarly Board.
          </p>
          {certificate.revoked_reason && (
            <div className="bg-white/80 p-3 rounded border border-amber-300 text-xs text-amber-900 font-medium">
              Reason: {certificate.revoked_reason}
            </div>
          )}
          <Link
            href="/verify"
            className="inline-block mt-4 px-5 py-2 rounded bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
          >
            Verify Another Certificate
          </Link>
        </div>
      ) : (
        /* Invalid / Forged Alert */
        <div className="max-w-2xl mx-auto bg-white border-2 border-red-300 rounded-xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[11px] uppercase font-bold text-red-600 tracking-wider">
              Verification Failure
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D3436] mt-1">
              Certificate Not Found / Unverified
            </h1>
            <p className="text-xs sm:text-sm text-[#636E72] mt-2 leading-relaxed">
              No authentic record matches the verification code:
              <span className="font-mono font-bold text-red-700 block mt-1 text-base">
                &ldquo;{cleanCode}&rdquo;
              </span>
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-left text-xs text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-red-700 shrink-0" />
              <span>Anti-Forgery & Tamper Protection Advisory</span>
            </div>
            <p className="text-[#636E72] leading-relaxed">
              All authentic certificates issued by Sheikh Muhammed Ferej Megeno and the Al-Fajr Islamic Foundation are cryptographically cataloged in our registry. If you were presented with a paper or digital certificate bearing this code, it may be invalid or counterfeit.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/verify"
              className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Search Another Code
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 border border-[#E0D8CE] hover:border-[#1B5E20] text-[#2D3436] text-xs font-semibold rounded-lg transition-colors"
            >
              Report Suspected Fraud
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
