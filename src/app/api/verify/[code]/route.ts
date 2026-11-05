import { NextResponse } from "next/server";
import { getCertificateByCode } from "@/lib/db/repository";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request, props: { params: Promise<{ code: string }> }) {
  try {
    const limit = rateLimit(`verify:${clientIp(req)}`, 60, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }

    const { code } = await props.params;
    if (!code) {
      return NextResponse.json({ error: "Code parameter is required" }, { status: 400 });
    }

    const cert = await getCertificateByCode(code);
    if (!cert) {
      return NextResponse.json({ verified: false, error: "Certificate not found or unverified" }, { status: 404 });
    }

    // Public verification confirms authenticity without exposing the student's email or the signing token.
    return NextResponse.json({
      verified: !cert.revoked,
      revoked: cert.revoked,
      revoked_reason: cert.revoked_reason,
      certificate: {
        id: cert.id,
        student_name: cert.student_name,
        course_title: cert.course_title,
        course_slug: cert.course_slug,
        score_percentage: cert.score_percentage,
        grade_title: cert.grade_title,
        issued_at: cert.issued_at,
        hijri_date: cert.hijri_date,
        instructor_name: cert.instructor_name,
        authority_seal: cert.authority_seal,
      },
    });
  } catch (err) {
    console.error("Certificate verification failed:", err);
    return NextResponse.json({ error: "Verification lookup failed" }, { status: 500 });
  }
}
