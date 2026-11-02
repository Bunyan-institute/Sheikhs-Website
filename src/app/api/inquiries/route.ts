import { NextResponse } from "next/server";
import { createInquiryAsync } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const questionText = data.body || data.question;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return NextResponse.json(
        { error: "Question content is required." },
        { status: 400 }
      );
    }

    const record = await createInquiryAsync({
      question: questionText.trim(),
      name: data.askerName || data.name,
      email: data.askerEmail || data.email,
      is_anonymous: Boolean(data.is_anonymous || !data.askerName),
      locale: data.locale || "am",
    });

    return NextResponse.json({ object: "question", id: record.id, received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
