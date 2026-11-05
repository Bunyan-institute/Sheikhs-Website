import { getAllEvents, getAllEventRegistrations } from "@/lib/db/repository";
import { EventsClient } from "./events-client";

export default async function AdminEventsPage() {
  const events = await getAllEvents();
  const registrations = await getAllEventRegistrations();
  return <EventsClient initialEvents={events} initialRegistrations={registrations} />;
}
