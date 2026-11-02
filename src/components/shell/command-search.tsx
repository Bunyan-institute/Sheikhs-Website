"use client";

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Command } from 'cmdk';
import { 
  Search, 
  X, 
  Book, 
  Video, 
  FileText, 
  GraduationCap, 
  Award, 
  Compass, 
  CheckCircle,
  MessageSquare,
  Calendar,
  Mail,
  Headphones,
  Layers
} from 'lucide-react';

interface QuickLink {
  title: string;
  href: string;
  category: "Scholar" | "Knowledge" | "Resources" | "Engagement";
  icon: any;
}

const QUICK_LINKS: QuickLink[] = [
  { title: "Scholar Biography & Profile", href: "/about", category: "Scholar", icon: Compass },
  { title: "Educational Journey & Timeline", href: "/journey", category: "Scholar", icon: GraduationCap },
  { title: "Academic Qualifications & Traditional Ijazat", href: "/qualifications", category: "Scholar", icon: Award },
  { title: "Media Hub & Africa TV Video Archive", href: "/media", category: "Knowledge", icon: Video },
  { title: "ሸይኽ ሙሃመድ ፈረጅ Official App (Google Play)", href: "https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej", category: "Resources", icon: Layers },
  { title: "Scholarly Articles & Hadith Studies", href: "/articles", category: "Knowledge", icon: FileText },
  { title: "Fatwas & Sharia Rulings", href: "/fatwas", category: "Knowledge", icon: CheckCircle },
  { title: "Structured Academic Courses", href: "/courses", category: "Knowledge", icon: Book },
  { title: "Conferences & Events Schedule", href: "/events", category: "Resources", icon: Calendar },
  { title: "Unified Media Gallery (Audio, Photos, Videos)", href: "/media", category: "Resources", icon: Headphones },
  { title: "Ask the Sheikh (Question Submission)", href: "/ask", category: "Engagement", icon: MessageSquare },
  { title: "Scholarly Office & Contact", href: "/contact", category: "Engagement", icon: Mail },
];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url as any);
    }
  };

  const filteredLinks = query.trim()
    ? QUICK_LINKS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_LINKS;

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-3 text-sm text-[#EDF2EE]/75 border border-[#EDF2EE]/15 rounded-full pl-3 pr-2 py-1.5 hover:border-[#BF9A45]/60 hover:text-[#EDF2EE] transition-colors"
        aria-label="Search lessons and archives"
      >
        <Search className="w-3.5 h-3.5 text-[#BF9A45]" />
        <span className="font-sans text-xs">Search lessons</span>
        <kbd className="text-[11px] bg-[#EDF2EE]/10 rounded px-1.5 py-0.5 font-sans">
          ⌘K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button 
        onClick={() => setOpen(true)}
        className="sm:hidden p-2 text-[#EDF2EE]/80 hover:text-[#EDF2EE]" 
        aria-label="Search lessons"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[12vh] px-4">
          <div className="fixed inset-0 bg-[#0A2532]/60 backdrop-blur-xs" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-[#14262E]/10 overflow-hidden text-[#14262E]">
            <Command className="w-full" label="Command Menu" shouldFilter={false}>
              <div className="flex items-center border-b border-[#14262E]/10 px-5 py-3">
                <Search className="w-4 h-4 text-[#1D6A5A] shrink-0" />
                <Command.Input 
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search lessons, series and topics..." 
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-base px-3 font-sans text-[#14262E] placeholder-[#14262E]/50" 
                  autoFocus
                />
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-xs text-[#14262E]/50 border border-[#14262E]/15 rounded px-2 py-1 hover:text-[#14262E]"
                  aria-label="Close"
                >
                  Esc
                </button>
              </div>
              
              <Command.List className="max-h-[55vh] overflow-y-auto p-2 overscroll-contain">
                {query.trim().length > 0 && (
                  <Command.Item
                    onSelect={() => handleSelect(`/search?q=${encodeURIComponent(query.trim())}`)}
                    className="flex items-center px-4 py-3 rounded-xl bg-[#EDF2EE] hover:bg-[#DDE7E1] cursor-pointer text-[#1D6A5A] font-semibold text-sm mb-1"
                  >
                    <Search className="w-4 h-4 me-3 shrink-0" />
                    <span>Search all portal archives for &quot;{query.trim()}&quot;</span>
                  </Command.Item>
                )}

                {filteredLinks.length > 0 ? (
                  <Command.Group heading={query ? "Matching Resources" : "Quick Navigation"} className="px-2 py-2 text-xs font-bold text-[#1D6A5A] uppercase tracking-wider">
                    {filteredLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.href}
                          onSelect={() => handleSelect(item.href)}
                          className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl hover:bg-[#EDF2EE] cursor-pointer text-[#14262E] font-medium text-sm transition-colors mb-0.5 group"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <Icon className="w-4 h-4 me-3 text-[#1D6A5A] shrink-0" />
                            <span className="group-hover:text-[#1D6A5A] transition-colors truncate">{item.title}</span>
                          </div>
                          <span className="text-[11px] text-[#14262E]/60 bg-[#EDF2EE] group-hover:bg-white border border-[#DDE7E1] px-2 py-0.5 rounded-full font-sans shrink-0">
                            {item.category}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ) : (
                  <Command.Empty className="py-12 text-center text-[#14262E]/60 text-sm">
                    No matching direct pages found. Press enter to search all content.
                  </Command.Empty>
                )}
              </Command.List>
              
              <div className="border-t border-[#14262E]/10 bg-[#EDF2EE]/50 px-4 py-2.5 flex items-center justify-between text-xs text-[#14262E]/60 font-medium">
                <div className="flex items-center gap-2">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-[#DDE7E1] rounded text-[10px]">Enter</kbd> to open</span>
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#DDE7E1] rounded text-[10px]">Esc</kbd> to close
                </div>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandSearch;
