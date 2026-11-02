"use client";

import { Award, CheckCircle, Printer, ShieldCheck } from "lucide-react";
import type { IssuedCertificateRecord } from "@/lib/db/types";

export function CertificateView({
  certificate,
  showActions = true,
}: {
  certificate: IssuedCertificateRecord;
  showActions?: boolean;
}) {
  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${certificate.id}`
    : `https://muhammedferej.pro.et/verify/${certificate.id}`;

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A2532] text-[#EDF2EE] border border-[#BF9A45]/30 p-3.5 rounded-2xl print:hidden shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#BF9A45]" />
            <div className="text-xs">
              <span className="font-semibold text-[#EDF2EE]/80">Certificate Serial: </span>
              <span className="font-mono text-[#E6D3A3] font-bold">{certificate.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#0A2532] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Ornate Islamic Certificate Card */}
      <div
        id="printable-certificate"
        className="relative bg-white text-[#14262E] border-[10px] border-[#0A2532] p-6 sm:p-10 md:p-14 rounded-2xl shadow-lg overflow-hidden print:border-8 print:p-8 print:shadow-none print:m-0"
      >
        {/* Inner Gold Borders */}
        <div className="absolute inset-2.5 border-2 border-[#BF9A45] rounded-xl pointer-events-none" />
        <div className="absolute inset-4 border border-[#BF9A45]/40 rounded-lg pointer-events-none" />

        {/* Corner Arabesque Motifs */}
        <div className="absolute top-5 left-5 text-[#BF9A45] text-2xl font-arabic select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute top-5 right-5 text-[#BF9A45] text-2xl font-arabic select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute bottom-5 left-5 text-[#BF9A45] text-2xl font-arabic select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute bottom-5 right-5 text-[#BF9A45] text-2xl font-arabic select-none pointer-events-none">
          ۞
        </div>

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-[200px] font-arabic">
          م
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Bismillah Calligraphy */}
          <div className="font-arabic text-xl sm:text-2xl text-[#1D6A5A] tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Certificate Title */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#BF9A45] block mb-1">
              Al-Fajr Islamic Foundation &amp; Scholarly Accreditation Council
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#14262E] tracking-tight uppercase">
              Certificate of Scholarly Completion
            </h1>
            <p className="text-xs sm:text-sm font-arabic text-[#14262E]/60 mt-1">
              شهادة إتمام منهج علمي واجتياز الاختبار المعتمد
            </p>
          </div>

          {/* Recipient Statement */}
          <div className="py-2">
            <p className="text-xs sm:text-sm text-[#14262E]/60 uppercase tracking-wider mb-2 font-sans">
              This is to certify that
            </p>
            <div className="inline-block border-b-2 border-[#BF9A45] px-6 sm:px-12 py-1">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#1D6A5A]">
                {certificate.student_name}
              </span>
            </div>
          </div>

          {/* Course Details & Grade */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-xs sm:text-sm text-[#14262E]/80 leading-relaxed font-sans">
              has successfully completed all lessons, studied the curriculum, and passed the official examination for the study program:
            </p>
            <h3 className="font-display font-bold text-lg sm:text-2xl text-[#14262E]">
              {certificate.course_title}
            </h3>
            <div className="inline-flex items-center gap-2 bg-[#EDF2EE] px-4 py-1.5 rounded-full text-xs font-semibold text-[#1D6A5A] border border-[#BF9A45]/30">
              <Award className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>
                Grade: {certificate.score_percentage}% • {certificate.grade_title}
              </span>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="pt-6 border-t border-[#14262E]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* Instructor Signature */}
            <div className="text-center sm:text-left">
              <div className="h-10 flex items-end justify-center sm:justify-start">
                <span className="font-display italic text-base text-[#1D6A5A] border-b border-[#14262E]/30 pb-1">
                  Sheikh Muhammed Ferej Megeno
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#14262E] mt-1 font-display">
                Sheikh Muhammed Ferej
              </p>
              <p className="text-[10px] text-[#14262E]/60">
                Senior Islamic Scholar &amp; AAOIFI Consultant
              </p>
            </div>

            {/* Official Digital Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-double border-[#BF9A45] bg-[#EDF2EE] flex flex-col items-center justify-center p-1 text-center shadow-xs">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#1D6A5A]">
                  Al-Fajr Seal
                </span>
                <span className="text-[14px] text-[#BF9A45] my-0.5">★ ★ ★</span>
                <span className="text-[7px] text-[#14262E]/70 uppercase font-bold">
                  Verified
                </span>
              </div>
              <span className="text-[9px] text-[#14262E]/60 mt-1 uppercase font-semibold">
                Official Digital Seal
              </span>
            </div>

            {/* Date & Serial */}
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#14262E]">
                <span className="font-semibold">Issued: </span>
                {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {certificate.hijri_date && (
                <p className="text-[10px] font-arabic text-[#14262E]/60">
                  {certificate.hijri_date}
                </p>
              )}
              <div className="mt-2 inline-block text-left sm:text-right">
                <p className="text-[10px] font-mono text-[#BF9A45] font-bold">
                  ID: {certificate.id}
                </p>
              </div>
            </div>
          </div>

          {/* Tamper-Proof Footer Bar */}
          <div className="pt-4 border-t border-[#14262E]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#14262E]/60 gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] truncate max-w-sm">
              <span className="font-bold text-[#1D6A5A]">HMAC Hash:</span>
              <span className="truncate">{certificate.verification_token}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#1D6A5A] font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#1D6A5A]" />
              <span>Verify at: {verificationUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateView;