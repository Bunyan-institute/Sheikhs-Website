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
    title: `${t("title")} | Sheikh Muhammed Ferej`,
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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                {t("arabicBadge")}
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                {t("subtitle")}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t("description")}
          </p>
        </div>
      </header>

      <section>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group block h-full">
                <article className="border border-[#E6E0D8] bg-white rounded-[4px] h-full flex flex-col hover:border-[#1A4D2E] transition-colors overflow-hidden">
                  <div className="aspect-[16/9] relative bg-[#FAF8F5] border-b border-[#E6E0D8]">
                    {course.cover ? (
                      <img 
                        src={course.cover.url} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#1A4D2E]/40">
                        <GraduationCap className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 end-3">
                      {course.enrolment_open ? (
                        <span className="bg-[#FAF8F5]/95 text-[#1A4D2E] font-semibold px-2.5 py-1 rounded-[2px] text-[11px] border border-[#E6E0D8]">
                          Enrollment Open
                        </span>
                      ) : (
                        <span className="bg-[#FAF8F5]/95 text-[#7A8285] font-semibold px-2.5 py-1 rounded-[2px] text-[11px] border border-[#E6E0D8]">
                          Self-Study Archive
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex gap-2 text-xs">
                        {course.categories?.[0] && (
                          <span className="text-[#1A4D2E] font-bold uppercase tracking-wider text-[11px] bg-[#FAF8F5] border border-[#E6E0D8] px-2 py-0.5 rounded-[2px]">
                            {course.categories[0]}
                          </span>
                        )}
                        <span className="text-[#555E61] bg-[#FAF8F5] border border-[#E6E0D8] px-2 py-0.5 rounded-[2px] text-[11px]">
                          {course.lesson_count || 0} Lessons
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-heading text-base sm:text-lg font-bold text-[#2D3436] mb-2 group-hover:text-[#1A4D2E] transition-colors line-clamp-2 break-words">
                      {course.title}
                    </h3>
                    
                    {course.summary && (
                      <p className="text-[#555E61] line-clamp-2 mb-4 flex-grow text-xs leading-relaxed">
                        {course.summary}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-3 border-t border-[#FAF8F5] text-xs font-semibold text-[#8C6D23] flex items-center justify-between">
                      <span>Course Syllabus &amp; Modules</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E6E0D8] bg-white rounded-[4px]">
            <BookOpen className="w-12 h-12 text-[#7A8285]/50 mx-auto mb-3" />
            <p className="text-[#555E61] text-sm">Courses are currently being updated.</p>
          </div>
        )}
      </section>
    </div>
  );
}
