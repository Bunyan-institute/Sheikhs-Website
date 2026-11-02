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

  return (
    <>
      <header
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
        className="sticky top-0 z-40 w-full bg-[#072118]/95 backdrop-blur-md text-[#EDF4F0] border-b border-[#BF9A45]/20 transition-colors"
      >
        <div className="max-w-page mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex-1 min-w-0 me-2 sm:me-6">
            <Link href="/" className="group inline-flex items-center gap-2.5 sm:gap-3">
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
                <span className="block font-display text-sm sm:text-base tracking-wide text-[#EDF4F0] group-hover:text-[#E6D3A3] transition-colors truncate max-w-[190px] xs:max-w-[240px] sm:max-w-none">
                  Sheikh Muhammed Ferej
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#E6D3A3]/80 font-medium truncate">
                  Official scholar archive
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            <HeaderNav items={items} />

            <div className="flex items-center gap-3 border-s border-[#BF9A45]/20 ps-4 ms-1">
              <CommandSearch />
              <LocaleSwitcher />
              <Link
                href="/ask"
                className="hidden xl:inline-flex bg-[#BF9A45] text-[#072118] text-sm font-bold rounded-full px-4 py-2 hover:bg-[#E6D3A3] transition-colors shrink-0 shadow-sm"
              >
                Ask the Sheikh
              </Link>
            </div>
          </div>

          {/* Tablet & Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <CommandSearch />
            <LocaleSwitcher />
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-lg text-[#EDF4F0]/85 hover:text-[#E6D3A3] hover:bg-[#0D3E2F] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
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
