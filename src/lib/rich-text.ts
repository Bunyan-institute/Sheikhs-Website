/**
 * Simple formatting for articles: the Sheikh types plain text and uses a few buttons (bold, heading, list,
 * quote, link, video). Everything is converted to a small, safe set of HTML tags. These functions are pure and
 * safe to run in the browser (live preview) and on the server. HTML coming from elsewhere is sanitised by
 * rich-text-server.ts, which is the only place that touches `sanitize-html`.
 */
import { parseMediaUrl } from "./media-source.ts";

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const unescapeHtml = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const link = (url: string, label: string) =>
  `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(label)}</a>`;

function inline(text: string): string {
  const slots: string[] = [];
  const hold = (html: string) => `\u0000${slots.push(html) - 1}\u0000`;
  let out = text.replace(/\[([^\]]{1,200})\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g, (_m, label: string, url: string) => hold(link(url, label)));
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g, (_m, pre: string, url: string) => `${pre}${hold(link(url, url))}`);
  out = escapeHtml(out)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])_([^_\s][^_]*?)_(?=$|[^\w*])/g, "$1<em>$2</em>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => slots[Number(i)]);
}

function isMediaLine(line: string): string | null {
  const explicit = /^@\[(?:video|audio|media)\]\((\S+)\)$/.exec(line);
  const candidate = explicit ? explicit[1] : /^https?:\/\/\S+$/.test(line) ? line : null;
  if (!candidate) return null;
  const p = parseMediaUrl(candidate);
  const playable = Boolean(p.embedUrl) || ((p.provider === "direct" || p.provider === "upload") && (p.kind === "video" || p.kind === "audio"));
  return p.valid && (playable || explicit) ? p.url : null;
}

export function markdownLiteToHtml(source: string): string {
  const out: string[] = [];
  let para: string[] = [];
  let quote: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`);
    if (quote.length) out.push(`<blockquote><p>${quote.map(inline).join("<br>")}</p></blockquote>`);
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`);
    para = [];
    quote = [];
    list = null;
  };

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flush();
      out.push(`<h${heading[1].length === 3 ? 3 : 2}>${inline(heading[2])}</h${heading[1].length === 3 ? 3 : 2}>`);
      continue;
    }
    const media = isMediaLine(line);
    if (media) {
      flush();
      out.push(`<div data-media="${escapeHtml(media)}"></div>`);
      continue;
    }
    const q = /^>\s?(.*)$/.exec(line);
    if (q) {
      if (para.length || list) flush();
      quote.push(q[1]);
      continue;
    }
    const ul = /^[-*•]\s+(.+)$/.exec(line);
    const ol = /^\d+[.)]\s+(.+)$/.exec(line);
    if (ul || ol) {
      const tag = ul ? "ul" : "ol";
      if (para.length || quote.length || (list && list.tag !== tag)) flush();
      list ??= { tag, items: [] };
      list.items.push((ul ?? ol)![1]);
      continue;
    }
    if (quote.length || list) flush();
    para.push(line);
  }
  flush();
  return out.join("\n");
}

// ── Keeping the editable text next to the HTML ──
// The saved body is HTML (so existing readers keep working). A small comment at the start stores the typed text
// so the Sheikh can edit his article again exactly as he wrote it.

const MARKER = /^<!--md:([A-Za-z0-9_-]*)-->/;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export const withSourceMarker = (source: string, html: string) => `<!--md:${toBase64Url(source)}-->${html}`;

/** The text the article was written with, or null for articles that are plain HTML (written before this editor). */
export function readSourceMarker(body: string | null | undefined): string | null {
  const m = MARKER.exec(body ?? "");
  if (!m) return null;
  try {
    return fromBase64Url(m[1]);
  } catch {
    return null;
  }
}

// ── Embeds (videos/audio inside an article) ──

const ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/** HTML for one embed. Only ever built from our own parser's output, so it is safe to insert after sanitising. */
export function mediaEmbedHtml(rawUrl: string, title = ""): string {
  const p = parseMediaUrl(rawUrl);
  if (!p.valid) return "";
  const t = escapeHtml(title);
  if (p.embedUrl) {
    const src = p.provider === "youtube" ? `${p.embedUrl}${p.embedUrl.includes("?") ? "&" : "?"}rel=0&modestbranding=1` : p.embedUrl;
    const portrait = p.aspect === "9/16";
    return `<div style="position:relative;width:100%;${portrait ? "max-width:22rem;margin:1.5rem auto;aspect-ratio:9/16" : "margin:1.5rem 0;aspect-ratio:16/9"};overflow:hidden;border-radius:12px;background:#000"><iframe src="${escapeHtml(src)}" title="${t}" loading="lazy" allow="${ALLOW}" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>`;
  }
  if ((p.provider === "direct" || p.provider === "upload") && p.kind === "video") {
    return `<video controls playsinline preload="metadata" style="width:100%;margin:1.5rem 0;border-radius:12px;background:#000"><source src="${escapeHtml(p.url)}" type="${p.mime}"></video>`;
  }
  if ((p.provider === "direct" || p.provider === "upload") && p.kind === "audio") {
    return `<audio controls preload="metadata" style="width:100%;margin:1rem 0"><source src="${escapeHtml(p.url)}" type="${p.mime}"></audio>`;
  }
  return `<p>${link(p.url, p.url)}</p>`;
}

/** Replaces <div data-media="URL"></div> placeholders with real players. */
export function expandMediaPlaceholders(html: string): string {
  return html.replace(/<div data-media="([^"]*)"><\/div>/g, (_m, url: string) => mediaEmbedHtml(unescapeHtml(url)));
}

/** Words per minute for the automatic reading time. Works for any script (splits on whitespace). */
export function estimateReadingMinutes(text: string): number {
  const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}
