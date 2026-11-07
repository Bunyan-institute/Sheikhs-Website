import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCertificateByCode } from "@/lib/db/repository";
import { CertificateView } from "@/components/certificate/certificate-view";
import type { Metadata } from "next";
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Award,
  BookOpen,
  User
} from "lucide-react";

interface CertificateVerifyPageProps {
  params: Promise<{ locale: string; code: string }>;
}

export async function generateMetadata(props: CertificateVerifyPageProps): Promise<Metadata> {
  const { locale, code } = await props.params;
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  return {
    title: `Certificate Verification: ${cleanCode} | Sheikh Muhammed Ferej Megeno`,
    description: `Official authentic certificate verification for student accreditation #${cleanCode}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CertificateVerifyPage(props: CertificateVerifyPageProps) {
  const { locale, code } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "verify" });
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  const certificate = await getCertificateByCode(cleanCode);

  return (
    <div className="w-full bg-[#EDF4F0] py-8 sm:py-12 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 print:hidden">
          <Link
            href="/verify"
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#1B6A50] hover:text-[#0D3E2F] transition-colors py-1"
          >
            <ArrowLeft className="w-4 h-4 me-1.5 rtl:rotate-180 text-[#BF9A45]" />
            <span>{t("verifyButton")}</span>
          </Link>
        </div>

        {certificate && !certificate.revoked ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Verified Banner */}
            <div className="bg-[#1B6A50]/10 border-2 border-[#1B6A50] rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-xs print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B6A50] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#E6D3A3]" />
                </div>
                <div>
                  <span className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1B6A50] bg-white border border-[#1B6A50]/30 px-3 py-0.5 rounded-full mb-1">
                    {t("validBadge")}
                  </span>
                  <h1 className="font-display text-lg sm:text-2xl font-bold text-[#0F241C]">
                    {t("title")}
                  </h1>
                  <p className="text-xs text-[#0F241C]/70 mt-0.5">
                    {t("description")}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <span className="text-[10px] sm:text-[11px] text-[#0F241C]/60 uppercase font-semibold block">
                  Serial
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#BF9A45]">
                  {certificate.id}
                </span>
              </div>
            </div>

            {/* Quick Verified Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-[#0F241C]/10 p-4 sm:p-5 rounded-2xl shadow-xs print:hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0F241C]/60 uppercase font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("studentName")}</span>
                </span>
                <p className="font-display font-semibold text-sm sm:text-base text-[#0F241C] truncate">
                  {certificate.student_name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F241C]/60 uppercase font-semibold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("courseTitle")}</span>
                </span>
                <p className="font-display font-semibold text-sm sm:text-base text-[#0F241C] truncate">
                  {certificate.course_title}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F241C]/60 uppercase font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("grade")}</span>
                </span>
                <p className="font-display font-semibold text-sm sm:text-base text-[#1B6A50]">
                  {certificate.score_percentage}% • {certificate.grade_title}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F241C]/60 uppercase font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#BF9A45]" />
                  <span>{t("issueDate")}</span>
                </span>
                <p className="font-display font-semibold text-sm sm:text-base text-[#0F241C]">
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
          <div className="max-w-2xl mx-auto bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 sm:p-10 text-center space-y-4">
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors"
            >
              {t("verifyButton")}
            </Link>
          </div>
        ) : (
          /* Certificate Not Found */
          <div className="max-w-xl mx-auto bg-white border border-[#0F241C]/10 rounded-2xl p-6 sm:p-10 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#0F241C]">
              {t("invalidBadge")}
            </h1>
            <p className="text-xs sm:text-sm text-[#0F241C]/70 leading-relaxed font-sans">
              No official record matching code <span className="font-mono font-semibold text-[#0F241C]">&ldquo;{cleanCode}&rdquo;</span> exists in the scholarly database of Sheikh Muhammed Ferej Megeno.
            </p>
            <p className="text-xs text-[#0F241C]/50">
              Please double check the code printed on the bottom border of the certificate or re-scan the QR code.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1B6A50] text-white text-xs font-bold hover:bg-[#0D3E2F] transition-colors"
            >
              {t("verifyButton")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
