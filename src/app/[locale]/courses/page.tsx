import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCourses } from "@/lib/api/courses";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | Sheikh Ferej",
  description: "Academic Islamic courses and study programs.",
};

export default async function CoursesPage({ 
  params 
}: { 
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const coursesRes = await getCourses({ locale });
  const courses = coursesRes?.data || [];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-bold text-[#2D3436] mb-4">Courses & Programs</h1>
        <p className="text-lg text-[#636E72] max-w-2xl">
          Academic catalog of structured courses and study programs.
        </p>
      </header>

      <section>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group block h-full">
                <article className="border border-[#E0D8CE] bg-white rounded-[4px] h-full flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-[16/9] relative bg-[#FAF8F5] border-b border-[#E0D8CE]">
                    {course.cover ? (
                      <img 
                        src={course.cover.url} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center">
                        <span className="font-heading font-bold text-[#1B5E20] opacity-50 text-xl">
                          {course.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 end-4">
                      {course.enrolment_open ? (
                        <span className="bg-white/90 backdrop-blur text-[#1B5E20] font-semibold px-3 py-1 rounded-[4px] text-xs shadow-sm border border-[#E0D8CE]">
                          Enrollment Open
                        </span>
                      ) : (
                        <span className="bg-[#FAF8F5]/90 backdrop-blur text-[#636E72] font-semibold px-3 py-1 rounded-[4px] text-xs shadow-sm border border-[#E0D8CE]">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 text-xs">
                        {course.categories?.[0] && (
                          <span className="text-[#636E72] font-medium bg-[#FAF8F5] border border-[#E0D8CE] px-2 py-1 rounded-[4px]">
                            {course.categories[0]}
                          </span>
                        )}
                        <span className="text-[#636E72] bg-[#FAF8F5] border border-[#E0D8CE] px-2 py-1 rounded-[4px]">
                          {course.lesson_count || 0} Lessons
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-3 group-hover:text-[#1B5E20] transition-colors line-clamp-2 break-words">
                      {course.title}
                    </h3>
                    
                    {course.summary && (
                      <p className="text-[#636E72] line-clamp-3 mb-6 flex-grow text-sm">
                        {course.summary}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-[#E0D8CE]">
                      <span className="text-[#1B5E20] font-medium flex items-center gap-2 group-hover:text-[#B8860B] transition-colors">
                        View Course Outline &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E0D8CE] bg-white rounded-[4px]">
            <p className="text-[#636E72] text-lg">No courses available at this time.</p>
          </div>
        )}
      </section>
    </div>
  );
}
