"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Star, ChevronRight, ChevronLeft, WifiOff, Headphones, ShieldCheck, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export function FloatingAppCard({ playStoreUrl }: { playStoreUrl?: string }) {
  const [isOpen, setIsOpen] = useState(true);

  let t = (key: string) => key;
  try {
    t = useTranslations("appShowcase");
  } catch {
    // fallback
  }

  useEffect(() => {
    // On smaller screens (<1024px), default to collapsed so it doesn't obstruct reading
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, []);

  const badgeText = t("badge") !== "badge" ? t("badge") : "Official Android App";
  const titleText = t("title") !== "title" ? t("title") : "ሸይኽ ሙሃመድ ፈረጅ";
  const publisherText = t("publisher") !== "publisher" ? t("publisher") : "Africa Media Network";
  const feat1 = t("offlineFeature") !== "offlineFeature" ? t("offlineFeature") : "100% Offline Audio";
  const feat2 = t("backgroundFeature") !== "backgroundFeature" ? t("backgroundFeature") : "Background Playback";
  const feat3 = t("adFreeFeature") !== "adFreeFeature" ? t("adFreeFeature") : "100% Free & Ad-Free";
  const ctaBtn = t("downloadButton") !== "downloadButton" ? t("downloadButton") : "Install from Google Play";

  if (!playStoreUrl) return null;

  return (
    <aside
      aria-label="Official Android App Quick Access"
      className="fixed end-0 top-1/2 -translate-y-1/2 z-50 select-none print:hidden max-w-[calc(100vw-1rem)]"
    >
      {isOpen ? (
        <div className="w-[290px] sm:w-[320px] bg-[#072118] text-[#EDF4F0] border border-[#BF9A45]/40 border-e-0 rounded-s-2xl shadow-2xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-md transition-all duration-300">
          <div className="absolute inset-0 lattice opacity-25 pointer-events-none" aria-hidden="true" />
          
          {/* Top Bar with Dismiss / Collapse button */}
          <div className="relative flex items-center justify-between pb-3 mb-3 border-b border-[#BF9A45]/20">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B6A50]/30 text-[#E6D3A3] text-[11px] font-semibold border border-[#1B6A50]/50">
              <Smartphone className="w-3 h-3 text-[#BF9A45]" />
              <span>{badgeText}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#EDF4F0]/70 hover:text-[#E6D3A3] hover:bg-[#0D3E2F] transition-colors cursor-pointer"
              aria-label="Collapse app card"
              title="Collapse"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {/* App Header */}
          <div className="relative flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-0.5 border border-[#BF9A45]/60 shadow-sm">
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
              <h4 className="font-display font-bold text-base text-[#EDF4F0] leading-tight truncate">
                {titleText}
              </h4>
              <p className="text-[11px] text-[#E6D3A3] font-medium truncate mt-0.5">
                {publisherText}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#EDF4F0]/70 mt-1">
                <span className="flex items-center gap-0.5 text-[#BF9A45] font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  4.9
                </span>
                <span>•</span>
                <span>10,000+ Downloads</span>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="relative space-y-1.5 text-xs text-[#EDF4F0]/85 bg-[#0D3E2F]/70 border border-[#BF9A45]/20 rounded-xl p-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px] font-medium">{feat1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px] font-medium">{feat2}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
              <span className="text-[11px] font-medium">{feat3}</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="relative">
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold text-xs transition-colors shadow-sm min-h-[40px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#072118]" />
              <span>{ctaBtn}</span>
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#072118] text-[#EDF4F0] border border-[#BF9A45]/50 border-e-0 rounded-s-2xl shadow-xl px-3 py-3 hover:bg-[#0D3E2F] hover:border-[#BF9A45] transition-all cursor-pointer"
          aria-label="Expand mobile app quick access"
        >
          <ChevronLeft className="w-4 h-4 text-[#BF9A45] group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-white p-0.5 border border-[#BF9A45]/50 shrink-0">
            <Image
              src="/images/sheikh-app-icon.png"
              alt="ሸይኽ ሙሃመድ ፈረጅ"
              width={28}
              height={28}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="text-start leading-none hidden sm:block">
            <span className="block text-[9px] uppercase tracking-wider text-[#BF9A45] font-bold">App</span>
            <span className="block text-xs font-bold text-[#EDF4F0] mt-0.5">Google Play</span>
          </div>
        </button>
      )}
    </aside>
  );
}

export default FloatingAppCard;
