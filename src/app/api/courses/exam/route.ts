import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { getEnrollmentByEmail, submitCourseExam } from "@/lib/db/repository";
import { clientIp, isEmail, rateLimit } from "@/lib/rate-limit";
import { notifyAdmins } from "@/lib/push";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object" || !data.course_id || !isEmail(data.student_email) || typeof data.answers !== "object" || !data.answers) {
      return NextResponse.json({ error: "Course ID, student email, and answers are required." }, { status: 400 });
    }

    const limit = await rateLimit(`exam:${clientIp(req)}:${data.student_email.toLowerCase()}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many exam attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }

    // Only enrolled students can sit the exam; the student name comes from the enrollment, not the request.
    const enrollment = await getEnrollmentByEmail(String(data.course_id), data.student_email);
    if (!enrollment) {
      return NextResponse.json({ error: "You must enroll in this course before taking the exam." }, { status: 403 });
    }

    const answers: Record<string, number> = {};
    for (const [k, v] of Object.entries(data.answers as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isInteger(v)) answers[k] = v;
    }

    const result = await submitCourseExam({
      course_id: enrollment.course_id,
      student_email: enrollment.student_email,
      student_name: enrollment.student_name,
      answers,
    });

    try {
      revalidatePath("/admin/certificates");
      revalidatePath("/admin/enrollments");
    } catch {
      // Non-blocking
    }

    // News only the first time a student passes (a student who already holds a certificate is just retaking).
    const cert = result.certificate;
    if (result.passed && cert && !enrollment.certificate_id) {
      after(() => notifyAdmins({ kind: "certificate", detail: cert.course_title, url: "/admin/certificates", tag: `certificate-${cert.id}` }));
    }

    const { enrollment: updated, ...rest } = result;
    return NextResponse.json({
      success: true,
      ...rest,
      enrollment: updated && { id: updated.id, course_id: updated.course_id, course_slug: updated.course_slug, course_title: updated.course_title, student_name: updated.student_name, student_email: updated.student_email, created_at: updated.created_at, status: updated.status, certificate_id: updated.certificate_id ?? null, exam_attempts: updated.exam_attempts, completed_lessons: updated.completed_lessons },
    });
  } catch (err) {
    console.error("Exam submission failed:", err);
    const message = err instanceof Error && err.message.startsWith("Exam configuration") ? err.message : "Failed to submit exam";
    return NextResponse.json({ error: message }, { status: message === "Failed to submit exam" ? 500 : 404 });
  }
}
