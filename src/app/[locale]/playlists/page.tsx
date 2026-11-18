import { getAllSeries } from "@/lib/db/repository";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { FolderKanban, ArrowRight, Layers, Music, BookOpen } from "lucide-react";
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

  const playlists = await getAllSeries();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {publishedFolders.map((folder) => {
            const count = folder.lectures?.length ?? folder.lecture_count ?? 0;
            return (
              <Link
                key={folder.id}
                href={`/playlists/${folder.slug}`}
                className="group bg-white border border-[#0F241C]/10 rounded-2xl overflow-hidden shadow-xs hover:border-[#1B6A50] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Folder Tab Visual Accent */}
                  <div className="bg-[#FAF8F5] px-5 py-3 border-b border-[#0F241C]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1B6A50]">
                      <FolderKanban className="w-4 h-4 text-[#BF9A45]" />
                      <span>{locale === "am" ? "አቃፊ" : locale === "ar" ? "مجلد" : "Folder"}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B6A50]/10 text-[#1B6A50] font-bold text-xs border border-[#1B6A50]/20">
                      {count} {locale === "am" ? "ደርሶች" : locale === "ar" ? "دروس" : "Derses"}
                    </span>
                  </div>

                  {/* Folder Cover Image (if available) */}
                  {folder.cover?.url ? (
                    <div className="relative w-full h-40 bg-[#072118] overflow-hidden">
                      <Image
                        src={folder.cover.url}
                        alt={folder.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F241C] group-hover:text-[#1B6A50] transition-colors leading-snug break-words">
                      {folder.title}
                    </h2>

                    {folder.description && (
                      <p className="text-xs sm:text-sm text-[#0F241C]/70 mt-2.5 line-clamp-3 leading-relaxed break-words">
                        {folder.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#FAF8F5]/60 border-t border-[#0F241C]/10 flex items-center justify-between text-xs font-semibold text-[#1B6A50] group-hover:bg-[#1B6A50] group-hover:text-white transition-colors">
                  <span>
                    {locale === "am"
                      ? "አቃፊውን ክፈትና ደርሶችን አዳምጥ"
                      : locale === "ar"
                      ? "فتح المجلد واستماع الدروس"
                      : "Open Folder & Listen"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
