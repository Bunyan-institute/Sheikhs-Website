"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Award, CheckCircle, ArrowRight, Lock } from "lucide-react";

export default function CertificateVerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setError("Please enter a valid certificate serial code.");
      return;
    }
    router.push(`/verify/${encodeURIComponent(clean)}`);
  };

  const sampleCode = "MFM-2026-TWH-1001";

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Classical Scholarly Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#E6E0D8]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white border border-[#E6E0D8] text-[#1A4D2E] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
            <span>Anti-Forgery Scholarly Verification Desk • التحقق من الإجازات والشهادات</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
            Verify Scholarly Certificate
          </h1>
          <p className="text-xs sm:text-sm text-[#555E61] max-w-xl mx-auto leading-relaxed">
            Validate authentic certificates and academic credentials issued by Sheikh Muhammed Ferej Megeno and the Al-Fajr Islamic Foundation.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white border border-[#E6E0D8] rounded-[4px] p-6 sm:p-8 space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="certCode" className="block text-xs font-bold text-[#2D3436] uppercase tracking-wider mb-2">
                Certificate Verification Serial Code *
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
                  placeholder="e.g. MFM-2026-TWH-1001"
                  className="w-full text-xs sm:text-sm font-mono uppercase px-4 py-3 pe-12 border border-[#E6E0D8] rounded-[3px] focus:outline-none focus:border-[#1A4D2E] bg-[#FAF8F5] tracking-wider"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1A4D2E] hover:bg-[#143d24] text-white rounded-[2px] cursor-pointer"
                  title="Verify Certificate"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A4D2E] hover:bg-[#143d24] text-white font-semibold text-xs sm:text-sm rounded-[3px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
              <span>Verify Authenticity Now</span>
            </button>
          </form>

          {/* Quick Sample Test */}
          <div className="pt-4 border-t border-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#7A8285] gap-2">
            <span>Want to test the anti-forgery verification system?</span>
            <button
              onClick={() => {
                setCode(sampleCode);
                router.push(`/verify/${sampleCode}`);
              }}
              className="inline-flex items-center gap-1 text-[#1A4D2E] font-semibold hover:underline cursor-pointer"
            >
              <span>Test Sample Code: {sampleCode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23]" />
            </button>
          </div>
        </div>

        {/* Security & Authenticity Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1A4D2E] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Cryptographic Seal</span>
            </div>
            <p className="text-xs text-[#555E61] leading-relaxed">
              Each certificate is embedded with an HMAC-SHA256 signature generated at the moment of scholarly approval.
            </p>
          </div>

          <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1A4D2E] font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5 text-[#1A4D2E]" />
              <span>Instant Verification</span>
            </div>
            <p className="text-xs text-[#555E61] leading-relaxed">
              Allows employers, universities, Islamic centers, and seekers to authenticate credentials in real-time.
            </p>
          </div>

          <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1A4D2E] font-bold text-xs uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Authoritative Sanad</span>
            </div>
            <p className="text-xs text-[#555E61] leading-relaxed">
              Reflects genuine mastery of traditional and contemporary Islamic curricula taught by Sheikh Muhammed Ferej.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
