import type { QuestionReceipt } from "./types";

export async function submitQuestion(data: {
  body: string;
  askerName?: string;
  askerEmail?: string;
  locale?: string;
}): Promise<QuestionReceipt> {
  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Inquiry submission failed with status ${res.status}`);
  }
  return res.json();
}
