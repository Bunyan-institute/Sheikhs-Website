import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getSessionUser } from "@/lib/auth/session";
import { AdminShell } from "./admin-shell";
import { getSystemMetrics } from "@/lib/db/repository";
import { locales, defaultLocale, localeDirections, type Locale } from "@/i18n/config";

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
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("admin_locale")?.value;
  const locale: Locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : defaultLocale;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const dir = localeDirections[locale] ?? "ltr";

  // If unauthenticated (e.g. login page), render with i18n provider
  if (!session) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div dir={dir} lang={locale}>
          {children}
        </div>
      </NextIntlClientProvider>
    );
  }

  const metrics = getSystemMetrics();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
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
