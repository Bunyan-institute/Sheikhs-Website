import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEventRegistration, getEventByIdOrSlug } from "@/lib/db/repository";
import { clean, clientIp, isEmail, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`event-reg:${clientIp(req)}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many registrations. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (data.website) return NextResponse.json({ success: true });

    const name = clean(data.name, 120);
    if (!data.event_id || !name || !isEmail(data.email)) {
      return NextResponse.json({ error: "Event, attendee name, and a valid email are required." }, { status: 400 });
    }

    // Event details come from the database, never from the client.
    const event = await getEventByIdOrSlug(String(data.event_id));
    if (!event || event.status === "draft") {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const attendees = Math.min(20, Math.max(1, parseInt(String(data.attendees_count ?? 1), 10) || 1));
    const registration = await createEventRegistration({
      event_id: event.id,
      event_slug: event.slug,
      event_title: event.title,
      name,
      email: data.email.trim().toLowerCase(),
      phone: clean(data.phone, 40),
      city: clean(data.city, 80),
      attendees_count: attendees,
      notes: clean(data.notes, 1000),
    });

    try {
      revalidatePath("/admin/events");
    } catch {
      // Non-blocking outside request contexts
    }

    return NextResponse.json({ success: true, registration: { id: registration.id, status: registration.status } });
  } catch (err) {
    console.error("Event registration failed:", err);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}
