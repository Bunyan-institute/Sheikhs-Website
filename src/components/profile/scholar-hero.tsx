import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BookOpen, GraduationCap, Award, ShieldCheck, CheckCircle2, ArrowRight, Tv } from "lucide-react";

interface ScholarHeroProps {
  name: string;
  headline: string | null;
  biography: string | null;
  photoUrl: string | null;
  locale: string;
}

export function ScholarHero({ name, headline, biography, photoUrl, locale }: ScholarHeroProps) {
  return (
    <section className="py-8 sm:py-12 lg:py-16 border-b border-[#E6E0D8]">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-14 items-center justify-between">
        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Classical Basmala & Scholarly Sanad Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[4px] bg-[#FAF8F5] border border-[#B8860B]/40 text-[#2D3436] text-xs font-medium">
              <span className="font-arabic text-[#1A4D2E] font-bold text-base tracking-wide" dir="rtl">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </span>
              <span className="text-[#B8860B] font-bold">۞</span>
              <span className="text-[#8C6D23] font-semibold uppercase tracking-wider text-[11px]">
                Islamic Scholar &amp; Jurist
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#1A4D2E] font-medium bg-[#1A4D2E]/5 border border-[#1A4D2E]/20 px-3 py-1 rounded-[4px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A4D2E]" />
              <span>Authentic Scholarly Sanad</span>
            </span>
          </div>

          {/* Scholar Titles */}
          <div className="space-y-2">
            <div className="font-arabic text-xl sm:text-2xl text-[#8C6D23] font-medium" dir="rtl">
              فضيلة الشيخ محمد فرج مجنو (حفظه الله تعالى)
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3436] leading-[1.15] tracking-tight break-words">
              {name}
            </h1>
            {headline && (
              <p className="text-lg sm:text-xl text-[#1A4D2E] font-semibold font-heading">
                {headline}
              </p>
            )}
          </div>

          {/* Scholarly Pillars / Accreditations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-medium">
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436]">
              <Award className="w-4 h-4 text-[#B8860B] shrink-0" />
              <span className="truncate">AAOIFI Certified Sharia Auditor</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436]">
              <ShieldCheck className="w-4 h-4 text-[#1A4D2E] shrink-0" />
              <span className="truncate">African Scholars Union Member</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436]">
              <GraduationCap className="w-4 h-4 text-[#B8860B] shrink-0" />
              <span className="truncate">President, Al-Fajr Foundation</span>
            </div>
          </div>

          {biography && (
            <p className="text-[#555E61] text-base sm:text-lg leading-relaxed max-w-3xl font-body break-words">
              {biography.length > 320 ? `${biography.slice(0, 320)}...` : biography}
            </p>
          )}

          {/* Classical Primary Action CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
            <Link 
              href="/media"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[4px] bg-[#1A4D2E] text-white font-semibold text-sm sm:text-base shadow-xs hover:bg-[#143d24]"
            >
              <BookOpen className="w-4 h-4 text-[#B8860B]" />
              <span>Africa TV &amp; Media Archive</span>
            </Link>
            <Link 
              href="/ask"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436] font-medium text-sm sm:text-base shadow-xs hover:border-[#1A4D2E] hover:bg-[#FAF8F5]"
            >
              <span>Ask the Sheikh</span>
              <ArrowRight className="w-4 h-4 text-[#8C6D23]" />
            </Link>
          </div>

          {/* Scholarly Official Channels Strip */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <span className="text-[#7A8285] font-semibold uppercase tracking-wider text-[11px]">
              Official Discourses &amp; Broadcasts:
            </span>
            <a
              href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436] hover:border-[#1A4D2E] hover:text-[#1A4D2E]"
            >
              <svg className="w-3.5 h-3.5 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube Official Playlist</span>
            </a>
            <a
              href="https://t.me/ustazmuhammadferej"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436] hover:border-[#1A4D2E] hover:text-[#1A4D2E]"
            >
              <svg className="w-3.5 h-3.5 text-[#1A4D2E]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.941z"/></svg>
              <span>Telegram Channel</span>
            </a>
            <a
              href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white border border-[#E6E0D8] text-[#2D3436] hover:border-[#1A4D2E] hover:text-[#1A4D2E]"
            >
              <svg className="w-3.5 h-3.5 text-[#1A4D2E]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook (330K+ Learners)</span>
            </a>
          </div>
        </div>

        {/* Scholar Portrait: Double Hairline Islamic Manuscript Frame */}
        <div className="shrink-0">
          <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 p-2 rounded-[4px] bg-white border border-[#E6E0D8] shadow-sm relative">
            <div className="w-full h-full rounded-[2px] overflow-hidden relative bg-[#FAF8F5] flex items-center justify-center border border-[#B8860B]/30">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-7xl font-heading font-bold text-[#1A4D2E]">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            {/* Calligraphic Corner Accents */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#B8860B]/60" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#B8860B]/60" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#B8860B]/60" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#B8860B]/60" />
            
            <div className="absolute -bottom-3 start-1/2 -translate-x-1/2 bg-[#1A4D2E] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-[3px] border border-[#B8860B]/50 shadow-xs whitespace-nowrap">
              Official Scholar Archive
            </div>
          </div>
        </div>
      </div>

      {/* Scholarly Highlights Strip (Strictly Sheikh Muhammed Ferej's Experience) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-8 border-t border-[#E6E0D8]">
        <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#1A4D2E]">35+ Years</span>
          <span className="text-xs sm:text-sm text-[#555E61] font-medium">Halaqat &amp; Classical Islamic Education</span>
        </div>
        <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#B8860B]">Africa TV</span>
          <span className="text-xs sm:text-sm text-[#555E61] font-medium">Televised Series &amp; Exegesis Programs</span>
        </div>
        <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#1A4D2E]">350+ Hours</span>
          <span className="text-xs sm:text-sm text-[#555E61] font-medium">Recorded Sermons &amp; Video Playlists</span>
        </div>
        <div className="bg-white border border-[#E6E0D8] p-4 rounded-[4px]">
          <span className="block font-heading text-2xl sm:text-3xl font-bold text-[#B8860B]">AAOIFI &amp; Sharia</span>
          <span className="text-xs sm:text-sm text-[#555E61] font-medium">Certified Auditor &amp; Bank Sharia Board</span>
        </div>
      </div>
    </section>
  );
}
