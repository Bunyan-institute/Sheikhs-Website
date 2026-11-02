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
        <div className="w-[300px] sm:w-[320px] bg-[#0A2532] text-[#EDF2EE] border border-[#BF9A45]/40 border-e-0 rounded-s-2xl shadow-2xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-md transition-transform duration-200">
          <div className="absolute inset-0 lattice opacity-25 pointer-events-none" aria-hidden="true" />
          
          {/* Top Bar with Dismiss / Collapse button */}
          <div className="relative flex items-center justify-between pb-3 mb-3 border-b border-[#BF9A45]/20">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D6A5A]/30 text-[#E6D3A3] text-[11px] font-semibold border border-[#1D6A5A]/50">
              <Smartphone className="w-3 h-3 text-[#BF9A45]" />
              <span>Official Android App</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#EDF2EE]/60 hover:text-[#E6D3A3] hover:bg-[#0F3446] transition-colors"
              aria-label="Collapse app card"
              title="Collapse / ደብቅ"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {/* App Header */}
          <div className="relative flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-0.5 border border-[#BF9A45]/60 shadow-xs">
                <Image
                  src="/images/sheikh-app-icon.png"
                  alt="ሸይኽ ሙሃመድ ፈረጅ App Icon"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-base text-[#EDF2EE] leading-tight truncate">
                ሸይኽ ሙሃመድ ፈረጅ
              </h4>
              <p className="text-[11px] text-[#E6D3A3] font-medium truncate mt-0.5">
                Africa Media Network (Africa TV)
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#EDF2EE]/70 mt-1">
                <span className="flex items-center gap-0.5 text-[#BF9A45] font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  4.9
                </span>
                <span>•</span>
                <span>Free &amp; Offline</span>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="relative space-y-1.5 text-xs text-[#EDF2EE]/80 bg-[#0F3446]/60 border border-[#BF9A45]/20 rounded-xl p-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px]">ሙሉ ደርሶችን ያለ ኢንተርኔት ያዳምጡ</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px]">ከበስተጀርባ (Background) ማጫወት</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px]">100% ነፃ • ምንም ማስታወቂያ የሌለው</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="relative">
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#BF9A45] text-[#0A2532] font-semibold text-xs hover:bg-[#E6D3A3] transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#0A2532]" />
              <span>Install from Google Play</span>
            </a>
          </div>
        </div>
      ) : (
        /* Collapsed Trigger Button - docks smoothly on edge */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#0A2532] border border-[#BF9A45]/50 border-e-0 rounded-s-xl py-2.5 px-2 shadow-2xl hover:bg-[#0F3446] text-[#E6D3A3] transition-all"
          aria-label="Open ሸይኽ ሙሃመድ ፈረጅ App Download Card"
          title="ሸይኽ ሙሃመድ ፈረጅ App"
        >
          <ChevronLeft className="w-4 h-4 text-[#BF9A45] group-hover:text-[#E6D3A3] rtl:rotate-180" />
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-white p-0.5 border border-[#BF9A45]/50 shrink-0">
            <Image
              src="/images/sheikh-app-icon.png"
              alt="ሸይኽ ሙሃመድ ፈረጅ App Icon"
              width={28}
              height={28}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold tracking-wider text-[#EDF2EE] group-hover:text-[#E6D3A3]">
            ሸይኽ ሙሃመድ ፈረጅ App
          </span>
        </button>
      )}
    </aside>
  );
}

export default FloatingAppCard;
