import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourses } from "@/lib/api/courses";
import type { Metadata } from "next";
import { GraduationCap, ArrowRight, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });
  return {
    title: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    description: t("description"),
  };
}

export default async function CoursesPage({ 
  params 
}: { 
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });

  const coursesRes = await getCourses({ locale });
  const courses = coursesRes?.data || [];

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0F3446] text-[#EDF2EE] py-16 overflow-hidden">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/80 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[#EDF2EE]">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-[#EDF2EE]/75 max-w-xl font-sans leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <section>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="group block h-full">
                  <article className="border border-[#14262E]/10 bg-white rounded-2xl h-full flex flex-col hover:border-[#1D6A5A] transition-all shadow-xs overflow-hidden">
                    <div className="aspect-[16/9] relative bg-[#EDF2EE] border-b border-[#14262E]/10">
                      {course.cover ? (
                        <img 
                          src={course.cover.url} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#1D6A5A]/30">
                          <GraduationCap className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 end-3">
                        {course.enrolment_open ? (
                          <span className="bg-[#0A2532]/90 backdrop-blur-xs text-[#EDF2EE] font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#BF9A45]/30">
                            Enrollment Open
                          </span>
                        ) : (
                          <span className="bg-[#EDF2EE]/90 text-[#14262E]/70 font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#14262E]/10">
                            Self-Study Archive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex gap-2 text-xs">
                          {course.categories?.[0] && (
                            <span className="text-[#1D6A5A] font-semibold uppercase tracking-wider text-[11px] bg-[#1D6A5A]/10 border border-[#1D6A5A]/20 px-2.5 py-0.5 rounded-full">
                              {course.categories[0]}
                            </span>
                          )}
                          <span className="text-[#14262E]/60 bg-[#EDF2EE] border border-[#14262E]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                            {course.lesson_count || 0} Lessons
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-display text-lg font-semibold text-[#14262E] mb-2 group-hover:text-[#1D6A5A] transition-colors line-clamp-2 break-words">
                        {course.title}
                      </h3>
                      
                      {course.summary && (
                        <p className="text-xs text-[#14262E]/70 line-clamp-3 mb-4 leading-relaxed flex-grow font-sans">
                          {course.summary}
                        </p>
                      )}
                      
                      <div className="mt-auto text-xs font-semibold text-[#BF9A45] flex items-center justify-between border-t border-[#14262E]/10 pt-3">
                        <span>Study Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#14262E]/10 bg-white rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-[#14262E]/30 mx-auto mb-3" />
              <p className="text-[#14262E]/60 text-sm">No structured courses are available at this time.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}