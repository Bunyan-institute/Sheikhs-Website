import { exportDatabaseJson, getSystemMetrics } from "@/lib/db/repository";
import { BackupClient } from "./backup-client";

export default async function AdminBackupPage() {
  const currentJson = await exportDatabaseJson();
  const metrics = await getSystemMetrics();

  return <BackupClient initialJson={currentJson} metrics={metrics} />;
}
