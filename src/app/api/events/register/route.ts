import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEventRegistrationAsync } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.event_id || !data.name || !data.email) {
      return NextResponse.json(
        { error: "Event ID, attendee name, and email are required." },
        { status: 400 }
      );
    }

    const registration = await createEventRegistrationAsync({
      event_id: data.event_id,
      event_slug: data.event_slug || data.event_id,
      event_title: data.event_title || "Event Attendance",
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      city: data.city,
      attendees_count: data.attendees_count ? parseInt(data.attendees_count, 10) : 1,
      notes: data.notes,
    });

    try {
      revalidatePath("/admin/events");
    } catch {
      // Non-blocking in non-request contexts
    }

    return NextResponse.json({ success: true, registration });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to register for event" },
      { status: 500 }
    );
  }
}
