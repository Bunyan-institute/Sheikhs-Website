import { getAllEvents, getAllEventRegistrations } from "@/lib/db/repository";
import { EventsClient } from "./events-client";

export default function AdminEventsPage() {
  const events = getAllEvents();
  const registrations = getAllEventRegistrations();
  return <EventsClient initialEvents={events} initialRegistrations={registrations} />;
}
