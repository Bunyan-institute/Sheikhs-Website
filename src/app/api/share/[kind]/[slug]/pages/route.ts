import { getArticle } from "@/lib/api/articles";
import { getFatwa } from "@/lib/api/fatwas";
import { getLocalizedUrl } from "@/lib/seo";
import { renderPublicationPages } from "@/lib/share-image";
import { publicationBlocks, zipPngPages, type PublicationBlock } from "@/lib/share-pages";

export const runtime = "nodejs";

const allowedLocales = ["en", "am", "ar", "om"];
const labels = {
  en: { question: "Question", answer: "Scholar’s answer", summary: "Summary" },
  ar: { question: "السؤال", answer: "جواب الشيخ", summary: "الملخص" },
  am: { question: "ጥያቄ", answer: "የሼኩ መልስ", summary: "ማጠቃለያ" },
  om: { question: "Gaaffii", answer: "Deebii sheekichaa", summary: "Cuunfaa" },
} as const;

export async function GET(request: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const locale = new URL(request.url).searchParams.get("locale") ?? "en";
  if (!(kind === "articles" || kind === "fatwas") || !allowedLocales.includes(locale)) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const pageLabels = labels[locale as keyof typeof labels];
  let title = "";
  let blocks: PublicationBlock[] = [];
  try {
    if (kind === "articles") {
      const article = await getArticle(slug, locale);
      title = article.title;
      if (article.summary) blocks.push({ kind: "heading", text: pageLabels.summary }, ...publicationBlocks(article.summary));
      blocks.push(...publicationBlocks(article.body));
    } else {
      const fatwa = await getFatwa(slug, locale);
      title = fatwa.title;
      if (fatwa.question) blocks.push({ kind: "heading", text: pageLabels.question }, ...publicationBlocks(fatwa.question));
      if (fatwa.answer) blocks.push({ kind: "heading", text: pageLabels.answer }, ...publicationBlocks(fatwa.answer));
      if (fatwa.summary) blocks.unshift({ kind: "paragraph", text: fatwa.summary });
    }
  } catch {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const url = getLocalizedUrl(`/${kind}/${slug}`, locale);
    const pages = await renderPublicationPages({ title, url, kind, locale, blocks });
    const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "-");
    const archive = zipPngPages(pages.map((data, index) => ({
      name: `${kind}-${safeSlug}-${String(index + 1).padStart(3, "0")}.png`,
      data,
    })));
    return new Response(new Uint8Array(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${kind}-${safeSlug}-pages.zip"`,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return Response.json({ error: "Image export failed" }, { status: 500 });
  }
}
