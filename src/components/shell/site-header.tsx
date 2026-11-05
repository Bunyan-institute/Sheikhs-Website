"use client";

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import HeaderNav from './header-nav';
import LocaleSwitcher from './locale-switcher';
import { Menu } from 'lucide-react';
import type { PublicProfile } from '@/lib/api/types';
import type { NavItem } from '@/lib/sections';
import MobileNav from './mobile-nav';
import { CommandSearch } from './command-search';
import { useTranslations } from 'next-intl';
import { PwaInstallButton } from '@/components/pwa/pwa-install-button';

export interface SiteHeaderProps {
  profile: PublicProfile;
  navigation?: NavItem[];
  mainItems?: NavItem[];
  moreItems?: NavItem[];
  locale?: string;
}

export function SiteHeader({ profile, navigation, mainItems, moreItems = [], locale = 'en' }: SiteHeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const items = navigation || mainItems || [];

  let tNav = (key: string) => key;
  let tHome = (key: string) => key;
  try {
    tNav = useTranslations("nav");
    tHome = useTranslations("home");
  } catch {
    // fallback
  }

  const brandName = tHome("heroName") !== "heroName" ? tHome("heroName") : (profile.name || "Sheikh Muhammed Ferej");
  const askLabel = tNav("ask") !== "ask" ? tNav("ask") : "Ask the Sheikh";

  return (
    <>
      <header
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
        className="sticky top-0 z-40 w-full bg-[#072118]/95 backdrop-blur-md text-[#EDF4F0] border-b border-[#BF9A45]/20 transition-colors"
      >
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex-1 min-w-0 me-2 sm:me-6">
            <Link href="/" className="group inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer">
              <span className="relative grid place-items-center w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <g fill="none" stroke="#BF9A45" strokeWidth="1.5">
                    <rect x="8" y="8" width="24" height="24" />
                    <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
                  </g>
                </svg>
                <span className="font-arabic text-[#E6D3A3] text-base sm:text-lg leading-none relative -mt-0.5">م</span>
              </span>
              <div className="min-w-0 leading-tight">
                <span className="block font-display text-sm sm:text-base tracking-wide text-[#EDF4F0] group-hover:text-[#E6D3A3] transition-colors truncate max-w-[190px] xs:max-w-[240px] sm:max-w-none font-bold">
                  {brandName}
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#E6D3A3]/80 font-medium truncate">
                  Official scholar archive
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            <HeaderNav items={items} />

            <div className="flex items-center gap-2.5 xl:gap-3 border-s border-[#BF9A45]/20 ps-3.5 xl:ps-4 ms-1">
              <CommandSearch />
              <LocaleSwitcher />
              <PwaInstallButton variant="badge" />
              <Link
                href="/ask"
                className="hidden lg:inline-flex bg-[#BF9A45] text-[#072118] text-xs xl:text-sm font-bold rounded-full px-4 xl:px-5 py-2 hover:bg-[#E6D3A3] transition-colors shrink-0 shadow-sm cursor-pointer min-h-[36px] xl:min-h-[38px] items-center whitespace-nowrap"
              >
                {askLabel}
              </Link>
            </div>
          </div>

          {/* Tablet & Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <PwaInstallButton variant="minimal" />
            <CommandSearch />
            <LocaleSwitcher />
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-lg text-[#EDF4F0]/85 hover:text-[#E6D3A3] hover:bg-[#0D3E2F] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        mainItems={items}
        moreItems={moreItems}
        locale={locale}
        profile={profile}
      />
    </>
  );
}

export default SiteHeader;
