"use client";

import { PlayCircle, Headphones, Image as ImageIcon, FileText, Download, ExternalLink } from "lucide-react";
import type { MediaItem } from "@/lib/api/media";
import { parseMediaUrl } from "@/lib/media-source";
import { MediaEmbed } from "@/components/media/media-embed";

export function MediaCard({ item }: { item: MediaItem }) {
  const parsed = parseMediaUrl(item.url);
  // Landscape embeds (YouTube, Facebook video, Telegram) play right in the card; portrait ones link out.
  const inlineEmbed = item.kind === "video" && Boolean(parsed.embedUrl) && parsed.aspect === "16/9";
  const inlineAudio = item.kind === "audio" && (parsed.provider === "direct" || parsed.provider === "upload");
  const thumbnail = item.thumbnail_url ?? parsed.thumbnailUrl ?? null;
  const providerLabel = parsed.provider === "youtube" ? "YouTube" : parsed.provider === "tiktok" ? "TikTok" : parsed.provider === "facebook" ? "Facebook" : parsed.provider === "telegram" ? "Telegram" : null;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-[#0F241C]/10 overflow-hidden hover:border-[#1B6A50] transition-all shadow-xs">
      {/* Media Top Container */}
      <div className="aspect-video bg-[#EDF4F0] relative flex items-center justify-center overflow-hidden border-b border-[#0F241C]/10">
        {inlineEmbed ? (
          <MediaEmbed url={item.url!} title={item.title} className="!rounded-none !shadow-none size-full" />
        ) : thumbnail ? (
          <img
            src={thumbnail}
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
        {!inlineEmbed && (
          <div className="absolute top-3 right-3 bg-[#072118]/90 backdrop-blur-xs border border-[#BF9A45]/30 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#EDF4F0] flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
            {providerLabel ? (
              <span>{providerLabel}</span>
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
          {inlineAudio && item.url ? (
            <audio controls preload="metadata" className="h-9 w-full">
              <source src={parsed.url} type={parsed.mime} />
            </audio>
          ) : item.url ? (
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
