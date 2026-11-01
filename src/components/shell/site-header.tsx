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
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E6E0D8]">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex-1 min-w-0 me-2 sm:me-6">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] bg-[#1A4D2E] text-[#FAF8F5] flex items-center justify-center font-heading font-bold text-base sm:text-lg border border-[#B8860B]/60 shrink-0">
                م
              </span>
              <div className="min-w-0">
                <span className="font-heading text-base sm:text-xl font-bold text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors truncate block max-w-[210px] sm:max-w-none">
                  {profile.name}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8C6D23] font-semibold hidden sm:block">
                  Islamic Scholar &amp; AAOIFI Sharia Consultant
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7 shrink-0">
            <HeaderNav items={items} />
            
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#143d24] transition-colors"
              title="Download Official Android App from Google Play Store"
            >
              <svg className="w-3.5 h-3.5 text-[#B8860B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.33-.2-.533-.564-.533-.969V2.783c0-.405.203-.769.532-.969zm11.597 11.598l2.38 2.38-12.062 6.845 9.682-9.225zm0-2.824L5.524 1.363l12.062 6.845-2.38 2.38zm1.414 1.412l3.473 1.968c.84.476.84 1.258 0 1.734l-3.473 1.968-2.121-2.121 2.121-2.121z"/>
              </svg>
              <span>ሸይኽ ሙሃመድ ፈረጅ App</span>
            </a>

            <div className="flex items-center gap-3 sm:gap-4 border-s border-[#E6E0D8] ps-4 ms-1">
              <CommandSearch />
              <LocaleSwitcher />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2 shrink-0">
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#1A4D2E]"
              aria-label="Google Play App"
              title="Download App"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.33-.2-.533-.564-.533-.969V2.783c0-.405.203-.769.532-.969zm11.597 11.598l2.38 2.38-12.062 6.845 9.682-9.225zm0-2.824L5.524 1.363l12.062 6.845-2.38 2.38zm1.414 1.412l3.473 1.968c.84.476.84 1.258 0 1.734l-3.473 1.968-2.121-2.121 2.121-2.121z"/>
              </svg>
            </a>
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
