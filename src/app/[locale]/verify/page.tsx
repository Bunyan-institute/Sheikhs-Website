"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ShieldCheck, Search, ArrowRight, Lock, CheckCircle2, Award } from "lucide-react";

export default function VerifyPage() {
  const t = useTranslations("verify");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sampleCode = "MFM-2026-RIYAD-1001";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setError("Please enter a valid certificate code.");
      return;
    }
    router.push(`/verify/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-8">
        {/* Verification Form Card */}
        <div className="bg-white border border-[#0F241C]/10 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="certCode" className="block text-xs font-bold text-[#0F241C] uppercase tracking-wider mb-2">
                {t("inputPlaceholder")} *
              </label>
              <div className="relative">
                <input
                  id="certCode"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. MFM-2026-RIYAD-1001"
                  className="w-full text-xs sm:text-sm font-mono uppercase px-4 py-3 pe-12 border border-[#0F241C]/15 rounded-xl focus:outline-none focus:border-[#1B6A50] bg-[#EDF4F0]/50 tracking-wider text-[#0F241C]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1B6A50] hover:bg-[#0D3E2F] text-white rounded-lg cursor-pointer transition-colors"
                  title="Verify Certificate"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-[#072118]" />
              <span>{t("verifyButton")}</span>
            </button>
          </form>

          {/* Quick Sample Test */}
          <div className="pt-4 border-t border-[#0F241C]/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#0F241C]/60 gap-2">
            <span>Want to test the anti-forgery verification system?</span>
            <button
              onClick={() => {
                setCode(sampleCode);
                router.push(`/verify/${sampleCode}`);
              }}
              className="inline-flex items-center gap-1 text-[#1B6A50] font-semibold hover:underline cursor-pointer"
            >
              <span>Test Sample Code: {sampleCode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#BF9A45]" />
            </button>
          </div>
        </div>

        {/* Security & Authenticity Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white border border-[#0F241C]/10 p-5 rounded-2xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#1B6A50] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>Cryptographic Seal</span>
            </div>
            <p className="text-xs text-[#0F241C]/70 leading-relaxed font-sans">
              Each certificate is embedded with an HMAC-SHA256 signature generated at the moment of scholarly approval.
            </p>
          </div>

          <div className="bg-white border border-[#0F241C]/10 p-5 rounded-2xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#1B6A50] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>Sanad Chain Registry</span>
            </div>
            <p className="text-xs text-[#0F241C]/70 leading-relaxed font-sans">
              Direct linkage to classical teaching halaqat, authentic curriculum, and accredited scholars.
            </p>
          </div>

          <div className="bg-white border border-[#0F241C]/10 p-5 rounded-2xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#1B6A50] font-bold text-xs uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>Official Accreditation</span>
            </div>
            <p className="text-xs text-[#0F241C]/70 leading-relaxed font-sans">
              Issued under the auspices of Al-Fajr Islamic Foundation and Sheikh Muhammed Ferej Megeno.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
