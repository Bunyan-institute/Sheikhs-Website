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
import type { PublicProfile, SectionMap } from "@/lib/api/types";

const DEFAULT_SECTIONS: SectionMap = {
  lectures: true,
  articles: true,
  fatwas: true,
  courses: true,
  library: true,
  events: true,
  questions: true,
};

const FALLBACK_PROFILE: PublicProfile = {
  object: "profile",
  id: "sheikh-ferej",
  name: "Sheikh Muhammed Ferej Megeno",
  headline: "Islamic Scholar, Educator & Sharia Consultant",
  biography: "Sheikh Muhammed Ferej Megeno (الشيخ محمد فرج مجنو) is an Ethiopian Islamic scholar, educator, and certified Sharia consultant with over 35 years of service in Islamic education, institutional leadership, and Dawah.",
  languages: ["ar", "am", "en", "om"],
  locale: "en",
  direction: "ltr",
  photo: {
    object: "media",
    id: "med_portrait",
    kind: "image",
    url: "/images/sheikh-portrait.jpg",
    mime_type: "image/jpeg",
    width: 1280,
    height: 1280,
    duration_seconds: null,
  },
  sections: DEFAULT_SECTIONS,
  socials: {
    youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
    facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
    telegram: "https://t.me/ustazmuhammadferej",
  },
  updated_at: new Date().toISOString(),
};

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

  let profile: PublicProfile;
  try {
    profile = await getProfile(locale);
  } catch {
    profile = FALLBACK_PROFILE;
  }

  const messages = await getMessages();
  const dir = localeDirections[locale as Locale] ?? "ltr";
  const nav = buildNavigation(profile.sections);
  const moreItems = buildMoreItems(profile.sections);

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={dir} lang={locale} className="min-h-screen flex flex-col">
        <SiteHeader
          profile={profile}
          navigation={nav}
          moreItems={moreItems}
          locale={locale}
        />
        <main className="flex-1">{children}</main>
        <FloatingAppCard />
        <SiteFooter profile={profile} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
