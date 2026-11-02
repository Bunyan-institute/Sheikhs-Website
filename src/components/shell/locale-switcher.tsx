"use client";

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { localeLabels } from '@/i18n/config';
import { useState, useRef, useEffect } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel = localeLabels ? localeLabels[locale as keyof typeof localeLabels] : locale;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#EDF4F0]/85 hover:text-[#E6D3A3] transition-colors border border-[#EDF4F0]/20 hover:border-[#BF9A45]/50 rounded-full px-2.5 py-1 min-h-[32px]"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#BF9A45]" />
        <span className="font-arabic">{currentLabel}</span>
      </button>

      {isOpen && localeLabels && (
        <div className="absolute end-0 mt-2 w-44 rounded-xl bg-[#072118] shadow-2xl border border-[#BF9A45]/30 py-1.5 z-50 text-xs sm:text-sm backdrop-blur-md">
          {Object.entries(localeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleLocaleChange(key)}
              className={`w-full text-start px-4 py-2 font-sans transition-colors ${
                locale === key 
                  ? 'text-[#E6D3A3] font-semibold bg-[#0D3E2F] border-s-2 border-[#BF9A45]' 
                  : 'text-[#EDF4F0]/80 hover:text-[#E6D3A3] hover:bg-[#0D3E2F]/60'
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
