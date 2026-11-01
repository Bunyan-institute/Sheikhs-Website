"use client";

import { useState, useRef } from 'react';
import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { NavItem } from '@/lib/sections';
import { ChevronDown } from 'lucide-react';

export default function HeaderNav({ items }: { items: NavItem[] }) {
  const t = useTranslations();
  const pathname = usePathname();
  
  return (
    <nav className="flex items-center gap-5 lg:gap-6">
      {items.map((item, idx) => {
        const hasChildren = item.children && item.children.length > 0;
        const isChildActive = hasChildren && item.children?.some(c => 
          pathname === c.href || (c.href !== '/' && pathname.startsWith(c.href))
        );
        const isActive = (item.href !== '#' && pathname.startsWith(item.href)) || Boolean(isChildActive);
        const isLast = idx >= items.length - 2;
        
        if (hasChildren) {
          return (
            <DropdownNavItem 
              key={item.key} 
              item={item} 
              isActive={isActive} 
              label={t(item.labelKey as any)}
              alignEnd={isLast}
            />
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`font-body text-sm font-medium transition-colors ${
              isActive ? 'text-[#1A4D2E] font-bold border-b-2 border-[#1A4D2E] pb-0.5' : 'text-[#555E61] hover:text-[#1A4D2E]'
            }`}
          >
            {t(item.labelKey as any)}
          </Link>
        );
      })}
    </nav>
  );
}

function DropdownNavItem({ item, isActive, label, alignEnd }: { item: NavItem, isActive: boolean, label: string, alignEnd?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations();
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center font-body text-sm font-medium transition-colors ${
          isActive || isOpen ? 'text-[#1A4D2E] font-bold' : 'text-[#555E61] hover:text-[#1A4D2E]'
        }`}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown className={`ms-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full ${alignEnd ? 'end-0' : 'start-0'} mt-2 w-52 rounded-[4px] bg-[#FAF8F5] shadow-md border border-[#E6E0D8] py-1.5 z-50`}>
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.key}
                href={child.href}
                className={`block px-4 py-2 font-body text-sm transition-colors ${
                  isChildActive 
                    ? 'text-[#1A4D2E] font-bold bg-[#1A4D2E]/10 border-s-2 border-[#1A4D2E]' 
                    : 'text-[#555E61] hover:text-[#1A4D2E] hover:bg-black/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t(child.labelKey as any)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
