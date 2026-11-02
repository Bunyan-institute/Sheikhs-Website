"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Star, ChevronRight, ChevronLeft, WifiOff, Headphones, ShieldCheck, Smartphone } from "lucide-react";

export function FloatingAppCard() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // On smaller screens, default to collapsed so it doesn't obstruct reading
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, []);

  return (
    <aside
      aria-label="Official Android App Quick Access"
      className="fixed end-0 top-1/2 -translate-y-1/2 z-50 select-none print:hidden"
    >
      {isOpen ? (
        <div className="w-[300px] sm:w-[320px] bg-[#FAF8F5] border border-[#B8860B]/40 border-e-0 rounded-s-[8px] shadow-2xl p-4 sm:p-5 text-[#2D3436] transition-transform duration-200">
          {/* Top Bar with Dismiss / Collapse button */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E0D8]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#1A4D2E]/10 text-[#1A4D2E] text-[11px] font-bold uppercase tracking-wider">
              <Smartphone className="w-3 h-3 text-[#B8860B]" />
              <span>Official Android App</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-[3px] text-[#7A8285] hover:text-[#1A4D2E] hover:bg-[#F2ECE1] transition-colors"
              aria-label="Collapse app card"
              title="Collapse / ደብቅ"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {/* App Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-[12px] overflow-hidden bg-white p-1 border border-[#B8860B]/40 shadow-xs">
                <Image
                  src="/images/sheikh-app-icon.png"
                  alt="ሸይኽ ሙሃመድ ፈረጅ App Icon"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-[8px]"
                />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-base text-[#2D3436] leading-tight truncate">
                ሸይኽ ሙሃመድ ፈረጅ
              </h4>
              <p className="text-[11px] text-[#8C6D23] font-semibold truncate mt-0.5">
                Africa Media Network (Africa TV)
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#555E61] mt-1">
                <span className="flex items-center gap-0.5 text-[#B8860B] font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  4.9
                </span>
                <span>•</span>
                <span>Free &amp; Offline</span>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="space-y-1.5 text-xs text-[#555E61] bg-white border border-[#E6E0D8] rounded-[4px] p-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#1A4D2E] shrink-0" />
              <span className="text-[11px]">ሙሉ ደርሶችን ያለ ኢንተርኔት ያዳምጡ</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-[#1A4D2E] shrink-0" />
              <span className="text-[11px]">ከበስተጀርባ (Background) ማጫወት</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A4D2E] shrink-0" />
              <span className="text-[11px]">100% ነፃ • ምንም ማስታወቂያ የሌለው</span>
            </div>
          </div>

          {/* Action CTA */}
          <a
            href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1A4D2E] text-white font-bold text-xs hover:bg-[#143d24] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Install from Google Play</span>
          </a>
        </div>
      ) : (
        /* Collapsed Trigger Button - docks smoothly on edge */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#FAF8F5] border border-[#B8860B]/50 border-e-0 rounded-s-[8px] py-2.5 px-2 shadow-lg hover:bg-white text-[#1A4D2E] transition-all"
          aria-label="Open ሸይኽ ሙሃመድ ፈረጅ App Download Card"
          title="ሸይኽ ሙሃመድ ፈረጅ App"
        >
          <ChevronLeft className="w-4 h-4 text-[#8C6D23] group-hover:text-[#1A4D2E] rtl:rotate-180" />
          <div className="w-7 h-7 rounded-[7px] overflow-hidden bg-white p-0.5 border border-[#B8860B]/40 shrink-0">
            <Image
              src="/images/sheikh-app-icon.png"
              alt="ሸይኽ ሙሃመድ ፈረጅ App Icon"
              width={28}
              height={28}
              className="w-full h-full object-cover rounded-[5px]"
            />
          </div>
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold tracking-wider text-[#2D3436] group-hover:text-[#1A4D2E]">
            ሸይኽ ሙሃመድ ፈረጅ App
          </span>
        </button>
      )}
    </aside>
  );
}

export default FloatingAppCard;
