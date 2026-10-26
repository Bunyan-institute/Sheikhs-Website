import { NextResponse } from "next/server";
import { createCourseEnrollment, getEnrollmentByEmail } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.student_email || !data.course_id || !data.student_name) {
      return NextResponse.json(
        { error: "Student name, email, and course ID are required." },
        { status: 400 }
      );
    }

    const enrollment = createCourseEnrollment({
      course_id: data.course_id,
      course_slug: data.course_slug || data.course_id,
      course_title: data.course_title || "Course Program",
      student_name: data.student_name,
      student_email: data.student_email,
      student_phone: data.student_phone,
      city: data.city,
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to enroll" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");
    const email = searchParams.get("email");

    if (!courseId || !email) {
      return NextResponse.json({ enrollment: null });
    }

    const enrollment = getEnrollmentByEmail(courseId, email);
    return NextResponse.json({ enrollment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
