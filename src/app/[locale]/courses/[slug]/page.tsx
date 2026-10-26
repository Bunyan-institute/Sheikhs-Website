import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourse, AUTHENTIC_COURSES } from "@/lib/api/courses";
import { formatDuration } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  const lessons = course.lessons || [];

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

      {course.slug === "comprehensive-kitab-at-tawheed" && (
        <div className="mb-10 bg-emerald-50/60 border border-[#1B5E20]/30 rounded-[4px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1B5E20] mb-1">
              Accompanying Audio Lessons & Classical PDF
            </h3>
            <p className="text-sm text-[#636E72]">
              Access the complete 32-chapter audio exposition and download the full 132-page classical treatise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link 
              href="/series/kitab-at-tawheed"
              className="px-4 py-2 bg-[#1B5E20] text-white rounded text-sm font-semibold hover:bg-[#154a19] transition-colors"
            >
              Listen to 32 Lessons &rarr;
            </Link>
            <Link 
              href="/library/kitab-at-tawheed"
              className="px-4 py-2 bg-white border border-[#E0D8CE] text-[#2D3436] rounded text-sm font-semibold hover:border-[#1B5E20] transition-colors"
            >
              Download PDF &rarr;
            </Link>
          </div>
        </div>
      )}

      <section>
        <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-6 border-b border-[#E0D8CE] pb-2 flex items-center justify-between">
          <span>Course Syllabus</span>
        </h2>
        
        <div className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-[4px] p-4 mb-8 text-sm text-[#636E72] flex items-start gap-3">
          <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>This is the public syllabus outline. Enrolled course materials and lectures are provided through the dedicated student portal.</p>
        </div>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="border border-[#E0D8CE] bg-white rounded-[4px] p-4 sm:p-5 shadow-sm flex gap-3 sm:gap-4 hover:border-[#1B5E20] transition-colors">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] border border-[#E0D8CE] flex items-center justify-center font-heading font-bold text-[#2D3436] text-xs sm:text-sm">
                  {lesson.position ?? (index + 1)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                    <h3 className="font-heading font-semibold text-base sm:text-lg text-[#2D3436] break-words">
                      {lesson.title}
                    </h3>
                    {lesson.duration_seconds && (
                      <span className="self-start sm:self-auto text-[#636E72] text-xs font-medium whitespace-nowrap bg-[#FAF8F5] px-2 py-0.5 sm:py-1 rounded-[4px] border border-[#E0D8CE] shrink-0">
                        {formatDuration(lesson.duration_seconds)}
                      </span>
                    )}
                  </div>
                  {lesson.summary && (
                    <p className="text-[#636E72] text-xs sm:text-sm break-words">
                      {lesson.summary}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-[#E0D8CE] bg-white rounded-[4px]">
            <p className="text-[#636E72]">Syllabus will be published soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
