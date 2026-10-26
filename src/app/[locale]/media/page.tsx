import { setRequestLocale } from 'next-intl/server';
import { getMedia } from '@/lib/api/media';
import { Link } from '@/i18n/navigation';
import { MediaCard } from '@/components/media/media-card';
import { PlayCircle, Headphones, Image as ImageIcon, FileText, Download, ExternalLink } from 'lucide-react';

interface MediaPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MediaPage({ params, searchParams }: MediaPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
    { label: "All", value: "all" },
    { label: "Audio Lessons", value: "audio" },
    { label: "Photographs", value: "photos" },
    { label: "Documents", value: "documents" },
    { label: "Videos", value: "videos" },
  ];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16 lg:py-24">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Media Gallery
        </h1>
        <p className="text-lg md:text-xl text-[#636E72] max-w-3xl font-body">
          Explore authentic recordings, photographs, documents, and lesson archives from Sheikh Muhammed Ferej.
        </p>
      </header>

      {/* Social Channels Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <a
          href="https://www.tiktok.com/@ustazmuhammadferej0"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-md border border-[#E0D8CE] bg-white hover:border-[#111111] hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.65z"/></svg>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-[#636E72] tracking-wider">TikTok Official</div>
            <div className="text-base font-bold text-[#2D3436] group-hover:text-black">@ustazmuhammadferej0</div>
            <div className="text-xs text-[#1B5E20] font-medium">297.5K Followers · 2.3M Likes</div>
          </div>
        </a>

        <a
          href="https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-md border border-[#E0D8CE] bg-white hover:border-[#CC0000] hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#CC0000] text-white flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-[#636E72] tracking-wider">YouTube Playlist</div>
            <div className="text-base font-bold text-[#2D3436] group-hover:text-[#CC0000]">Lectures & Lessons</div>
            <div className="text-xs text-[#1B5E20] font-medium">Full HD Video Series</div>
          </div>
        </a>

        <a
          href="https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-md border border-[#E0D8CE] bg-white hover:border-[#1877F2] hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-[#636E72] tracking-wider">Facebook Official</div>
            <div className="text-base font-bold text-[#2D3436] group-hover:text-[#1877F2]">Ustaz Muhammad ferej</div>
            <div className="text-xs text-[#1B5E20] font-medium">330,000+ Followers</div>
          </div>
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 border-b border-[#E0D8CE] pb-4">
        {kinds.map((tab) => (
          <Link
            key={tab.value}
            href={`/media?kind=${tab.value}`}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              currentKind === tab.value
                ? "bg-[#1B5E20] text-white font-semibold"
                : "text-[#636E72] hover:text-[#2D3436] hover:bg-[#FAF8F5]"
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
        <div className="text-center py-20 bg-[#FAF8F5] border border-[#E0D8CE] rounded-md">
          <p className="text-[#636E72]">No media items in this category.</p>
        </div>
      )}
    </div>
  );
}
