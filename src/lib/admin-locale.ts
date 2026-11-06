import { cookies } from "next/headers";
import { locales, type Locale } from "@/i18n/config";

/** The admin opens in Amharic unless the user picked another language (cookie `admin_locale`). */
export const adminDefaultLocale: Locale = "am";

export async function getAdminLocale(): Promise<Locale> {
  const raw = (await cookies()).get("admin_locale")?.value;
  return locales.includes(raw as Locale) ? (raw as Locale) : adminDefaultLocale;
}
