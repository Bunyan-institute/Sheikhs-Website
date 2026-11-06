import sanitizeHtml from "sanitize-html";
import { expandMediaPlaceholders, markdownLiteToHtml, withSourceMarker } from "./rich-text.ts";

/**
 * Strict allow-list for article HTML. Keeps the markup older articles use (divs, spans, headings, class and dir
 * attributes) but drops scripts, event handlers, styles, iframes and unsafe link schemes.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["div", "span", "p", "br", "hr", "strong", "b", "em", "i", "u", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "code", "pre", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: {
      "*": ["class", "dir", "lang"],
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      div: ["data-media", "class", "dir", "lang"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer nofollow", ...(attribs.href?.startsWith("http") ? { target: "_blank" } : {}) },
      }),
    },
  });
}

/** What gets stored when an article is saved. `text` is the Sheikh's own typing; `html` is for older articles. */
export function prepareArticleBody(input: { source: string; format: "text" | "html" }): string {
  if (input.format === "text") {
    return withSourceMarker(input.source, sanitizeArticleHtml(markdownLiteToHtml(input.source)));
  }
  return sanitizeArticleHtml(input.source);
}

/** The HTML shown to readers: sanitised again (defence in depth, covers old data) and with videos expanded. */
export function renderArticleBody(stored: string | null | undefined): string {
  return expandMediaPlaceholders(sanitizeArticleHtml(stored ?? ""));
}
