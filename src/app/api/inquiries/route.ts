import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const record = createInquiry({
      question: data.body || data.question,
      name: data.askerName || data.name,
      email: data.askerEmail || data.email,
      is_anonymous: Boolean(data.is_anonymous || !data.askerName),
      locale: data.locale,
    });
    return NextResponse.json({ object: "question", id: record.id, received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
