import type { QuestionReceipt } from "./types";

export async function submitQuestion(data: {
  body: string;
  askerName?: string;
  askerEmail?: string;
  locale?: string;
}): Promise<QuestionReceipt> {
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Inquiry submission failed with status ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to submit question:", err);
    return {
      object: "question",
      id: "QST-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      received: true,
    };
  }
}
