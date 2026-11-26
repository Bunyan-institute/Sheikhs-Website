import { getPlaylists } from "@/lib/api/playlists";
import { PublicPlaylistCatalog } from "@/components/playlists/public-playlist-catalog";
import { setRequestLocale } from "next-intl/server";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteUrl = getSiteUrl();

  const title =
    locale === "am"
      ? "የደርስ አቃፊዎችና የትምህርት ስብስቦች"
      : locale === "ar"
      ? "قوائم التشغيل ومجلدات الدروس"
      : locale === "om"
      ? "Kutaalee fi Tarree Darsii"
      : "Playlists & Lesson Folders";

  const description =
    locale === "am"
      ? "የኡስታዝ ሙሐመድ ፈረጅ የተሟሉ የድምፅና ምስል ትምህርቶች በቁጥር በተደረደሩ አቃፊዎችና የደርስ ስብስቦች።"
      : locale === "ar"
      ? "مكتبة الدروس المنهجية والسلاسل العلمية المرتبة في مجلدات وقوائم تشغيل لفضيلة الشيخ محمد فرج."
      : "Official audio and video ders collections of Sheikh Muhammed Ferej, organized in sequential numbered folders.";

  return {
    title,
    description,
    keywords: [
      "Islamic Playlists",
      "Ders Folders",
      "Sheikh Muhammed Ferej",
      "የደርስ አቃፊዎች",
      "قوائم تشغيل الدروس",
      "አርበዒን ነወውያ",
      "ኡሱሉል ኢማን",
      "ረውደቱል አንዋር",
    ],
    alternates: buildHreflangAlternates("/playlists", locale),
    openGraph: {
      type: "website",
      title: `${title} | Sheikh Muhammed Ferej Megeno`,
      description,
      url: `${siteUrl}/${locale}/playlists`,
      images: [{ url: `${siteUrl}/images/sheikh-portrait.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Sheikh Muhammed Ferej Megeno`,
      description,
      images: [`${siteUrl}/images/sheikh-portrait.jpg`],
    },
  };
}

export default async function PlaylistsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteUrl = getSiteUrl();

  const playlists = await getPlaylists(locale);
  const publishedFolders = playlists.filter((p) => p.status !== "draft");

  const totalDerses = publishedFolders.reduce(
    (sum, p) => sum + (p.lectures?.length ?? p.lecture_count ?? 0),
    0
  );

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    {
      name:
        locale === "am"
          ? "አቃፊዎችና የደርስ ስብስቦች"
          : locale === "ar"
          ? "قوائم التشغيل"
          : "Playlists & Folders",
      url: `${siteUrl}/${locale}/playlists`,
    },
  ]);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumbs} />

      {/* Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  قوائم التشغيل والدروس المنهجية
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  Structured Study Curricula
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0] font-bold">
                {locale === "am"
                  ? "የደርስ አቃፊዎችና ስብስቦች"
                  : locale === "ar"
                  ? "قوائم التشغيل ومجلدات الدروس"
                  : locale === "om"
                  ? "Kutaalee fi Tarree Darsii"
                  : "Playlists & Lesson Folders"}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {locale === "am"
                ? `በኡስታዝ ሙሐመድ ፈረጅ የተሰጡ ${totalDerses}+ የተሟሉ የድምፅ ደርሶች በ ${publishedFolders.length} የተደራጁ አቃፊዎች ውስጥ ይገኛሉ። ደርሶቹን በቅደም ተከተል ያዳምጡና ያውርዱ።`
                : locale === "ar"
                ? `أكثر من ${totalDerses} درس منهجي في ${publishedFolders.length} مجلداً علمياً مرتباً تسلسلياً مع إمكانية الاستماع المباشر والتحميل السريع.`
                : `Over ${totalDerses}+ sequential audio and video lessons arranged in ${publishedFolders.length} dedicated curriculum folders.`}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Folder Grid */}
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <PublicPlaylistCatalog locale={locale} />
      </div>
    </div>
  );
}
