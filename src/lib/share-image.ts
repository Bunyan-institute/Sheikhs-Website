import sharp, { type OverlayOptions } from "sharp";
import path from "node:path";
import { postExcerpt } from "./share";
import type { PublicationBlock } from "./share-pages";

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

type PageLabel = "article" | "fatwa" | "question" | "answer" | "page";
const pageLabels: Record<string, Record<PageLabel, string>> = {
  en: { article: "Complete article", fatwa: "Question and answer", question: "Question", answer: "Scholar’s answer", page: "Page" },
  ar: { article: "المقال كاملاً", fatwa: "السؤال والجواب", question: "السؤال", answer: "جواب الشيخ", page: "الصفحة" },
  am: { article: "ሙሉ ጽሑፍ", fatwa: "ጥያቄና መልስ", question: "ጥያቄ", answer: "የሼኩ መልስ", page: "ገጽ" },
  om: { article: "Barreeffama guutuu", fatwa: "Gaaffii fi deebii", question: "Gaaffii", answer: "Deebii sheekichaa", page: "Fuula" },
};

const PAGE_WIDTH = 1080;
const PAGE_HEIGHT = 1350;
const PAGE_PADDING = 76;
const PAGE_TEXT_WIDTH = PAGE_WIDTH - PAGE_PADDING * 2;
const PAGE_FOOTER_TOP = 1150;

type TextStyle = { size: number; color: string };
type MeasuredText = { data: Buffer; width: number; height: number };

async function renderPageText(value: string, style: TextStyle, align: "left" | "right" | "center"): Promise<MeasuredText> {
  const rendered = await sharp({ text: {
    text: `<span foreground="${style.color}">${escapeMarkup(value || " ")}</span>`,
    font: `Figtree, Noto Sans Ethiopic, Amiri ${style.size}`,
    width: PAGE_TEXT_WIDTH,
    align,
    spacing: 8,
    rgba: true,
  } }).png().toBuffer({ resolveWithObject: true });
  return { data: rendered.data, width: rendered.info.width, height: rendered.info.height };
}

const styleFor = (block: PublicationBlock): TextStyle => block.kind === "heading"
  ? { size: 32, color: "#8D702F" }
  : { size: 29, color: "#17352C" };

function fits(text: MeasuredText, height: number): boolean {
  return text.height <= height && text.width <= PAGE_TEXT_WIDTH + 2;
}

/** Split a single long paragraph at word boundaries, then grapheme boundaries as a last resort. */
async function splitBlock(block: PublicationBlock, maxHeight: number): Promise<PublicationBlock[]> {
  const style = styleFor(block);
  const whole = await renderPageText(block.text, style, "left");
  if (fits(whole, maxHeight)) return [block];
  const words = block.text.trim().split(/\s+/);
  const result: PublicationBlock[] = [];
  let start = 0;
  while (start < words.length) {
    let low = start + 1;
    let high = words.length;
    let best = start;
    while (low <= high) {
      const end = Math.floor((low + high) / 2);
      const candidate = words.slice(start, end).join(" ");
      if (fits(await renderPageText(candidate, style, "left"), maxHeight)) {
        best = end;
        low = end + 1;
      } else high = end - 1;
    }
    if (best === start) {
      const chars = Array.from(words[start]);
      let take = 0;
      for (let i = 1; i <= chars.length; i++) {
        if (fits(await renderPageText(chars.slice(0, i).join(""), style, "left"), maxHeight)) take = i;
        else break;
      }
      if (!take) throw new Error("A word could not fit on an image page.");
      result.push({ ...block, text: chars.slice(0, take).join("") });
      words[start] = chars.slice(take).join("");
      if (!words[start]) start++;
      continue;
    }
    result.push({ ...block, text: words.slice(start, best).join(" ") });
    start = best;
  }
  return result;
}

async function paginateBlocks(blocks: PublicationBlock[], bodyCapacity: number): Promise<PublicationBlock[][]> {
  const pages: PublicationBlock[][] = [];
  let page: PublicationBlock[] = [];
  let used = 0;
  const gapBefore = (previous?: PublicationBlock) => !previous ? 0 : previous.kind === "heading" ? 10 : 20;
  const finish = () => { if (page.length) pages.push(page); page = []; used = 0; };

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    const style = styleFor(block);
    const measured = await renderPageText(block.text, style, "left");
    const gap = gapBefore(page.at(-1));
    if (block.kind === "heading" && page.length && blocks[index + 1]) {
      const next = await renderPageText(blocks[index + 1].text.slice(0, 120), styleFor(blocks[index + 1]), "left");
      if (used + gap + measured.height + 10 + next.height > bodyCapacity) finish();
    } else if (page.length && used + gap + measured.height > bodyCapacity) finish();

    const available = Math.max(80, bodyCapacity - (page.length ? gapBefore(page.at(-1)) : 0));
    const pieces = await splitBlock(block, available);
    for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex++) {
      const piece = pieces[pieceIndex];
      const pieceStyle = styleFor(piece);
      let rendered = await renderPageText(piece.text, pieceStyle, "left");
      let pieceGap = gapBefore(page.at(-1));
      if (page.length && used + pieceGap + rendered.height > bodyCapacity) {
        finish();
        pieceGap = 0;
      }
      if (!fits(rendered, bodyCapacity)) {
        const fragments = await splitBlock(piece, bodyCapacity);
        if (fragments.length === 1 && fragments[0].text === piece.text) throw new Error("Text exceeded the available page area.");
        for (const fragment of fragments) {
          rendered = await renderPageText(fragment.text, pieceStyle, "left");
          pieceGap = gapBefore(page.at(-1));
          if (page.length && used + pieceGap + rendered.height > bodyCapacity) finish();
          page.push(fragment);
          used += pieceGap + rendered.height;
          if (fragment !== fragments.at(-1)) finish();
        }
      } else {
        page.push(piece);
        used += pieceGap + rendered.height;
        if (pieceIndex < pieces.length - 1) finish();
      }
    }
  }
  finish();
  return pages.length ? pages : [[]];
}

export async function renderPublicationPages(post: {
  title: string;
  url: string;
  kind: "articles" | "fatwas";
  locale: string;
  blocks: PublicationBlock[];
}): Promise<Buffer[]> {
  await registerFonts();
  const locale = pageLabels[post.locale] ? post.locale : "en";
  const labels = pageLabels[locale];
  const rtl = locale === "ar";
  const align = rtl ? "right" : "left";
  const titleStyle = { size: 42, color: "#F8F6EF" };
  let title = await renderPageText(post.title, titleStyle, align);
  let titleSize = titleStyle.size;
  while ((title.height > 150 || title.width > PAGE_TEXT_WIDTH) && titleSize > 26) {
    titleSize -= 2;
    title = await renderPageText(post.title, { ...titleStyle, size: titleSize }, align);
  }
  const bodyTop = Math.max(350, 188 + title.height + 34);
  const bodyCapacity = PAGE_FOOTER_TOP - bodyTop - 34;
  const pages = await paginateBlocks(post.blocks, bodyCapacity);
  const label = labels[post.kind === "articles" ? "article" : "fatwa"];
  const renderedPages: Buffer[] = [];

  for (let index = 0; index < pages.length; index++) {
    const layers: OverlayOptions[] = [];
    const brand = await renderPageText("بسم الله الرحمن الرحيم", { size: 34, color: "#E6D3A3" }, "center");
    const author = await renderPageText("Sheikh Muhammed Ferej Megeno", { size: 22, color: "#F8F6EF" }, "center");
    const kindLabel = await renderPageText(label, { size: 22, color: "#E6D3A3" }, "center");
    layers.push(
      { input: brand.data, top: 30, left: Math.round((PAGE_WIDTH - brand.width) / 2) },
      { input: author.data, top: 91, left: Math.round((PAGE_WIDTH - author.width) / 2) },
      { input: kindLabel.data, top: 137, left: Math.round((PAGE_WIDTH - kindLabel.width) / 2) },
      { input: title.data, top: 186, left: align === "right" ? PAGE_WIDTH - PAGE_PADDING - title.width : PAGE_PADDING },
    );

    let top = bodyTop;
    let previous: PublicationBlock | undefined;
    for (const block of pages[index]) {
      top += previous ? (previous.kind === "heading" ? 10 : 20) : 0;
      const text = await renderPageText(block.text, styleFor(block), align);
      if (top + text.height > PAGE_FOOTER_TOP - 25) throw new Error("The page layout could not fit all text safely.");
      layers.push({ input: text.data, top, left: align === "right" ? PAGE_WIDTH - PAGE_PADDING - text.width : PAGE_PADDING });
      top += text.height;
      previous = block;
    }

    const pageText = await renderPageText(`${labels.page} ${index + 1} / ${pages.length}`, { size: 20, color: "#8D702F" }, "left");
    const urlText = await renderPageText(post.url.replace(/^https?:\/\//, ""), { size: 17, color: "#52657B" }, "left");
    layers.push(
      { input: pageText.data, top: 1191, left: PAGE_PADDING },
      { input: urlText.data, top: 1233, left: PAGE_PADDING },
    );
    const background = Buffer.from(`<svg width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#F8F6EF"/><path d="M0 0H${PAGE_WIDTH}V330H0Z" fill="#0D3E2F"/><path d="M${PAGE_PADDING} 326H${PAGE_WIDTH - PAGE_PADDING}" stroke="#BF9A45" stroke-width="3"/><rect x="16" y="16" width="${PAGE_WIDTH - 32}" height="${PAGE_HEIGHT - 32}" fill="none" stroke="#BF9A45" stroke-width="3"/><path d="M${PAGE_PADDING} ${PAGE_FOOTER_TOP}H${PAGE_WIDTH - PAGE_PADDING}" stroke="#BF9A45" stroke-width="2"/></svg>`);
    renderedPages.push(await sharp(background).composite(layers).png().toBuffer());
  }
  return renderedPages;
}
