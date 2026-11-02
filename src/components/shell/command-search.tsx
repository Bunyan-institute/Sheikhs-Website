"use client";

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
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

interface QuickLink {
  title: string;
  href: string;
  category: string;
  icon: any;
}

const QUICK_LINKS: QuickLink[] = [
  { title: "Riyad us-Saliheen Playlist (Africa TV)", href: "/media", category: "Media", icon: Video },
  { title: "Watch Lectures & Sermons", href: "/media", category: "Media", icon: Video },
  { title: "350+ Hours Darasa Audio Archive", href: "/media?kind=audio", category: "Media", icon: Video },
  { title: "All Articles & Written Lessons", href: "/articles", category: "Articles", icon: FileText },
  { title: "Tarbiyah & Spiritual Reflections", href: "/articles", category: "Articles", icon: FileText },
  { title: "Fatwas & Legal Rulings Archive", href: "/fatwas", category: "Fatwas", icon: BookOpen },
  { title: "Ask the Sheikh a Question", href: "/ask", category: "Fatwas", icon: HelpCircle },
  { title: "Educational Courses & Halaqat", href: "/courses", category: "Courses", icon: GraduationCap },
  { title: "Upcoming Seminars & Gatherings", href: "/events", category: "Events", icon: Calendar },
  { title: "Verify Course Certificate", href: "/verify", category: "Certificate", icon: Award },
  { title: "Scholar Biography & Profile", href: "/about", category: "About", icon: User },
  { title: "Scholarly Journey & Timeline", href: "/journey", category: "About", icon: Compass },
  { title: "Academic & Traditional Qualifications", href: "/qualifications", category: "About", icon: Award },
  { title: "Contact Office & Foundation", href: "/contact", category: "Contact", icon: PhoneCall },
];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

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
    ? QUICK_LINKS 
    : QUICK_LINKS.filter(link => 
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
        <span>Search...</span>
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
                  placeholder="Search lessons, series and topics..." 
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
                    <span>Search all portal archives for &quot;{query.trim()}&quot;</span>
                  </Command.Item>
                )}

                {filteredLinks.length > 0 ? (
                  <Command.Group heading={query ? "Matching Resources" : "Quick Navigation"} className="px-2 py-2 text-xs font-bold text-[#1B6A50] uppercase tracking-wider">
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
                    No matching direct pages found. Press enter to search all content.
                  </Command.Empty>
                )}
              </Command.List>

              <div className="flex items-center justify-between border-t border-[#0F241C]/10 px-5 py-2.5 bg-[#EDF4F0]/50 text-xs text-[#0F241C]/60">
                <span className="font-arabic text-[#1B6A50]">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                <span className="text-[11px]">Use ↑↓ to navigate • ↵ to open</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandSearch;
