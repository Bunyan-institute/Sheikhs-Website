import { getArticle } from "@/lib/api/articles";
import { getFatwa } from "@/lib/api/fatwas";
import { getLocalizedUrl } from "@/lib/seo";
import { renderPostImage } from "@/lib/share-image";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const query = new URL(request.url).searchParams;
  const locale = query.get("locale") ?? "en";
  if (!(kind === "articles" || kind === "fatwas") || !["en", "am", "ar", "om"].includes(locale)) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  let post;
  try {
    const content = kind === "articles" ? await getArticle(slug, locale) : await getFatwa(slug, locale);
    post = {
      title: content.title,
      excerpt: content.summary || ("body" in content ? content.body : "answer" in content ? content.answer : "") || "",
      url: getLocalizedUrl(`/${kind}/${content.slug}`, locale), kind: kind as "articles" | "fatwas", locale,
    };
  } catch {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  const response = await renderPostImage(post, query.get("format") === "preview");
  if (query.get("download") === "1") response.headers.set("Content-Disposition", `attachment; filename="${kind}-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}.png"`);
  return response;
}
