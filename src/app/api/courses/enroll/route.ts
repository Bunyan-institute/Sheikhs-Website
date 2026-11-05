import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createCourseEnrollment, getCourseByIdOrSlug, getEnrollmentByEmail } from "@/lib/db/repository";
import { clean, clientIp, isEmail, rateLimit } from "@/lib/rate-limit";
import type { CourseEnrollmentRecord } from "@/lib/db/types";

/** Only what the learner's own UI needs: no phone, city or other personal fields. */
function publicEnrollment(e: CourseEnrollmentRecord) {
  return {
    id: e.id,
    course_id: e.course_id,
    course_slug: e.course_slug,
    course_title: e.course_title,
    student_name: e.student_name,
    student_email: e.student_email,
    status: e.status,
    completed_lessons: e.completed_lessons,
    exam_attempts: e.exam_attempts,
    certificate_id: e.certificate_id ?? null,
    created_at: e.created_at,
  };
}

export async function POST(req: Request) {
  try {
    const limit = await rateLimit(`enroll:${clientIp(req)}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (data.website) return NextResponse.json({ success: true });

    const name = clean(data.student_name, 120);
    if (!name || !isEmail(data.student_email) || !data.course_id) {
      return NextResponse.json({ error: "Student name, a valid email, and course ID are required." }, { status: 400 });
    }

    const course = await getCourseByIdOrSlug(String(data.course_id));
    if (!course || course.status === "draft") {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    if (!course.enrolment_open) {
      return NextResponse.json({ error: "Enrolment for this course is closed." }, { status: 403 });
    }

    const enrollment = await createCourseEnrollment({
      course_id: course.id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: name,
      student_email: data.student_email,
      student_phone: clean(data.student_phone, 40),
      city: clean(data.city, 80),
    });

    try {
      revalidatePath("/admin/enrollments");
    } catch {
      // Non-blocking outside request contexts
    }

    return NextResponse.json({ success: true, enrollment: publicEnrollment(enrollment) });
  } catch (err) {
    console.error("Enrollment failed:", err);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const limit = await rateLimit(`enroll-lookup:${clientIp(req)}`, 30, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");
    const email = searchParams.get("email");
    if (!courseId || !isEmail(email)) {
      return NextResponse.json({ enrollment: null });
    }
    const enrollment = await getEnrollmentByEmail(courseId, email);
    return NextResponse.json({ enrollment: enrollment ? publicEnrollment(enrollment) : null });
  } catch (err) {
    console.error("Enrollment lookup failed:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
