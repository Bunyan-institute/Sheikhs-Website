"use client";

import Image from "next/image";
import { Download, CheckCircle2, ShieldCheck, Headphones, WifiOff, Star, Smartphone } from "lucide-react";

export function AppShowcaseSection() {
  return (
    <section className="py-12 border-b border-[#072118]/10">
      <div className="bg-[#072118] text-[#EDF4F0] border border-[#BF9A45]/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative emerald blur background */}
        <div className="absolute top-0 end-0 w-80 h-80 bg-[#1B6A50]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-[#0D3E2F]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
          {/* App Icon & Badge Display */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 shrink-0 text-center sm:text-start">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-white/10 p-2 border-2 border-[#BF9A45]/40 shadow-xl backdrop-blur-xs">
                <Image
                  src="/images/sheikh-app-icon.png"
                  alt="ሸይኽ ሙሃመድ ፈረጅ Official Android App"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-2xl"
                  priority
                />
              </div>
              <div className="absolute -bottom-2 end-0 bg-[#BF9A45] text-[#072118] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#E6D3A3] shadow-md flex items-center gap-1 uppercase tracking-wider">
                <span>Google Play</span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B6A50]/30 text-[#E6D3A3] text-xs font-bold uppercase tracking-wider border border-[#BF9A45]/30">
                <Smartphone className="w-3.5 h-3.5 text-[#BF9A45]" />
                <span>Official Mobile App</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                &ldquo;ሸይኽ ሙሃመድ ፈረጅ&rdquo;
              </h3>
              <p className="text-xs text-[#E6D3A3] font-semibold">
                Africa Media Network (አፍሪካ ሚዲያ ኔትወርክ)
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-[#EDF4F0]/70">
                <div className="flex items-center gap-1 text-[#BF9A45] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9 / 5.0</span>
                </div>
                <span>•</span>
                <span>10,000+ Downloads</span>
                <span>•</span>
                <span>Rated 3+</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            <div className="bg-[#0D3E2F]/60 border border-[#BF9A45]/20 p-3.5 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
              <WifiOff className="w-4 h-4 text-[#BF9A45] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-xs font-bold text-white">100% Offline Audio</h5>
                <p className="text-[11px] text-[#EDF4F0]/70 leading-relaxed">ትምህርቶችን አንድ ጊዜ አውርደው ያለ በይነመረብ በየትኛውም ቦታ ያዳምጡ።</p>
              </div>
            </div>

            <div className="bg-[#0D3E2F]/60 border border-[#BF9A45]/20 p-3.5 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
              <Headphones className="w-4 h-4 text-[#BF9A45] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-xs font-bold text-white">Background Playback</h5>
                <p className="text-[11px] text-[#EDF4F0]/70 leading-relaxed">ስልክዎ ተዘግቶም ሆነ በሌሎች መተግበሪያዎች ሲጠቀሙ ያለማቋረጥ ይቀጥላል።</p>
              </div>
            </div>

            <div className="bg-[#0D3E2F]/60 border border-[#BF9A45]/20 p-3.5 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-[#BF9A45] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-xs font-bold text-white">100% Free &amp; Ad-Free</h5>
                <p className="text-[11px] text-[#EDF4F0]/70 leading-relaxed">ምንም አይነት ማስታወቂያ የሌለው ንጹህ የዳዕዋና የትምህርት መተግበሪያ።</p>
              </div>
            </div>

            <div className="bg-[#0D3E2F]/60 border border-[#BF9A45]/20 p-3.5 rounded-2xl flex items-start gap-3 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-[#BF9A45] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-xs font-bold text-white">Complete Africa TV Catalog</h5>
                <p className="text-[11px] text-[#EDF4F0]/70 leading-relaxed">የሪያዱ ሷሊሂን፣ የነገረ ሐጅ እና የተሟላ የደርስ ዝርዝር በአንድ ቦታ።</p>
              </div>
            </div>
          </div>

          {/* Primary Download CTA Button */}
          <div className="shrink-0 flex flex-col items-center gap-2.5 w-full sm:w-auto">
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold text-sm sm:text-base border border-[#E6D3A3] shadow-md transition-all cursor-pointer min-h-[48px]"
            >
              <Download className="w-5 h-5 text-[#072118]" />
              <div className="text-start">
                <span className="block text-[10px] uppercase tracking-wider text-[#072118]/80 font-semibold">GET IT ON</span>
                <span className="block text-sm font-extrabold leading-tight">Google Play Store</span>
              </div>
            </a>
            <span className="text-[11px] text-[#EDF4F0]/60 text-center font-medium">
              Free • Android 5.0 and up • 24MB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
