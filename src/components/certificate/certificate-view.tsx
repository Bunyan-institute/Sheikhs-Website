"use client";

import { Award, CheckCircle, Printer, ShieldCheck, QrCode, ExternalLink } from "lucide-react";
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
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] border border-[#E0D8CE] p-3 rounded-md print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1B5E20]" />
            <div className="text-xs">
              <span className="font-bold text-[#2D3436]">Serial: </span>
              <span className="font-mono text-[#1B5E20] font-bold">{certificate.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
        className="relative bg-[#FCFBF7] text-[#2D3436] border-[10px] border-[#1B5E20] p-6 sm:p-10 md:p-12 rounded-lg shadow-md overflow-hidden print:border-8 print:p-8 print:shadow-none print:m-0"
      >
        {/* Inner Gold Border */}
        <div className="absolute inset-2 border-2 border-[#C5A059] rounded pointer-events-none" />
        <div className="absolute inset-3 border border-[#C5A059]/40 rounded pointer-events-none" />

        {/* Corner Arabesque Motifs */}
        <div className="absolute top-4 left-4 text-[#C5A059] text-2xl font-serif select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute top-4 right-4 text-[#C5A059] text-2xl font-serif select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute bottom-4 left-4 text-[#C5A059] text-2xl font-serif select-none pointer-events-none">
          ۞
        </div>
        <div className="absolute bottom-4 right-4 text-[#C5A059] text-2xl font-serif select-none pointer-events-none">
          ۞
        </div>

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-[180px] font-serif">
          م
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Bismillah Calligraphy */}
          <div className="font-serif text-lg sm:text-xl text-[#1B5E20] tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Certificate Title */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              Al-Fajr Islamic Foundation & Scholarly Accreditation Council
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#2D3436] tracking-tight uppercase">
              Certificate of Scholarly Completion
            </h1>
            <p className="text-xs sm:text-sm font-serif text-[#636E72] mt-1">
              شهادة إتمام منهج علمي واجتياز الاختبار المعتمد
            </p>
          </div>

          {/* Recipient Statement */}
          <div className="py-2">
            <p className="text-xs sm:text-sm text-[#636E72] uppercase tracking-wider mb-2">
              This is to certify that
            </p>
            <div className="inline-block border-b-2 border-[#C5A059] px-6 sm:px-12 py-1">
              <span className="font-heading text-xl sm:text-3xl font-bold text-[#1B5E20]">
                {certificate.student_name}
              </span>
            </div>
          </div>

          {/* Course Details & Grade */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-xs sm:text-sm text-[#2D3436] leading-relaxed">
              has successfully completed all lessons, studied the curriculum, and passed the official examination for the study program:
            </p>
            <h3 className="font-heading font-bold text-base sm:text-xl text-[#2D3436]">
              {certificate.course_title}
            </h3>
            <div className="inline-flex items-center gap-2 bg-[#F5F1EB] px-3 py-1 rounded text-xs font-semibold text-[#1B5E20] border border-[#E0D8CE]">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                Grade: {certificate.score_percentage}% • {certificate.grade_title}
              </span>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="pt-6 border-t border-[#E0D8CE] grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* Instructor Signature */}
            <div className="text-center sm:text-left">
              <div className="h-10 flex items-end justify-center sm:justify-start">
                <span className="font-serif italic text-base text-[#1B5E20] border-b border-[#2D3436]/40 pb-1">
                  Sheikh Muhammed Ferej Megeno
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#2D3436] mt-1">
                Sheikh Muhammed Ferej
              </p>
              <p className="text-[10px] text-[#636E72]">
                Senior Islamic Scholar & AAOIFI Consultant
              </p>
            </div>

            {/* Official Digital Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-double border-[#C5A059] bg-[#FAF8F5] flex flex-col items-center justify-center p-1 text-center shadow-xs">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#1B5E20]">
                  Al-Fajr Seal
                </span>
                <span className="text-[14px] text-[#C5A059] my-0.5">★ ★ ★</span>
                <span className="text-[7px] text-[#636E72] uppercase font-bold">
                  Verified
                </span>
              </div>
              <span className="text-[9px] text-[#636E72] mt-1 uppercase font-semibold">
                Official Digital Seal
              </span>
            </div>

            {/* Date & Serial */}
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#2D3436]">
                <span className="font-semibold">Issued: </span>
                {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {certificate.hijri_date && (
                <p className="text-[10px] font-serif text-[#636E72]">
                  {certificate.hijri_date}
                </p>
              )}
              <div className="mt-2 inline-block text-left sm:text-right">
                <p className="text-[10px] font-mono text-[#1B5E20] font-bold">
                  ID: {certificate.id}
                </p>
              </div>
            </div>
          </div>

          {/* Tamper-Proof Footer Bar */}
          <div className="pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#636E72] gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] truncate max-w-sm">
              <span className="font-bold text-[#1B5E20]">HMAC Hash:</span>
              <span className="truncate">{certificate.verification_token}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#1B5E20] font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify at: {verificationUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
