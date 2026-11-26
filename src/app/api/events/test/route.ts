import { NextResponse } from "next/server";
import { getEvent } from "@/lib/api/events";
import { getEventTest } from "@/lib/db/repository";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")?.trim() || "";
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) return NextResponse.json({ error: "Invalid test route." }, { status: 400 });
  try {
    const [event, test] = await Promise.all([getEvent(slug), getEventTest(slug)]);
    if (!test) return NextResponse.json({ error: "This event has no test." }, { status: 404 });
    return NextResponse.json({ event: { title: event.title, slug: event.slug, starts_at: event.starts_at }, passing_percentage: test.passing_percentage,
      questions: test.questions.map(({ id, question, options }) => ({ id, question, options })) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "This test is unavailable." }, { status: 404 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const slug = typeof data?.slug === "string" ? data.slug.trim() : "";
    const answers = data?.answers;
    if (!/^[a-z0-9-]{2,80}$/.test(slug) || !answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json({ error: "Test route and answers are required." }, { status: 400 });
    }
    const limit = await rateLimit(`event-test:${clientIp(req)}:${slug}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    await getEvent(slug);
    const test = await getEventTest(slug);
    if (!test) return NextResponse.json({ error: "This test is unavailable." }, { status: 404 });
    if (Object.keys(answers).length !== test.questions.length) return NextResponse.json({ error: "Answer every question before submitting." }, { status: 400 });
    let correct = 0;
    for (const q of test.questions) {
      const answer = answers[q.id];
      if (!Number.isInteger(answer) || answer < 0 || answer >= q.options.length) return NextResponse.json({ error: "One or more answers are invalid." }, { status: 400 });
      if (answer === q.correct_option_index) correct++;
    }
    const score = Math.round((correct / test.questions.length) * 100);
    return NextResponse.json({ success: true, score, passed: score >= test.passing_percentage, correct_count: correct, total_questions: test.questions.length, passing_percentage: test.passing_percentage }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to submit this test." }, { status: 404 }); }
}
