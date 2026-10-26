import { getSessionUser } from "@/lib/auth/session";
import { AdminShell } from "./admin-shell";
import { getSystemMetrics } from "@/lib/db/repository";

export const metadata = {
  title: "Admin Dashboard | Sheikh Muhammed Ferej Megeno",
  description: "Scholarly Control Center & Dynamic Data Engine",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  // If unauthenticated (e.g. login page), render standalone
  if (!session) {
    return <>{children}</>;
  }

  const metrics = getSystemMetrics();

  return (
    <AdminShell username={session.username} pendingInquiriesCount={metrics.pendingInquiries}>
      {children}
    </AdminShell>
  );
}
