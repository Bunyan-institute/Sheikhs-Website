import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getSessionUser } from "@/lib/auth/session";
import { AdminShell } from "./admin-shell";
import { PwaRegister } from "@/components/admin/pwa/pwa-register";
import type { Viewport } from "next";
import { getSystemMetrics } from "@/lib/db/repository";
import { localeDirections } from "@/i18n/config";
import { getAdminLocale } from "@/lib/admin-locale";
import { getAdminMessages } from "@/lib/admin-messages";

export const metadata = {
  title: "Admin Dashboard | Sheikh Muhammed Ferej Megeno",
  description: "Scholarly Control Center & Dynamic Data Engine",
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/admin.webmanifest",
  applicationName: "Sheikh Admin",
  appleWebApp: { capable: true, title: "ሸይኽ አስተዳደር", statusBarStyle: "default" as const },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0D3E2F",
  viewportFit: "cover",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  const locale = await getAdminLocale();
  const messages = getAdminMessages(locale);
  const dir = localeDirections[locale] ?? "ltr";

  // Anything other than the login page needs a live (non-revoked) session.
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (!session && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  if (session && pathname === "/admin/login") {
    redirect("/admin");
  }

  if (!session) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div dir={dir} lang={locale}>
          <PwaRegister />
          {children}
        </div>
      </NextIntlClientProvider>
    );
  }

  const metrics = await getSystemMetrics();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PwaRegister />
      <AdminShell
        username={session.username}
        pendingInquiriesCount={metrics.pendingInquiries}
        locale={locale}
      >
        {children}
      </AdminShell>
    </NextIntlClientProvider>
  );
}
