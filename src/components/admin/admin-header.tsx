"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ExternalLink, RefreshCw, Globe, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { locales, localeLabels, type Locale } from "@/i18n/config";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  username?: string;
}

export function AdminHeader({ onOpenMobileSidebar, username = "Admin" }: AdminHeaderProps) {
  const router = useRouter();
  const tHeader = useTranslations("admin.header");
  const tCommon = useTranslations("admin.common");
  const currentLocale = useLocale() as Locale;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    document.cookie = `admin_locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    setLangMenuOpen(false);
    window.location.reload();
  };

  return (
    <header className="h-16 pt-[env(safe-area-inset-top)] box-content bg-white border-b border-[#E0D8CE] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-[#636E72] hover:text-[#2D3436] rounded hover:bg-[#FAF8F5]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs uppercase font-bold tracking-wider text-[#636E72]">
            {tHeader("systemStatus")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-[#2D3436] hover:bg-[#FAF8F5] border border-[#E0D8CE] transition-all"
            title={tCommon("switchLanguage")}
          >
            <Globe className="w-3.5 h-3.5 text-[#1B5E20]" />
            <span>{localeLabels[currentLocale] || currentLocale.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {langMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLangMenuOpen(false)}
              />
              <div className="absolute end-0 mt-1.5 w-44 bg-white border border-[#E0D8CE] rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-gray-100">
                  {tCommon("selectLanguage")}
                </div>
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={`w-full text-start px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF8F5] transition-colors ${
                      currentLocale === loc
                        ? "font-bold text-[#1B5E20] bg-emerald-50/50"
                        : "text-[#2D3436]"
                    }`}
                  >
                    <span>{localeLabels[loc]}</span>
                    {currentLocale === loc && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          title={tHeader("refresh")}
          className="p-2 text-[#636E72] hover:text-[#1B5E20] hover:bg-[#FAF8F5] rounded border border-transparent hover:border-[#E0D8CE] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#1B5E20]" : ""}`} />
        </button>

        {/* Live Site link */}
        <Link
          href={`/${currentLocale}`}
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#E0D8CE] text-xs font-semibold text-[#2D3436] hover:border-[#1B5E20] hover:text-[#1B5E20] bg-white transition-all shadow-2xs"
        >
          <span>{tHeader("liveSite")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 border-s border-[#E0D8CE] ps-3 ms-1">
          <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[#2D3436] hidden md:block">
            {username}
          </span>
        </div>
      </div>
    </header>
  );
}
