import type { PublicProfile } from "./types";
import { getProfile as getStoredProfile } from "@/lib/db/repository";

export async function getProfile(locale?: string): Promise<PublicProfile> {
  const stored = await getStoredProfile();
  const isArabic = locale === "ar";
  return {
    ...stored,
    name: isArabic ? "الشيخ محمد فرج مجنو" : stored.name,
    locale: locale || stored.locale || "en",
    direction: isArabic ? "rtl" : "ltr",
  };
}
