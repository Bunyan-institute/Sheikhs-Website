"use client";

import { useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { X, Menu } from 'lucide-react';
import LocaleSwitcher from './locale-switcher';
import { PwaInstallButton } from '@/components/pwa/pwa-install-button';
import type { PublicProfile } from '@/lib/api/types';
import type { NavItem } from '@/lib/sections';

export function MobileMenuButton() {
  const toggle = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-nav'));
  };
  return (
    <button 
      onClick={toggle}
      className="p-2 -me-2 text-[#EDF4F0]/80 hover:text-[#E6D3A3] transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  mainItems: NavItem[];
  moreItems: NavItem[];
  locale: string;
  profile: PublicProfile;
}

export default function MobileNav({ open, onClose, mainItems, moreItems, locale, profile }: MobileNavProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Trap focus
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);
  
  // Custom event listener for the button
  useEffect(() => {
    const handleToggle = () => {
      // Toggle support if dispatched
    };
    window.addEventListener('toggle-mobile-nav', handleToggle as EventListener);
    return () => window.removeEventListener('toggle-mobile-nav', handleToggle as EventListener);
  }, []);

  // Prevent scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        ref={drawerRef}
        tabIndex={-1}
        className="relative ms-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[#072118] text-[#EDF4F0] border-s border-[#BF9A45]/30 pb-6 shadow-2xl outline-none transition-transform"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#BF9A45]/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative grid place-items-center w-7 h-7 shrink-0">
              <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <g fill="none" stroke="#BF9A45" strokeWidth="1.4">
                  <rect x="8" y="8" width="24" height="24" />
                  <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
                </g>
              </svg>
              <span className="font-arabic text-[#E6D3A3] text-sm leading-none relative -mt-0.5">م</span>
            </span>
            <span className="font-display text-base font-semibold text-[#EDF4F0] truncate">
              {profile.name}
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-[#EDF4F0]/70 hover:text-[#E6D3A3] hover:bg-[#0D3E2F] transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 py-6">
          <nav className="flex flex-col space-y-5">
            <div className="space-y-2">
              {mainItems.map((item) => {
                const isGroup = item.href === '#';
                return (
                  <div key={item.key} className="flex flex-col">
                    {isGroup ? (
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-[#E6D3A3] px-2 pt-2 pb-1">
                        {t(item.labelKey as any)}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`font-sans text-base font-medium px-3.5 py-2.5 rounded-xl transition-colors hover:bg-[#0D3E2F] hover:text-[#E6D3A3] ${
                          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                            ? 'text-[#E6D3A3] font-semibold bg-[#0D3E2F] border-s-2 border-[#BF9A45]' 
                            : 'text-[#EDF4F0]/85'
                        }`}
                      >
                        {t(item.labelKey as any)}
                      </Link>
                    )}
                    {item.children && item.children.length > 0 && (
                      <div className="flex flex-col ps-3 mt-1 space-y-1 border-s-2 border-[#BF9A45]/20 ms-3">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.key}
                              href={child.href}
                              onClick={onClose}
                              className={`font-sans text-sm py-2 px-3 rounded-lg transition-colors hover:bg-[#0D3E2F] hover:text-[#E6D3A3] ${
                                isChildActive ? 'text-[#E6D3A3] font-semibold bg-[#0D3E2F]' : 'text-[#EDF4F0]/70'
                              }`}
                            >
                              {t(child.labelKey as any)}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="mt-auto px-5 py-6 border-t border-[#BF9A45]/20 flex flex-col gap-3">
          <PwaInstallButton className="w-full py-3" />
          <Link
            href="/ask"
            onClick={onClose}
            className="inline-flex items-center justify-center bg-[#BF9A45] text-[#072118] text-sm font-bold rounded-full py-3 hover:bg-[#E6D3A3] transition-colors shadow-sm min-h-[44px]"
          >
            Ask the Sheikh
          </Link>
          <div className="pt-2">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
