import { exportDatabaseJson, getSystemMetrics } from "@/lib/db/repository";
import { BackupClient } from "./backup-client";

export default function AdminBackupPage() {
  const currentJson = exportDatabaseJson();
  const metrics = getSystemMetrics();

  return <BackupClient initialJson={currentJson} metrics={metrics} />;
}
