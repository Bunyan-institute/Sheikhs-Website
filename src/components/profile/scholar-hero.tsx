import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BookOpen, GraduationCap, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ScholarHeroProps {
  name: string;
  headline: string | null;
  biography: string | null;
  photoUrl: string | null;
  locale: string;
}

export function ScholarHero({ name, headline, biography, photoUrl, locale }: ScholarHeroProps) {
  return (
    <section className="py-8 sm:py-12 lg:py-16 border-b border-[#E0D8CE]">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-14 items-center justify-between">
        <div className="flex-1 space-y-5 lg:space-y-6 min-w-0 w-full">
          {/* Islamic Honorific Header Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#B8860B]/30 text-[#2D3436] text-xs font-medium shadow-xs">
              <span className="font-arabic text-[#1B5E20] font-bold text-sm" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span className="text-[#B8860B] font-bold">۞</span>
              <span className="text-[#B8860B] font-semibold uppercase tracking-wider text-[11px]">Islamic Scholar & Jurist</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#1B5E20] font-semibold bg-[#E8F5E9] border border-[#1B5E20]/20 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authentic Sanad
            </span>
          </div>

          <div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3436] leading-[1.15] tracking-tight break-words">
              {name}
            </h1>
            {headline && (
              <p className="mt-3 text-lg sm:text-xl md:text-2xl text-[#1B5E20] font-semibold font-heading">
                {headline}
              </p>
            )}
          </div>

          {/* Scholarly Badges */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E0D8CE] text-[#2D3436] shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#B8860B]" /> AAOIFI Certified Sharia Auditor
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E0D8CE] text-[#2D3436] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" /> African Scholars Union Member
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E0D8CE] text-[#2D3436] shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-[#B8860B]" /> President, Al-Fajr Islamic Foundation
            </span>
          </div>

          {biography && (
            <p className="text-[#636E72] text-base sm:text-lg leading-relaxed max-w-3xl font-body break-words">
              {biography.length > 320 ? `${biography.slice(0, 320)}...` : biography}
            </p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
            <Link 
              href="/lectures"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[4px] bg-[#1B5E20] text-white font-medium hover:bg-[#154a19] transition-all shadow-sm hover:shadow-md text-center text-sm sm:text-base"
            >
              <BookOpen className="w-4 h-4" /> Explore Lectures & Discourses
            </Link>
            <Link 
              href="/library"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-[4px] bg-[#FAF8F5] border border-[#1B5E20] text-[#1B5E20] font-semibold hover:bg-[#1B5E20] hover:text-white transition-all text-center text-sm sm:text-base shadow-xs"
            >
              Public Kitabs & Treatises
            </Link>
            <Link 
              href="/ask"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-[4px] bg-white border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-[#FAF8F5] text-[#2D3436] font-medium transition-all text-center text-sm sm:text-base shadow-xs"
            >
              Ask the Sheikh
            </Link>
          </div>

          {/* Official Media Channels */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <span className="text-[#636E72] font-semibold uppercase tracking-wider text-[11px]">Official Channels:</span>
            <a
              href="https://www.tiktok.com/@ustazmuhammadferej0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] text-white hover:bg-black transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.65z"/></svg>
              <span>TikTok (297K+)</span>
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CC0000] text-white hover:bg-[#b00000] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube Channel</span>
            </a>
            <a
              href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2] text-white hover:bg-[#1260c7] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook (330K+)</span>
            </a>
            <a
              href="https://t.me/ustazmuhammadferej"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#229ED9] text-white hover:bg-[#1b7fae] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.941z"/></svg>
              <span>Telegram</span>
            </a>
          </div>
        </div>

        {/* Scholar Portrait Frame */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 shrink-0 rounded-lg p-2.5 bg-white border border-[#E0D8CE] shadow-md relative">
          <div className="w-full h-full rounded-[6px] overflow-hidden relative bg-[#FAF8F5] flex items-center justify-center border border-[#E0D8CE]/60">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="text-7xl font-heading font-bold text-[#1B5E20]">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-3 start-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
            Official Scholar Portal
          </div>
        </div>
      </div>

      {/* Scholarly Highlights Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-8 border-t border-[#E0D8CE]/70">
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-[4px] shadow-2xs">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#1B5E20]">35+ Years</span>
          <span className="text-xs sm:text-sm text-[#636E72] font-medium">Traditional Halaqat & Islamic Education</span>
        </div>
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-[4px] shadow-2xs">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#B8860B]">32 Lessons</span>
          <span className="text-xs sm:text-sm text-[#636E72] font-medium">Complete Kitab At-Tawheed (ኪታቡ አተውሂድ)</span>
        </div>
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-[4px] shadow-2xs">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#1B5E20]">350+ Hours</span>
          <span className="text-xs sm:text-sm text-[#636E72] font-medium">Lectures, Sermons & Video Exegesis</span>
        </div>
        <div className="bg-white border border-[#E0D8CE] p-4 rounded-[4px] shadow-2xs">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#B8860B]">AAOIFI & Sharia</span>
          <span className="text-xs sm:text-sm text-[#636E72] font-medium">Auditor & Ethical Banking Consultant</span>
        </div>
      </div>
    </section>
  );
}
