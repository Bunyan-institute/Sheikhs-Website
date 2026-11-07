import enMessages from "@/i18n/messages/en.json";
import arMessages from "@/i18n/messages/ar.json";
import amMessages from "@/i18n/messages/am.json";
import omMessages from "@/i18n/messages/om.json";
import type { Locale } from "@/i18n/config";

const adminMessages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ar: arMessages,
  am: amMessages,
  om: omMessages,
};

export function getAdminMessages(locale: Locale): typeof enMessages {
  return adminMessages[locale] ?? adminMessages.am;
}
