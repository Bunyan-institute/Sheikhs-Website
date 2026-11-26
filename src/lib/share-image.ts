import sharp, { type OverlayOptions } from "sharp";
import path from "node:path";
import { postExcerpt } from "./share";

// Pango shapes Arabic and Ethiopic with the same OpenType rules used by native text renderers.
// Register bundled fonts once; rendering never depends on a font service or host-installed fonts.
let registeredFonts: Promise<void> | undefined;
function registerFonts() {
  registeredFonts ??= (async () => {
    for (const [family, file] of [["Figtree", "figtree-regular.ttf"], ["Noto Sans Ethiopic", "noto-sans-ethiopic-regular.ttf"], ["Amiri", "amiri-regular.ttf"]]) {
      await sharp({ text: { text: "A", font: `${family} 12`, fontfile: path.join(process.cwd(), "public/fonts", file), rgba: true } }).png().toBuffer();
    }
  })();
  return registeredFonts;
}
const escapeMarkup = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function renderPostImage(post: { title: string; excerpt: string; url: string; kind: "articles" | "fatwas"; locale: string }, preview: boolean) {
  await registerFonts();
  const width = preview ? 1200 : 1080;
  const height = preview ? 630 : 1350;
  const padding = preview ? 52 : 80;
  const textWidth = width - padding * 2;
  const rtl = post.locale === "ar";
  const layers: OverlayOptions[] = [];
  async function text(value: string, top: number, size: number, maxHeight: number, color = "#EDF4F0", align: "left" | "right" = rtl ? "right" : "left") {
    let rendered;
    for (let fontSize = size; fontSize >= 18; fontSize -= 2) {
      rendered = await sharp({ text: { text: `<span foreground="${color}">${escapeMarkup(value || " ")}</span>`, font: `Figtree, Noto Sans Ethiopic, Amiri ${fontSize}`, width: textWidth, align, spacing: 8, rgba: true } }).png().toBuffer({ resolveWithObject: true });
      if (rendered.info.height <= maxHeight) break;
    }
    if (!rendered) return 0;
    layers.push({ input: rendered.data, top, left: align === "right" ? width - padding - rendered.info.width : padding });
    return rendered.info.height;
  }
  const labels = post.locale === "am" ? { article: "የጽሑፍ አጭር መግለጫ", fatwa: "የፈትዋ አጭር መግለጫ", read: "ሙሉውን ያንብቡ" }
    : post.locale === "ar" ? { article: "مقتطف من المقال", fatwa: "مقتطف من الفتوى", read: "اقرأ النص الكامل" }
    : post.locale === "om" ? { article: "Cuunfaa barruu", fatwa: "Cuunfaa fatwaa", read: "Guutuu dubbisi" }
    : { article: "Article excerpt", fatwa: "Fatwa excerpt", read: "Read the full text" };
  await text("Sheikh Muhammed Ferej Megeno", padding, preview ? 24 : 28, 45, "#E6D3A3", "left");
  await text(post.kind === "articles" ? labels.article : labels.fatwa, preview ? 104 : 164, 26, 45, "#E6D3A3");
  const titleTop = preview ? 158 : 244;
  const titleHeight = await text(postExcerpt(post.title, preview ? 135 : 190), titleTop, preview ? 44 : 52, preview ? 180 : 380);
  const excerptTop = titleTop + titleHeight + (preview ? 22 : 44);
  const footerTop = preview ? 490 : 1150;
  await text(postExcerpt(post.excerpt, preview ? 180 : 520), excerptTop, preview ? 26 : 34, footerTop - excerptTop - 30, "#D5E5DC");
  await text(labels.read, footerTop + 22, 24, 45, "#E6D3A3");
  await text(post.url.replace(/^https?:\/\//, ""), footerTop + 68, preview ? 18 : 22, height - footerTop - 85, "#EDF4F0", "left");
  const background = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0D3E2F"/><rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" stroke="#BF9A45" stroke-width="12"/><path d="M${padding} ${footerTop}H${width - padding}" stroke="#BF9A45" stroke-width="2"/></svg>`);
  const png = await sharp(background).composite(layers).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=0, must-revalidate" } });
}
