import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { localeDirections, type Locale } from "@/i18n/config";
import { getProfile } from "@/lib/api/profile";
import { buildNavigation, buildMoreItems } from "@/lib/sections";
import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { FloatingAppCard } from "@/components/profile/floating-app-card";
import { buildSitelinksNavigationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

// Content is admin-managed in SQLite, so public pages render per request.
export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const profile = await getProfile(locale);

  const messages = await getMessages();
  const dir = localeDirections[locale as Locale] ?? "ltr";
  const nav = buildNavigation(profile.sections);
  const moreItems = buildMoreItems(profile.sections);

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={dir} lang={locale} className="min-h-screen flex flex-col">
        <JsonLd data={[buildSitelinksNavigationSchema(locale)]} />
        <SiteHeader
          profile={profile}
          navigation={nav}
          moreItems={moreItems}
          locale={locale}
        />
        <main className="flex-1">{children}</main>
        <FloatingAppCard playStoreUrl={profile.socials.play_store} />
        <SiteFooter profile={profile} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
