import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourses } from "@/lib/api/courses";
import { ArrowRight, GraduationCap } from "lucide-react";
import { getSiteUrl, buildHreflangAlternates, buildBreadcrumbSchema, buildCollectionSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/courses`;
  const title = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = t("subtitle");
  const imageUrl = `${siteUrl}/images/sheikh-portrait.jpg`;

  return {
    title,
    description,
    keywords: [
      "Islamic Courses Online",
      "Fiqh Courses Ethiopia",
      "AAOIFI Curriculum",
      "Sheikh Muhammed Ferej Academy",
      "Bunyan Institute Courses",
      "የኢስላማዊ ኮርሶች",
      "دورات شرعية",
    ],
    alternates: buildHreflangAlternates("/courses", locale),
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

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });
  const siteUrl = getSiteUrl();

  const coursesRes = await getCourses({ locale });
  const courses = coursesRes?.data || [];

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title"), url: `${siteUrl}/${locale}/courses` },
  ]);

  const collectionSchema = buildCollectionSchema({
    name: `${t("title")} - Sheikh Muhammed Ferej`,
    description: t("subtitle"),
    url: `${siteUrl}/${locale}/courses`,
    inLanguage: locale,
    items: courses.map((c) => ({
      name: c.title,
      url: `${siteUrl}/${locale}/courses/${c.slug}`,
      description: c.summary || undefined,
    })),
  });

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
        <section>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="group block h-full">
                  <article className="interactive-card border border-[#0F241C]/10 bg-white rounded-2xl h-full flex flex-col hover:border-[#BF9A45] transition-all shadow-xs overflow-hidden cursor-pointer">
                    <div className="aspect-[16/9] relative bg-[#EDF4F0] border-b border-[#0F241C]/10">
                      {course.cover ? (
                        <img 
                          src={course.cover.url} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#1B6A50]/30">
                          <GraduationCap className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 end-3">
                        {course.enrolment_open ? (
                          <span className="bg-[#072118]/90 backdrop-blur-xs text-[#EDF4F0] font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#BF9A45]/30">
                            Enrollment Open
                          </span>
                        ) : (
                          <span className="bg-[#EDF4F0]/90 text-[#0F241C]/70 font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#0F241C]/10">
                            Self-Study Archive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex gap-2 text-xs">
                          {course.categories?.[0] && (
                            <span className="text-[#1B6A50] font-semibold uppercase tracking-wider text-[11px] bg-[#1B6A50]/10 border border-[#1B6A50]/20 px-2.5 py-0.5 rounded-full">
                              {course.categories[0]}
                            </span>
                          )}
                          <span className="text-[#0F241C]/60 bg-[#EDF4F0] border border-[#0F241C]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                            {course.lesson_count || 0} Lessons
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F241C] mb-2 group-hover:text-[#1B6A50] transition-colors line-clamp-2 break-words">
                        {course.title}
                      </h3>
                      
                      {course.summary && (
                        <p className="text-xs text-[#0F241C]/70 line-clamp-3 mb-4 leading-relaxed flex-grow font-sans">
                          {course.summary}
                        </p>
                      )}
                      
                      <div className="mt-auto text-xs font-semibold text-[#BF9A45] flex items-center justify-between border-t border-[#0F241C]/10 pt-3">
                        <span>Study Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#0F241C]/10 bg-white rounded-2xl p-8">
              <GraduationCap className="w-12 h-12 text-[#0F241C]/30 mx-auto mb-3" />
              <p className="text-[#0F241C]/60 text-sm">No structured courses available at this moment.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
