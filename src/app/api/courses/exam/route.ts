import { NextResponse } from "next/server";
import { submitCourseExam } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.course_id || !data.student_email || !data.answers) {
      return NextResponse.json(
        { error: "Course ID, student email, and answers are required." },
        { status: 400 }
      );
    }

    const result = submitCourseExam({
      course_id: data.course_id,
      student_email: data.student_email,
      student_name: data.student_name,
      answers: data.answers,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit exam" }, { status: 500 });
  }
}
