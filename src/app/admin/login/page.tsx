"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { locales, localeLabels, type Locale } from "@/i18n/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const tLogin = useTranslations("admin.login");
  const tCommon = useTranslations("admin.common");
  const currentLocale = useLocale() as Locale;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (newLocale: Locale) => {
    document.cookie = `admin_locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || tLogin("authFailed"));
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError(tLogin("networkError"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#1B5E20] selection:text-white">
      {/* Language Switcher pill in top corner */}
      <div className="absolute top-4 end-4 flex items-center gap-1.5 bg-white border border-[#E0D8CE] rounded-full px-3 py-1 text-xs shadow-2xs">
        <Globe className="w-3.5 h-3.5 text-[#1B5E20]" />
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              currentLocale === loc
                ? "bg-[#1B5E20] text-white"
                : "text-gray-600 hover:text-[#1B5E20]"
            }`}
          >
            {localeLabels[loc]}
          </button>
        ))}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href={`/${currentLocale}`} className="inline-flex items-center justify-center gap-2 mb-4 group">
            <span className="w-10 h-10 rounded-md bg-[#1B5E20] text-white flex items-center justify-center font-heading font-bold text-xl shadow-md border border-[#154a19] group-hover:scale-105 transition-transform">
              م
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#B8860B]/30 text-xs font-semibold text-[#B8860B] mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
            <span>{tLogin("badge")}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436]">
            {tLogin("title")}
          </h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-[#636E72] font-medium">
            {tLogin("subtitle")}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-[#E0D8CE] shadow-sm rounded-lg">
          {error && (
            <div className="mb-6 p-3.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#2D3436] mb-1.5">
                {tLogin("username")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#636E72]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={tLogin("usernamePlaceholder")}
                  autoComplete="username"
                  className="w-full ps-10 pe-4 py-2.5 bg-[#FAF8F5]/50 border border-[#E0D8CE] rounded-md text-sm text-[#2D3436] placeholder-[#636E72]/60 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#2D3436] mb-1.5">
                {tLogin("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#636E72]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tLogin("passwordPlaceholder")}
                  autoComplete="current-password"
                  className="w-full ps-10 pe-10 py-2.5 bg-[#FAF8F5]/50 border border-[#E0D8CE] rounded-md text-sm text-[#2D3436] placeholder-[#636E72]/60 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-3 flex items-center text-[#636E72] hover:text-[#2D3436]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{tLogin("signingIn")}</span>
                </>
              ) : (
                <span>{tLogin("signIn")}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E0D8CE] text-center text-xs text-[#636E72]">
            <p>
              Default Setup: <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E0D8CE] text-[#1B5E20]">admin</code> / <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E0D8CE] text-[#1B5E20]">sheikh_admin_2026!</code>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#636E72] hover:text-[#1B5E20] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tLogin("backToPortal")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
