"use client";

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Command } from 'cmdk';
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  Calendar, 
  Award, 
  User, 
  Compass, 
  PhoneCall,
  GraduationCap
} from 'lucide-react';

export function CommandSearch() {
  const t = useTranslations("commandSearch");
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const quickLinks = [
    { title: `${tNav("media")} & ${tNav("lectures")}`, href: "/media", category: t("lectures"), icon: Video },
    { title: tNav("articles"), href: "/articles", category: t("articles"), icon: FileText },
    { title: tNav("fatwas"), href: "/fatwas", category: t("fatwas"), icon: BookOpen },
    { title: tNav("ask"), href: "/ask", category: t("fatwas"), icon: HelpCircle },
    { title: tNav("courses"), href: "/courses", category: t("courses"), icon: GraduationCap },
    { title: tNav("series"), href: "/series", category: t("lectures"), icon: BookOpen },
    { title: tNav("library"), href: "/library", category: t("library"), icon: BookOpen },
    { title: tNav("events"), href: "/events", category: tNav("events"), icon: Calendar },
    { title: tNav("verify"), href: "/verify", category: tNav("verify"), icon: Award },
    { title: tNav("about"), href: "/about", category: tNav("about"), icon: User },
    { title: tNav("journey"), href: "/journey", category: tNav("about"), icon: Compass },
    { title: tNav("qualifications"), href: "/qualifications", category: tNav("about"), icon: Award },
    { title: tNav("contact"), href: "/contact", category: tNav("contact"), icon: PhoneCall },
  ];

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const filteredLinks = query.trim() === "" 
    ? quickLinks 
    : quickLinks.filter(link => 
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D3E2F]/60 hover:bg-[#0D3E2F] text-xs text-[#EDF4F0]/80 hover:text-[#E6D3A3] border border-[#BF9A45]/30 transition-colors shadow-xs"
        aria-label="Search portal"
      >
        <Search className="w-3.5 h-3.5 text-[#BF9A45]" />
        <span>{t("placeholder").slice(0, 18)}...</span>
        <kbd className="hidden md:inline-block ms-1.5 px-1.5 py-0.5 text-[10px] font-semibold text-[#EDF4F0]/70 bg-[#072118]/80 border border-[#BF9A45]/30 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button 
        onClick={() => setOpen(true)}
        className="sm:hidden p-2 text-[#EDF4F0]/85 hover:text-[#E6D3A3] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" 
        aria-label="Search lessons"
      >
        <Search className="w-5 h-5 text-[#BF9A45]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[12vh] px-4">
          <div className="fixed inset-0 bg-[#072118]/70 backdrop-blur-xs" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-[#0F241C]/10 overflow-hidden text-[#0F241C]">
            <Command className="w-full" label="Command Menu" shouldFilter={false}>
              <div className="flex items-center border-b border-[#0F241C]/10 px-5 py-3">
                <Search className="w-4 h-4 text-[#1B6A50] shrink-0" />
                <Command.Input 
                  value={query}
                  onValueChange={setQuery}
                  placeholder={t("placeholder")} 
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-base px-3 font-sans text-[#0F241C] placeholder-[#0F241C]/50" 
                  autoFocus
                />
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-xs text-[#0F241C]/60 border border-[#0F241C]/15 rounded px-2 py-1 hover:text-[#0F241C]"
                  aria-label="Close"
                >
                  Esc
                </button>
              </div>
              
              <Command.List className="max-h-[55vh] overflow-y-auto p-2 overscroll-contain">
                {query.trim().length > 0 && (
                  <Command.Item
                    onSelect={() => handleSelect(`/search?q=${encodeURIComponent(query.trim())}`)}
                    className="flex items-center px-4 py-3 rounded-xl bg-[#EDF4F0] hover:bg-[#DCE8E1] cursor-pointer text-[#1B6A50] font-semibold text-sm mb-1"
                  >
                    <Search className="w-4 h-4 me-3 shrink-0" />
                    <span>{t("placeholder")} &quot;{query.trim()}&quot;</span>
                  </Command.Item>
                )}

                {filteredLinks.length > 0 ? (
                  <Command.Group heading={t("quickNav")} className="px-2 py-2 text-xs font-bold text-[#1B6A50] uppercase tracking-wider">
                    {filteredLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.href}
                          onSelect={() => handleSelect(item.href)}
                          className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl hover:bg-[#EDF4F0] cursor-pointer text-[#0F241C] font-medium text-sm transition-colors mb-0.5 group"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <Icon className="w-4 h-4 me-3 text-[#1B6A50] shrink-0" />
                            <span className="group-hover:text-[#1B6A50] transition-colors truncate">{item.title}</span>
                          </div>
                          <span className="text-[11px] text-[#0F241C]/60 bg-[#EDF4F0] group-hover:bg-white border border-[#DCE8E1] px-2 py-0.5 rounded-full font-sans shrink-0">
                            {item.category}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ) : (
                  <Command.Empty className="py-12 text-center text-[#0F241C]/60 text-sm">
                    {t("noResults")}
                  </Command.Empty>
                )}
              </Command.List>

              <div className="flex items-center justify-between border-t border-[#0F241C]/10 px-5 py-2.5 bg-[#EDF4F0]/50 text-xs text-[#0F241C]/60">
                <span className="font-arabic text-[#1B6A50]">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                <span className="text-[11px]">↑↓ {t("select")} • Esc {t("close")}</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandSearch;
