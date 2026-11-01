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
    <div className="group flex flex-col bg-white rounded-[4px] border border-[#E6E0D8] overflow-hidden hover:border-[#1A4D2E] transition-colors">
      {/* Media Top Container */}
      <div className="aspect-video bg-[#FAF8F5] relative flex items-center justify-center overflow-hidden border-b border-[#E6E0D8]">
        {isYouTube ? (
          <iframe
            src={isYouTube}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[#1A4D2E]/30">
            {item.kind === "video" && <PlayCircle className="w-12 h-12" />}
            {item.kind === "audio" && <Headphones className="w-12 h-12" />}
            {item.kind === "image" && <ImageIcon className="w-12 h-12" />}
            {item.kind === "document" && <FileText className="w-12 h-12" />}
          </div>
        )}

        {/* Type Badge */}
        {!isYouTube && (
          <div className="absolute top-2.5 right-2.5 bg-[#FAF8F5]/90 border border-[#E6E0D8] px-2 py-0.5 rounded-[2px] text-[10px] font-bold text-[#1A4D2E] flex items-center gap-1 uppercase tracking-wider">
            {isTikTok ? (
              <span>TikTok</span>
            ) : isFacebook ? (
              <span>Facebook</span>
            ) : (
              <>
                {item.kind === "video" && <PlayCircle className="w-3 h-3 text-[#B8860B]" />}
                {item.kind === "audio" && <Headphones className="w-3 h-3 text-[#1A4D2E]" />}
                {item.kind === "image" && <ImageIcon className="w-3 h-3 text-[#8C6D23]" />}
                {item.kind === "document" && <FileText className="w-3 h-3 text-[#1A4D2E]" />}
                <span>{item.kind === "image" ? "Photo" : item.kind}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Media Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D3436] mb-1.5 line-clamp-2 group-hover:text-[#1A4D2E] transition-colors break-words">
          {item.title}
        </h3>
        <p className="text-xs text-[#555E61] line-clamp-2 mb-3 font-body leading-relaxed">
          {item.description || "Scholarly resource from the official archive of Sheikh Muhammed Ferej."}
        </p>

        <div className="mt-auto pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#8C6D23] hover:text-[#1A4D2E] inline-flex items-center gap-1.5"
            >
              {item.kind === "document" ? (
                <>
                  <Download className="w-3.5 h-3.5 text-[#1A4D2E]" /> Download PDF
                </>
              ) : item.kind === "audio" ? (
                <>
                  <Headphones className="w-3.5 h-3.5 text-[#1A4D2E]" /> Listen Lesson
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C6D23]" /> View Archive
                </>
              )}
            </a>
          ) : (
            <span className="text-[11px] text-[#7A8285]">Archived Document</span>
          )}
        </div>
      </div>
    </div>
  );
}
