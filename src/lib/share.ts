/** Readable text for post excerpts; never render stored HTML into an image template. */
export function postText(value: string | null | undefined): string {
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘" };
  return (value ?? "").replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]*>/g, " ").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name: string) => {
      if (!name.startsWith("#")) return entities[name.toLowerCase()] ?? match;
      const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    }).replace(/\*\*|__|^#{1,6}\s/gm, "").replace(/\s+/g, " ").trim();
}

export function postExcerpt(value: string, limit: number): string {
  const text = postText(value);
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1);
  const boundary = clipped.lastIndexOf(" ");
  return (boundary > limit * 0.65 ? clipped.slice(0, boundary) : clipped) + "…";
}

export function shareImagePath(kind: "articles" | "fatwas", slug: string, locale: string, preview = false): string {
  return `/api/share/${kind}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}${preview ? "&format=preview" : ""}`;
}
