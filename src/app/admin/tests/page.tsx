import { getAllEvents } from "@/lib/db/repository";
import { TestsClient } from "./tests-client";

export default async function AdminTestsPage() {
  return <TestsClient events={await getAllEvents()} />;
}
