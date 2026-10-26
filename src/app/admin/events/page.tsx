import { getAllEvents } from "@/lib/db/repository";
import { EventsClient } from "./events-client";

export default function AdminEventsPage() {
  const events = getAllEvents();
  return <EventsClient initialEvents={events} />;
}
