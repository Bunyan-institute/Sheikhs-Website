import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourse, AUTHENTIC_COURSES } from "@/lib/api/courses";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseExam } from "@/lib/db/repository";
import { CourseLearningView } from "./course-learning-view";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const c of AUTHENTIC_COURSES) {
      params.push({ locale, slug: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const course = await getCourse(slug, locale);
    return {
      title: `${course.title} | Sheikh Muhammed Ferej Megeno`,
      description: course.summary || "View course outline and details.",
    };
  } catch {
    return {
      title: "Course Not Found | Sheikh Muhammed Ferej",
    };
  }
}

export default async function CoursePage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let course;
  try {
    course = await getCourse(slug, locale);
  } catch (error) {
    notFound();
  }

  const examConfig = getCourseExam(slug);

  return (
    <div className="w-full bg-[#EDF2EE] py-10 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D6A5A] hover:text-[#0F3446] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#BF9A45]" />
            All Courses &amp; Syllabi
          </Link>
        </div>

        {/* Course Header Banner */}
        <header className="mb-10 border border-[#14262E]/10 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="md:flex">
            <div className="md:w-2/5 aspect-[4/3] relative bg-[#EDF2EE] border-b md:border-b-0 md:border-e border-[#14262E]/10">
              {course.cover ? (
                <img 
                  src={course.cover.url} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                  <span className="font-display font-bold text-[#1D6A5A] text-2xl break-words">
                    {course.title}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8 md:p-10 md:w-3/5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                {course.enrolment_open ? (
                  <span className="bg-[#1D6A5A]/10 text-[#1D6A5A] font-semibold px-3 py-1 rounded-full text-xs border border-[#1D6A5A]/20">
                    Enrollment Open
                  </span>
                ) : (
                  <span className="bg-[#EDF2EE] text-[#14262E]/70 font-semibold px-3 py-1 rounded-full border border-[#14262E]/10 text-xs">
                    Self-Study Archive
                  </span>
                )}
                <span className="text-[#14262E]/60 text-xs font-medium">
                  {course.lesson_count || 0} Lessons
                </span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#14262E] mb-4 break-words">
                {course.title}
              </h1>
              
              {course.summary && (
                <p className="text-[#14262E]/70 text-base sm:text-lg leading-relaxed font-sans break-words">
                  {course.summary}
                </p>
              )}
            </div>
          </div>
        </header>

        {course.description && (
          <section className="mb-10 bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-[#14262E] mb-4 border-b border-[#14262E]/10 pb-3">
              Course Description &amp; Scholarly Scope
            </h2>
            <div 
              className="prose prose-base max-w-none text-[#14262E]/80 leading-relaxed font-sans break-words"
              dangerouslySetInnerHTML={{ __html: course.description }} 
            />
          </section>
        )}

        {course.slug === "comprehensive-riyadus-saliheen" && (
          <div className="mb-10 bg-[#0F3446] text-[#EDF2EE] border border-[#BF9A45]/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <h3 className="font-display font-bold text-xl text-[#E6D3A3] mb-1">
                Audio Exposition by Sheikh Muhammed Ferej
              </h3>
              <p className="text-sm text-[#EDF2EE]/80 max-w-xl leading-relaxed">
                Listen to the comprehensive classroom audio exposition and study series by Sheikh Muhammed Ferej, broadcast across multiple seasons.
              </p>
            </div>
            <div className="relative flex flex-wrap gap-3 shrink-0">
              <Link
                href="/series"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full text-[#0A2532] bg-[#BF9A45] hover:bg-[#E6D3A3] transition-colors"
              >
                Browse Audio Series
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#EDF2EE]/30 text-[#EDF2EE] rounded-full text-xs font-semibold hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Listen in Mobile App &rarr;</span>
              </a>
            </div>
          </div>
        )}

        <section>
          <CourseLearningView
            course={course}
            initialExam={examConfig}
          />
        </section>
      </div>
    </div>
  );
}