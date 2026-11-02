"use client";

import { PlayCircle, Headphones, Image as ImageIcon, FileText, Download, ExternalLink } from "lucide-react";
import type { MediaItem } from "@/lib/api/media";

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export function MediaCard({ item }: { item: MediaItem }) {
  const isYouTube = item.kind === "video" && item.url ? getYouTubeEmbedUrl(item.url) : null;
  const isTikTok = item.url?.includes("tiktok.com");
  const isFacebook = item.url?.includes("facebook.com");

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-[#0F241C]/10 overflow-hidden hover:border-[#1B6A50] transition-all shadow-xs">
      {/* Media Top Container */}
      <div className="aspect-video bg-[#EDF4F0] relative flex items-center justify-center overflow-hidden border-b border-[#0F241C]/10">
        {isYouTube ? (
          <iframe
            src={isYouTube}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        ) : item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[#1B6A50]/30">
            {item.kind === "video" && <PlayCircle className="w-12 h-12" />}
            {item.kind === "audio" && <Headphones className="w-12 h-12" />}
            {item.kind === "image" && <ImageIcon className="w-12 h-12" />}
            {item.kind === "document" && <FileText className="w-12 h-12" />}
          </div>
        )}

        {/* Type Badge */}
        {!isYouTube && (
          <div className="absolute top-3 right-3 bg-[#072118]/90 backdrop-blur-xs border border-[#BF9A45]/30 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#EDF4F0] flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
            {isTikTok ? (
              <span>TikTok</span>
            ) : isFacebook ? (
              <span>Facebook</span>
            ) : (
              <>
                {item.kind === "video" && <PlayCircle className="w-3 h-3 text-[#BF9A45]" />}
                {item.kind === "audio" && <Headphones className="w-3 h-3 text-[#E6D3A3]" />}
                {item.kind === "image" && <ImageIcon className="w-3 h-3 text-[#BF9A45]" />}
                {item.kind === "document" && <FileText className="w-3 h-3 text-[#E6D3A3]" />}
                <span>{item.kind === "image" ? "Photo" : item.kind}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Media Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-base text-[#0F241C] mb-2 line-clamp-2 group-hover:text-[#1B6A50] transition-colors break-words">
          {item.title}
        </h3>
        <p className="text-xs text-[#0F241C]/70 line-clamp-2 mb-4 font-sans leading-relaxed">
          {item.description || "Scholarly resource from the official archive of Sheikh Muhammed Ferej."}
        </p>

        <div className="mt-auto pt-3 border-t border-[#0F241C]/10 flex items-center justify-between text-xs font-semibold text-[#BF9A45]">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1B6A50] inline-flex items-center gap-1.5 transition-colors py-1"
            >
              {item.kind === "document" ? (
                <>
                  <Download className="w-3.5 h-3.5 text-[#1B6A50]" /> <span>Download PDF</span>
                </>
              ) : item.kind === "audio" ? (
                <>
                  <Headphones className="w-3.5 h-3.5 text-[#1B6A50]" /> <span>Listen Lesson</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-[#BF9A45]" /> <span>View Archive</span>
                </>
              )}
            </a>
          ) : (
            <span className="text-[11px] text-[#0F241C]/50">Archived Document</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
