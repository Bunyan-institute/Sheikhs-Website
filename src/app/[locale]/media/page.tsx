import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getMedia } from '@/lib/api/media';
import { Link } from '@/i18n/navigation';
import { MediaCard } from '@/components/media/media-card';
import { ArrowRight } from 'lucide-react';

interface MediaPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MediaPage({ params, searchParams }: MediaPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "media" });

  const resolvedSearchParams = await searchParams;
  const currentKind = typeof resolvedSearchParams.kind === "string" ? resolvedSearchParams.kind : "all";

  const allMedia = await getMedia({ locale });
  const media = currentKind === "all" 
    ? allMedia 
    : allMedia.filter((m) => {
        if (currentKind === "photos") return m.kind === "image";
        if (currentKind === "audio") return m.kind === "audio";
        if (currentKind === "videos") return m.kind === "video";
        if (currentKind === "documents") return m.kind === "document";
        return true;
      });

  const kinds = [
    { label: "All Media", value: "all" },
    { label: "Audio Lessons", value: "audio" },
    { label: "Photographs & Archives", value: "photos" },
    { label: "Documents & Treatises", value: "documents" },
    { label: "Video Discourses", value: "videos" },
  ];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                {t("arabicBadge")}
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                {t("subtitle")}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t("description")}
          </p>
        </div>
      </header>

      {/* Dignified Official Archives Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <a
          href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#B8860B]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-[#8C6D23] tracking-wider">Official Video Archive</div>
            <div className="text-sm font-heading font-bold text-[#2D3436] group-hover:text-[#1A4D2E] truncate">Full Video Discourses</div>
            <div className="text-xs text-[#7A8285]">YouTube Archive Playlist</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6D23]" />
        </a>

        <a
          href="https://t.me/ustazmuhammadferej"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#1A4D2E]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.941z"/></svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-[#1A4D2E] tracking-wider">Telegram Channel</div>
            <div className="text-sm font-heading font-bold text-[#2D3436] group-hover:text-[#1A4D2E] truncate">Halaqat &amp; Audio Updates</div>
            <div className="text-xs text-[#7A8285]">Direct Telegram Broadcast</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6D23]" />
        </a>

        <a
          href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-[4px] border border-[#E6E0D8] bg-white hover:border-[#1A4D2E] transition-colors flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#1A4D2E]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-[#1A4D2E] tracking-wider">Facebook Discourses</div>
            <div className="text-sm font-heading font-bold text-[#2D3436] group-hover:text-[#1A4D2E] truncate">Ustaz Muhammad ferej</div>
            <div className="text-xs text-[#7A8285]">330,000+ Community Learners</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8C6D23]" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E6E0D8] pb-4">
        {kinds.map((tab) => (
          <Link
            key={tab.value}
            href={`/media?kind=${tab.value}`}
            className={`px-3.5 py-1.5 rounded-[3px] font-semibold text-xs transition-colors ${
              currentKind === tab.value
                ? "bg-[#1A4D2E] text-white"
                : "text-[#555E61] hover:text-[#1A4D2E] hover:bg-white border border-transparent hover:border-[#E6E0D8]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-20 bg-white border border-[#E6E0D8] rounded-[4px]">
          <p className="text-xs text-[#7A8285]">No media items in this category.</p>
        </div>
      )}
    </div>
  );
}
