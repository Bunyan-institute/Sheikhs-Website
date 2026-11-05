import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/db/repository";
import { clean, clientIp, isEmail, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`inquiry:${clientIp(req)}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many questions submitted. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    // Honeypot: real users never fill this hidden field.
    if (data.website) return NextResponse.json({ object: "question", id: "ok", received: true });

    const question = clean(data.body ?? data.question, 5000);
    if (!question || question.length < 5) {
      return NextResponse.json({ error: "Question content is required." }, { status: 400 });
    }
    const email = clean(data.askerEmail ?? data.email, 254);
    if (email && !isEmail(email)) {
      return NextResponse.json({ error: "Email address is not valid." }, { status: 400 });
    }
    const name = clean(data.askerName ?? data.name, 120);

    const record = await createInquiry({
      question,
      name,
      email,
      is_anonymous: Boolean(data.is_anonymous || !name),
      locale: clean(data.locale, 8) || "am",
    });

    return NextResponse.json({ object: "question", id: record.id, received: true });
  } catch (err) {
    console.error("Inquiry submission failed:", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
