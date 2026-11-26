import { getPlaylist } from "@/lib/api/playlists";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, FolderKanban, Clock } from "lucide-react";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PlaylistDetailView } from "@/components/playlists/playlist-detail-view";
import { formatDuration } from "@/lib/utils";

interface PlaylistSlugProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PlaylistSlugProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const siteUrl = getSiteUrl();
  const playlist = await getPlaylist(slug, locale);

  if (!playlist) return { title: "Playlist Not Found" };

  const pageUrl = `${siteUrl}/${locale}/playlists/${slug}`;
  const title = `${playlist.title} | Sheikh Muhammed Ferej Megeno`;
  const description =
    playlist.description ||
    `Complete lesson series and sequential audio lectures: ${playlist.title} by Sheikh Muhammed Ferej Megeno.`;
  const imageUrl = playlist.cover?.url ? new URL(playlist.cover.url, siteUrl).href : `${siteUrl}/images/sheikh-portrait.jpg`;

  return {
    title: playlist.title,
    description,
    keywords: ["Islamic Playlists", "Ders Folder", "Sheikh Muhammed Ferej", playlist.title, "Tafsir", "Hadith"],
    alternates: buildHreflangAlternates(`/playlists/${slug}`, locale),
    openGraph: {
      type: "website",
      title,
      description,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: playlist.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PlaylistDetailPage({ params }: PlaylistSlugProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const siteUrl = getSiteUrl();

  const playlist = await getPlaylist(slug, locale);
  if (!playlist) notFound();

  const lectures = playlist.lectures || [];
  const totalSeconds = lectures.reduce((acc, l) => acc + (l.duration_seconds || 0), 0);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Playlists & Folders", url: `${siteUrl}/${locale}/playlists` },
    { name: playlist.title, url: `${siteUrl}/${locale}/playlists/${playlist.slug}` },
  ]);

  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    "@id": `${siteUrl}/${locale}/playlists/${playlist.slug}#series`,
    name: playlist.title,
    description: playlist.description || playlist.title,
    url: `${siteUrl}/${locale}/playlists/${playlist.slug}`,
    numberOfItems: lectures.length,
    hasPart: lectures.map((lec, index) => ({
      "@type": "AudioObject",
      position: lec.series?.position || index + 1,
      name: lec.title,
      url: lec.slug ? `${siteUrl}/${locale}/lectures/${lec.slug}` : new URL(lec.media.audio!, siteUrl).href,
    })),
  };

  return (
    <div className="w-full">
      <JsonLd data={[seriesSchema, breadcrumbs]} />

      {/* Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-12 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/playlists"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E6D3A3] hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{locale === "am" ? "ወደ ሁሉም አቃፊዎች ተመለስ" : locale === "ar" ? "العودة لكافة القوائم" : "Back to All Playlists & Folders"}</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              {playlist.cover?.url ? (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#BF9A45]/40 shrink-0 shadow-lg bg-[#072118]">
                  <Image
                    src={playlist.cover.url}
                    alt={playlist.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#072118] border border-[#BF9A45]/40 flex items-center justify-center text-[#BF9A45] shrink-0">
                  <FolderKanban className="w-10 h-10" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#BF9A45]/20 text-[#E6D3A3] border border-[#BF9A45]/40 text-xs font-bold uppercase tracking-wider">
                    {locale === "am" ? "የደርስ አቃፊ" : locale === "ar" ? "قائمة دروس" : "Lesson Folder"}
                  </span>
                  <span className="text-xs text-[#EDF4F0]/70 font-semibold">
                    {lectures.length} {locale === "am" ? "ደርሶች" : locale === "ar" ? "دروس" : "Derses"}
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#EDF4F0] font-bold leading-tight break-words">
                  {playlist.title}
                </h1>
                {playlist.description && (
                  <p className="text-xs sm:text-sm text-[#EDF4F0]/80 mt-2 max-w-2xl leading-relaxed">
                    {playlist.description}
                  </p>
                )}
                {totalSeconds > 0 && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-[#E6D3A3]/90 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                    <span>Total Duration: {formatDuration(totalSeconds)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Ders List Area */}
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <PlaylistDetailView playlist={playlist} locale={locale} />
      </div>
    </div>
  );
}
