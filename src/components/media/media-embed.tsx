import { ExternalLink } from "lucide-react";
import { parseMediaUrl } from "@/lib/media-source";

interface MediaEmbedProps {
  url: string;
  title: string;
  poster?: string | null;
  className?: string;
  /** Shown instead of the default link card when the source cannot play inline. */
  fallback?: React.ReactNode;
}

const IFRAME_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/**
 * One renderer for every kind of source: an iframe for YouTube/Facebook/TikTok/Telegram, a real <video> or
 * <audio> element (with the correct mime type) for direct files and uploads, and a plain link otherwise.
 * Works in server and client components (no hooks).
 */
export function MediaEmbed({ url, title, poster, className = "", fallback }: MediaEmbedProps) {
  const p = parseMediaUrl(url);
  if (!p.valid) return <>{fallback ?? null}</>;

  if (p.embedUrl) {
    const src = p.provider === "youtube" ? `${p.embedUrl}${p.embedUrl.includes("?") ? "&" : "?"}rel=0&modestbranding=1` : p.embedUrl;
    const portrait = p.aspect === "9/16";
    return (
      <div className={`relative w-full overflow-hidden rounded-xl bg-black shadow-md ${portrait ? "mx-auto max-w-[22rem]" : ""} ${className}`} style={{ aspectRatio: portrait ? "9 / 16" : "16 / 9" }}>
        <iframe
          src={src}
          title={title}
          allow={IFRAME_ALLOW}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  if ((p.provider === "direct" || p.provider === "upload") && p.kind === "video") {
    return (
      <div className={`flex w-full items-center justify-center overflow-hidden rounded-xl bg-black shadow-md ${className}`} style={{ aspectRatio: "16 / 9" }}>
        <video controls playsInline preload="metadata" poster={poster || undefined} className="size-full object-contain">
          <source src={p.url} type={p.mime} />
        </video>
      </div>
    );
  }

  if ((p.provider === "direct" || p.provider === "upload") && p.kind === "audio") {
    return (
      <audio controls preload="metadata" className={`w-full ${className}`}>
        <source src={p.url} type={p.mime} />
      </audio>
    );
  }

  if (fallback !== undefined) return <>{fallback}</>;

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold underline-offset-2 hover:underline ${className}`}
    >
      <span className="truncate">{title || new URL(p.url, "http://x").hostname}</span>
      <ExternalLink className="size-4 shrink-0" />
    </a>
  );
}
