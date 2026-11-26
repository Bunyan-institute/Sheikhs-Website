import { notFound } from "next/navigation";
import { getEvent } from "@/lib/api/events";
import { getEventTest } from "@/lib/db/repository";
import { EventTestClient } from "./test-client";

export default async function EventTestPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const [event, test] = await Promise.all([getEvent(slug).catch(() => null), getEventTest(slug)]);
  if (!event || !test || !test.is_open) notFound();
  return <EventTestClient slug={slug} title={event.title} />;
}
