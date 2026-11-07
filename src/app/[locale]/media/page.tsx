import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getMedia, type MediaItem } from "@/lib/api/media";
import { getProfile } from "@/lib/api/profile";
import { MediaCard } from "@/components/media/media-card";
import { ArrowRight } from "lucide-react";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema, buildCollectionSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "media" });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/media`;
  const title = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = t("subtitle");
  const imageUrl = `${siteUrl}/images/sheikh-portrait.jpg`;

  return {
    title,
    description,
    keywords: [
      "Islamic Audio Archives",
      "Sheikh Muhammed Ferej Lectures",
      "Ethiopian Islamic Halaqat",
      "Tafsir Audio",
      "የድምፅና ምስል ማዕከል",
      "تسجيلات ومرئيات",
    ],
    alternates: buildHreflangAlternates("/media", locale),
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function MediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { locale } = await params;
  const { kind } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "media" });
  const siteUrl = getSiteUrl();

  const currentKind = kind || "all";
  let allMedia: MediaItem[] = [];
  try {
    allMedia = await getMedia({ locale });
  } catch (error) {
    console.error("Failed to fetch media", error);
  }

  const { socials } = await getProfile(locale);

  // URL values are plural (videos, photos, documents); media kinds are singular.
  const kindOf: Record<string, MediaItem["kind"]> = { audio: "audio", videos: "video", photos: "image", documents: "document" };
  const media = currentKind === "all" ? allMedia : allMedia.filter((m) => m.kind === kindOf[currentKind]);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title"), url: `${siteUrl}/${locale}/media` },
  ]);

  const collectionSchema = buildCollectionSchema({
    name: `${t("title")} - Sheikh Muhammed Ferej`,
    description: t("subtitle"),
    url: `${siteUrl}/${locale}/media`,
    inLanguage: locale,
    items: media.slice(0, 30).map((m) => ({
      name: m.title,
      url: m.url ? (m.url.startsWith("http") ? m.url : `${siteUrl}${m.url}`) : `${siteUrl}/${locale}/media#${m.id}`,
      description: m.description || undefined,
    })),
  });

  const kinds = [
    { label: "All Media Archives", value: "all" },
    { label: "Audio Halaqat (Audio)", value: "audio" },
    { label: "Photo Timeline (Images)", value: "photos" },
    { label: "Documents & Treatises", value: "documents" },
    { label: "Video Discourses", value: "videos" },
  ];

  return (
    <div className="w-full">
      <JsonLd data={[collectionSchema, breadcrumbs]} />
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Official Archives Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-12">
          <a
            href={socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl border border-[#0F241C]/10 bg-white hover:border-[#1B6A50] transition-all flex items-center gap-4 group shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#BF9A45]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#BF9A45] tracking-wider">Official Video Archive</div>
              <div className="text-sm font-display font-semibold text-[#0F241C] group-hover:text-[#1B6A50] truncate">Full Video Discourses</div>
              <div className="text-xs text-[#0F241C]/60">YouTube Archive Playlist</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
          </a>

          <a
            href={socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl border border-[#0F241C]/10 bg-white hover:border-[#1B6A50] transition-all flex items-center gap-4 group shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#1B6A50]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.941z"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#1B6A50] tracking-wider">Telegram Channel</div>
              <div className="text-sm font-display font-semibold text-[#0F241C] group-hover:text-[#1B6A50] truncate">Halaqat &amp; Audio Updates</div>
              <div className="text-xs text-[#0F241C]/60">Direct Telegram Broadcast</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
          </a>

          <a
            href={socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl border border-[#0F241C]/10 bg-white hover:border-[#1B6A50] transition-all flex items-center gap-4 group shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#1B6A50]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#1B6A50] tracking-wider">Facebook Discourses</div>
              <div className="text-sm font-display font-semibold text-[#0F241C] group-hover:text-[#1B6A50] truncate">Ustaz Muhammad ferej</div>
              <div className="text-xs text-[#0F241C]/60">330,000+ Community Learners</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#BF9A45]" />
          </a>
        </div>

        {/* Kind Filters */}
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-10 pb-4 border-b border-[#0F241C]/10">
          {kinds.map((tab) => (
            <Link
              key={tab.value}
              href={`/media?kind=${tab.value}`}
              className={`px-4 py-2 rounded-full font-medium text-xs transition-colors min-h-[36px] flex items-center ${
                currentKind === tab.value
                  ? "bg-[#0D3E2F] text-[#EDF4F0] shadow-xs"
                  : "text-[#0F241C]/75 hover:text-[#0F241C] hover:bg-white border border-[#0F241C]/15"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-20 bg-white border border-[#0F241C]/10 rounded-2xl p-8">
            <p className="text-[#0F241C]/60 text-sm">No media items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
