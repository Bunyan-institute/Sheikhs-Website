"use client";

import Image from "next/image";
import { Download, CheckCircle2, ShieldCheck, Headphones, WifiOff, Star, Smartphone, ExternalLink } from "lucide-react";

export function AppShowcaseSection() {
  return (
    <section className="py-12 border-b border-[#E6E0D8]">
      <div className="bg-[#FAF8F5] border border-[#B8860B]/40 rounded-[6px] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative geometric background hairline */}
        <div className="absolute top-0 end-0 w-64 h-64 bg-[#1A4D2E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
          {/* App Icon & Badge Display */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 shrink-0 text-center sm:text-start">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden bg-white p-2 border-2 border-[#1A4D2E]/20 shadow-md">
                <Image
                  src="/images/sheikh-app-icon.png"
                  alt="ሸይኽ ሙሃመድ ፈረጅ Official Android App"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-[16px]"
                  priority
                />
              </div>
              <div className="absolute -bottom-2 end-0 bg-[#1A4D2E] text-[#FAF8F5] text-[10px] font-bold px-2.5 py-0.5 rounded-[4px] border border-[#B8860B]/50 shadow-xs flex items-center gap-1">
                <span>Google Play</span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-[#1A4D2E]/10 text-[#1A4D2E] text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Official Mobile App</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436]">
                &ldquo;ሸይኽ ሙሃመድ ፈረጅ&rdquo;
              </h3>
              <p className="text-xs text-[#8C6D23] font-semibold">
                Africa Media Network (አፍሪካ ሚዲያ ኔትወርክ)
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-[#555E61]">
                <div className="flex items-center gap-1 text-[#B8860B] font-bold">
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
            <div className="bg-white border border-[#E6E0D8] p-3.5 rounded-[4px] flex items-start gap-3">
              <WifiOff className="w-4 h-4 text-[#1A4D2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-xs font-bold text-[#2D3436]">100% Offline Audio</h5>
                <p className="text-[11px] text-[#555E61] leading-relaxed">ትምህርቶችን አንድ ጊዜ አውርደው ያለ በይነመረብ በየትኛውም ቦታ ያዳምጡ።</p>
              </div>
            </div>

            <div className="bg-white border border-[#E6E0D8] p-3.5 rounded-[4px] flex items-start gap-3">
              <Headphones className="w-4 h-4 text-[#1A4D2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-xs font-bold text-[#2D3436]">Background Playback</h5>
                <p className="text-[11px] text-[#555E61] leading-relaxed">ስልክዎ ተዘግቶም ሆነ በሌሎች መተግበሪያዎች ሲጠቀሙ ያለማቋረጥ ይቀጥላል።</p>
              </div>
            </div>

            <div className="bg-white border border-[#E6E0D8] p-3.5 rounded-[4px] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#1A4D2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-xs font-bold text-[#2D3436]">100% Free &amp; Ad-Free</h5>
                <p className="text-[11px] text-[#555E61] leading-relaxed">ምንም አይነት ማስታወቂያ የሌለው ንጹህ የዳዕዋና የትምህርት መተግበሪያ።</p>
              </div>
            </div>

            <div className="bg-white border border-[#E6E0D8] p-3.5 rounded-[4px] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#1A4D2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-xs font-bold text-[#2D3436]">Complete Africa TV Catalog</h5>
                <p className="text-[11px] text-[#555E61] leading-relaxed">የሪያዱ ሷሊሂን፣ የነገረ ሐጅ እና የተሟላ የደርስ ዝርዝር በአንድ ቦታ።</p>
              </div>
            </div>
          </div>

          {/* Primary Download CTA Button */}
          <div className="shrink-0 flex flex-col items-center gap-2.5 w-full sm:w-auto">
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-[4px] bg-[#1A4D2E] text-white font-bold text-sm sm:text-base border border-[#143d24] shadow-sm hover:bg-[#143d24] transition-colors"
            >
              <Download className="w-5 h-5 text-[#B8860B]" />
              <div className="text-start">
                <span className="block text-[10px] uppercase tracking-wider text-white/80 font-normal">GET IT ON</span>
                <span className="block text-sm font-bold leading-tight">Google Play Store</span>
              </div>
            </a>
            <span className="text-[11px] text-[#555E61] text-center font-medium">
              Free • Android 5.0 and up • 24MB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
