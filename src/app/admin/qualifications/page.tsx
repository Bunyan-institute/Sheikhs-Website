import { getQualifications } from "@/lib/db/repository";
import { QualificationsClient } from "./qualifications-client";

export const dynamic = "force-dynamic";

export default async function AdminQualificationsPage() {
  const qualifications = await getQualifications();
  return <QualificationsClient initialQualifications={qualifications} />;
}
