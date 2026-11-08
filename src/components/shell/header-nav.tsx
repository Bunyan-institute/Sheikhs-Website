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
    <nav aria-label="Main Navigation" className="flex items-center gap-3.5 lg:gap-4 xl:gap-6 shrink-0">
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
            className={`font-sans text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
              isActive ? 'text-[#E6D3A3] font-semibold border-b-2 border-[#BF9A45] pb-0.5' : 'text-[#EDF4F0]/85 hover:text-[#E6D3A3]'
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
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center font-sans text-xs xl:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
          isActive || isOpen ? 'text-[#E6D3A3] font-semibold' : 'text-[#EDF4F0]/85 hover:text-[#E6D3A3]'
        }`}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown className={`ms-1 w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full ${alignEnd ? 'end-0' : 'start-0'} mt-2 w-52 rounded-xl bg-[#072118] shadow-2xl border border-[#BF9A45]/30 py-1.5 z-50 backdrop-blur-md`}>
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.key}
                href={child.href}
                className={`block px-4 py-2 font-sans text-sm transition-colors ${
                  isChildActive 
                    ? 'text-[#E6D3A3] font-semibold bg-[#0D3E2F] border-s-2 border-[#BF9A45]' 
                    : 'text-[#EDF4F0]/80 hover:text-[#E6D3A3] hover:bg-[#0D3E2F]/60'
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
