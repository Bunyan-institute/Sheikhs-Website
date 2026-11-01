import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourse, AUTHENTIC_COURSES } from "@/lib/api/courses";
import { formatDuration } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseExam } from "@/lib/db/repository";
import { CourseLearningView } from "./course-learning-view";

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
      title: `${course.title} | Sheikh Ferej`,
      description: course.summary || "View course outline and details.",
    };
  } catch {
    return {
      title: "Course Not Found | Sheikh Ferej",
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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <div className="mb-8">
        <Link 
          href="/courses" 
          className="inline-flex items-center text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors"
        >
          &larr; All Courses & Syllabi
        </Link>
      </div>

      <header className="mb-12 border border-[#E0D8CE] rounded-[4px] overflow-hidden bg-white shadow-sm">
        <div className="md:flex">
          <div className="md:w-2/5 aspect-[4/3] relative bg-[#FAF8F5] border-b md:border-b-0 md:border-e border-[#E0D8CE]">
            {course.cover ? (
              <img 
                src={course.cover.url} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6 text-center">
                <span className="font-heading font-bold text-[#B8860B] text-2xl break-words">
                  {course.title}
                </span>
              </div>
            )}
          </div>
          <div className="p-5 sm:p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              {course.enrolment_open ? (
                <span className="bg-[#1B5E20] text-white font-semibold px-3 py-1 rounded-[4px] text-xs">
                  Enrollment Open
                </span>
              ) : (
                <span className="bg-[#FAF8F5] text-[#636E72] font-semibold px-3 py-1 rounded-[4px] border border-[#E0D8CE] text-xs">
                  Enrollment Closed
                </span>
              )}
              <span className="text-[#636E72] text-sm font-medium">
                {course.lesson_count || 0} Lessons
              </span>
            </div>
            
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436] mb-4 break-words">
              {course.title}
            </h1>
            
            {course.summary && (
              <p className="text-[#636E72] text-base sm:text-lg break-words">
                {course.summary}
              </p>
            )}
          </div>
        </div>
      </header>

      {course.description && (
        <section className="mb-12 prose prose-lg max-w-none text-[#2D3436] break-words">
          <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-4 border-b border-[#E0D8CE] pb-2">
            Course Description
          </h2>
          <div dangerouslySetInnerHTML={{ __html: course.description }} />
        </section>
      )}

      {(course.slug === "comprehensive-riyadus-saliheen" || course.slug === "comprehensive-kitab-at-tawheed") && (
        <div className="mb-10 bg-[#FAF8F5] border border-[#1A4D2E]/30 rounded-[4px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1A4D2E] mb-1">
              Audio Exposition by Sheikh Muhammed Ferej
            </h3>
            <p className="text-sm text-[#555E61]">
              Listen to the comprehensive classroom audio exposition and study series by Sheikh Muhammed Ferej.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/series"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1A4D2E] border border-[#1A4D2E] hover:bg-[#1A4D2E]/10 rounded-[2px] transition-colors"
            >
              Browse Audio Series
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1A4D2E] text-white rounded-[2px] text-xs font-semibold hover:bg-[#143d24] transition-colors inline-flex items-center gap-1.5"
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
  );
}
