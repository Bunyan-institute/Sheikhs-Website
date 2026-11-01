"use client";

import { useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { X, Menu } from 'lucide-react';
import LocaleSwitcher from './locale-switcher';
import type { PublicProfile } from '@/lib/api/types';
import type { NavItem } from '@/lib/sections';

export function MobileMenuButton() {
  const toggle = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-nav'));
  };
  return (
    <button 
      onClick={toggle}
      className="p-2 -me-2 text-[#636E72] hover:text-[#2D3436] transition-colors"
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
      // The parent needs to implement toggling to pass 'open' prop properly
      // If we don't have a parent handling this event, we'd need internal state.
      // Assuming parent manages the toggle if it provides open and onClose.
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        ref={drawerRef}
        tabIndex={-1}
        className="relative ms-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[#FAF8F5] pb-6 shadow-xl outline-none transition-transform"
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#E6E0D8]">
          <span className="font-heading text-lg font-bold text-[#2D3436] truncate px-2">
            {profile.name}
          </span>
          <button
            type="button"
            className="rounded-[3px] p-2 text-[#7A8285] hover:text-[#2D3436]"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 py-6">
          <nav className="flex flex-col space-y-6">
            <div className="space-y-4">
              {mainItems.map((item) => {
                const isGroup = item.href === '#';
                return (
                  <div key={item.key} className="flex flex-col">
                    {isGroup ? (
                      <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#1A4D2E] px-2 pt-2 pb-1">
                        {t(item.labelKey as any)}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`font-body text-base font-medium px-2 py-1.5 rounded-[3px] hover:bg-black/5 ${
                          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                            ? 'text-[#1A4D2E] font-bold bg-[#1A4D2E]/10 border-s-2 border-[#1A4D2E]' 
                            : 'text-[#2D3436]'
                        }`}
                      >
                        {t(item.labelKey as any)}
                      </Link>
                    )}
                    {item.children && item.children.length > 0 && (
                      <div className="flex flex-col ps-3 mt-1 space-y-1 border-s-2 border-[#E6E0D8] ms-2">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.key}
                              href={child.href}
                              onClick={onClose}
                              className={`font-body text-sm py-1.5 px-2 rounded-[3px] hover:bg-black/5 ${
                                isChildActive ? 'text-[#1A4D2E] font-bold bg-[#1A4D2E]/10' : 'text-[#555E61]'
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

        <div className="mt-auto px-6 py-6 border-t border-[#E6E0D8]">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
