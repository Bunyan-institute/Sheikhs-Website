/**
 * Understands the links the Sheikh pastes (YouTube, Facebook, TikTok, Telegram, direct files, uploads) and
 * tells the rest of the app how to show them. Pure functions, safe on the client and the server, never throws.
 */

export type MediaProvider = "youtube" | "facebook" | "tiktok" | "telegram" | "direct" | "upload" | "unknown";
export type MediaSourceKind = "video" | "audio" | "image" | "document" | "unknown";

export interface ParsedMedia {
  provider: MediaProvider;
  kind: MediaSourceKind;
  /** The cleaned URL to store. Empty when the input is not a usable http(s) or site-relative link. */
  url: string;
  /** Iframe address for providers that support embedding. */
  embedUrl?: string;
  /** A thumbnail we can derive without calling any API. */
  thumbnailUrl?: string;
  /** Real mime type for direct files, so <video>/<audio> get the right type. */
  mime?: string;
  /** Shape of the embed: shorts and TikTok are portrait. */
  aspect: "16/9" | "9/16";
  valid: boolean;
}

const EXTENSIONS: Record<string, { kind: Exclude<MediaSourceKind, "unknown">; mime: string }> = {
  mp4: { kind: "video", mime: "video/mp4" },
  m4v: { kind: "video", mime: "video/mp4" },
  webm: { kind: "video", mime: "video/webm" },
  mov: { kind: "video", mime: "video/quicktime" },
  ogv: { kind: "video", mime: "video/ogg" },
  mp3: { kind: "audio", mime: "audio/mpeg" },
  m4a: { kind: "audio", mime: "audio/mp4" },
  aac: { kind: "audio", mime: "audio/aac" },
  ogg: { kind: "audio", mime: "audio/ogg" },
  oga: { kind: "audio", mime: "audio/ogg" },
  opus: { kind: "audio", mime: "audio/ogg" },
  wav: { kind: "audio", mime: "audio/wav" },
  flac: { kind: "audio", mime: "audio/flac" },
  jpg: { kind: "image", mime: "image/jpeg" },
  jpeg: { kind: "image", mime: "image/jpeg" },
  png: { kind: "image", mime: "image/png" },
  webp: { kind: "image", mime: "image/webp" },
  gif: { kind: "image", mime: "image/gif" },
  avif: { kind: "image", mime: "image/avif" },
  pdf: { kind: "document", mime: "application/pdf" },
};

const YT_ID = /^[\w-]{11}$/;
const YT_HOST = /^(?:www\.|m\.|music\.)?youtube(?:-nocookie)?\.com$/;
const FB_HOST = /^(?:www\.|web\.|m\.|mbasic\.)?facebook\.com$/;
const TT_HOST = /^(?:www\.|m\.)?tiktok\.com$/;

const invalid: ParsedMedia = { provider: "unknown", kind: "unknown", url: "", aspect: "16/9", valid: false };

function fromExtension(pathname: string) {
  const ext = pathname.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return EXTENSIONS[ext];
}

export function parseMediaUrl(input: string | null | undefined): ParsedMedia {
  const raw = (input ?? "").trim();
  if (!raw) return invalid;

  // Site-relative files: uploads and anything in /public.
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    const file = fromExtension(raw);
    const provider: MediaProvider = raw.startsWith("/uploads/") ? "upload" : "direct";
    return { provider, kind: file?.kind ?? "unknown", url: raw, mime: file?.mime, aspect: "16/9", valid: true };
  }

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return invalid;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return invalid;

  const host = u.hostname.toLowerCase();
  const path = u.pathname;
  const url = u.toString();

  // ── YouTube ──
  if (host === "youtu.be" || YT_HOST.test(host)) {
    let id: string | undefined;
    let portrait = false;
    if (host === "youtu.be") id = path.slice(1).split("/")[0];
    else if (path === "/watch") id = u.searchParams.get("v") ?? undefined;
    else {
      const m = /^\/(shorts|live|embed|v)\/([\w-]{11})/.exec(path);
      if (m) {
        id = m[2];
        portrait = m[1] === "shorts";
      }
    }
    if (id && YT_ID.test(id)) {
      return {
        provider: "youtube",
        kind: "video",
        url,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        aspect: portrait ? "9/16" : "16/9",
        valid: true,
      };
    }
    const list = path === "/playlist" ? u.searchParams.get("list") : null;
    if (list && /^[\w-]+$/.test(list)) {
      return { provider: "youtube", kind: "video", url, embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`, aspect: "16/9", valid: true };
    }
    return { provider: "youtube", kind: "unknown", url, aspect: "16/9", valid: true };
  }

  // ── Facebook ──
  if (host === "fb.watch" || FB_HOST.test(host)) {
    const isVideo = host === "fb.watch" || /\/(videos|reel|watch)\b/.test(path);
    return {
      provider: "facebook",
      kind: isVideo ? "video" : "unknown",
      url,
      embedUrl: isVideo ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560` : undefined,
      aspect: /\/reel\b/.test(path) ? "9/16" : "16/9",
      valid: true,
    };
  }

  // ── TikTok ──
  if (TT_HOST.test(host) || host === "vm.tiktok.com" || host === "vt.tiktok.com") {
    const m = /\/video\/(\d{8,25})/.exec(path);
    return {
      provider: "tiktok",
      kind: m || host.startsWith("v") || path.startsWith("/t/") ? "video" : "unknown",
      url,
      embedUrl: m ? `https://www.tiktok.com/embed/v2/${m[1]}` : undefined,
      aspect: "9/16",
      valid: true,
    };
  }

  // ── Telegram ──
  if (host === "t.me" || host === "telegram.me") {
    const m = /^\/(?:c\/)?([\w]{3,32})\/(\d+)/.exec(path);
    if (m && !path.startsWith("/c/")) {
      return { provider: "telegram", kind: "video", url, embedUrl: `https://t.me/${m[1]}/${m[2]}?embed=1&mode=tme`, aspect: "16/9", valid: true };
    }
    return { provider: "telegram", kind: "unknown", url, aspect: "16/9", valid: true };
  }

  // ── A direct file on any host ──
  const file = fromExtension(path);
  if (file) {
    return { provider: path.includes("/uploads/") ? "upload" : "direct", kind: file.kind, url, mime: file.mime, aspect: "16/9", valid: true };
  }

  return { provider: "unknown", kind: "unknown", url, aspect: "16/9", valid: true };
}

export const isEmbeddable = (p: ParsedMedia) => Boolean(p.embedUrl);

/** True when the link plays inline: an embed, or a direct video/audio file. */
export function isPlayable(p: ParsedMedia) {
  return isEmbeddable(p) || ((p.provider === "direct" || p.provider === "upload") && (p.kind === "video" || p.kind === "audio"));
}

/** Hosts we allow the server to fetch metadata from (oEmbed). Everything else is never contacted. */
export function oembedEndpoint(p: ParsedMedia): string | null {
  if (p.provider === "youtube" && p.kind === "video" && p.embedUrl && !p.embedUrl.includes("videoseries")) {
    return `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(p.url)}`;
  }
  if (p.provider === "tiktok" && p.embedUrl) {
    return `https://www.tiktok.com/oembed?url=${encodeURIComponent(p.url)}`;
  }
  return null;
}
