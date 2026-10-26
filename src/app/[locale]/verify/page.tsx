"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Award, CheckCircle, AlertTriangle, ArrowRight, Lock } from "lucide-react";

export default function CertificateVerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setError("Please enter a valid certificate code.");
      return;
    }
    router.push(`/verify/${encodeURIComponent(clean)}`);
  };

  const sampleCode = "MFM-2026-TWH-1001";

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1B5E20] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Forgery Scholarly Verification</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#2D3436] tracking-tight">
            Verify Scholarly Certificate
          </h1>
          <p className="text-sm sm:text-base text-[#636E72] leading-relaxed">
            Validate authentic certificates and academic credentials issued by Sheikh Muhammed Ferej Megeno and the Al-Fajr Islamic Foundation.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white border-2 border-[#1B5E20] rounded-xl p-6 sm:p-10 shadow-lg space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="certCode" className="block text-xs sm:text-sm font-bold text-[#2D3436] mb-2">
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
                  className="w-full text-sm sm:text-base font-mono uppercase px-4 py-3.5 pe-12 border-2 border-[#E0D8CE] rounded-lg focus:outline-none focus:border-[#1B5E20] tracking-wider"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-md transition-colors cursor-pointer"
                  title="Verify Certificate"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify Authenticity Now</span>
            </button>
          </form>

          {/* Quick Sample Test */}
          <div className="pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#636E72] gap-2">
            <span>Want to test the anti-forgery system?</span>
            <button
              onClick={() => {
                setCode(sampleCode);
                router.push(`/verify/${sampleCode}`);
              }}
              className="inline-flex items-center gap-1 text-[#1B5E20] font-bold hover:underline cursor-pointer"
            >
              <span>Test Sample Code: {sampleCode}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & Authenticity Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-[#C5A059]" />
              <span>Cryptographic Seal</span>
            </div>
            <p className="text-xs text-[#636E72]">
              Each certificate is embedded with an HMAC-SHA256 signature generated at the moment of scholarly approval.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Instant Verification</span>
            </div>
            <p className="text-xs text-[#636E72]">
              Allows employers, universities, Islamic centers, and seekers to authenticate credentials in real-time.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Authoritative Sanad</span>
            </div>
            <p className="text-xs text-[#636E72]">
              Reflects genuine mastery of traditional and contemporary Islamic curricula taught by Sheikh Muhammed Ferej.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
