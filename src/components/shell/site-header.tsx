"use client";

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import HeaderNav from './header-nav';
import LocaleSwitcher from './locale-switcher';
import { Search, Menu } from 'lucide-react';
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
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E0D8CE] shadow-2xs">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex-1 min-w-0 me-2 sm:me-6">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-[4px] bg-[#1B5E20] text-[#FAF8F5] flex items-center justify-center font-heading font-bold text-base sm:text-lg shadow-sm border border-[#154a19] shrink-0 group-hover:scale-105 transition-transform">
                م
              </span>
              <div className="min-w-0">
                <span className="font-heading text-base sm:text-xl font-bold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors truncate block max-w-[210px] sm:max-w-none">
                  {profile.name}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#B8860B] font-semibold hidden sm:block">
                  Islamic Scholar & AAOIFI Sharia Consultant
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            <HeaderNav items={items} />
            
            <div className="flex items-center gap-3 sm:gap-4 border-s border-[#E0D8CE] ps-4 ms-2">
              <CommandSearch />
              <LocaleSwitcher />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2 shrink-0">
            <Link href="/search" className="p-2 text-[#636E72] hover:text-[#2D3436] transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 text-[#636E72] hover:text-[#2D3436] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
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
