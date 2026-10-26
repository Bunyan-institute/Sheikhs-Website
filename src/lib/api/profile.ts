import { bunyan } from "./client";
import type { PublicProfile } from "./types";

export const FALLBACK_PROFILE: PublicProfile = {
  object: "profile",
  id: "sheikh-ferej",
  name: "Sheikh Muhammed Ferej Megeno",
  headline: "Islamic Scholar, Educator & Sharia Consultant",
  biography: `Sheikh Muhammed Ferej Megeno (الشيخ محمد فرج مجنو) is an experienced Ethiopian Islamic scholar, educator, and certified Sharia consultant with over 35 years of dedicated service in Islamic education, institutional leadership, and Dawah.

Holding a Bachelor's degree in Sharia and Law from the Islamic University of Minnesota (graduating with top honors) and completing his Master’s in Islamic Studies with distinction, he brings deep academic rigor combined with classical scholarship. He is a Certified Sharia Auditor and Controller under global AAOIFI Sharia standards and serves as Sharia Consultant for Wegagen Bank's Islamic banking window.

His foundational training took place in traditional knowledge circles (Halaqat) across Silti and Jimma, mastering Shafi'i jurisprudence, Quranic exegesis (Tafsir), Hadith sciences, and classical Arabic grammar under esteemed regional scholars. As a prolific scholar and community leader, he co-translated the Summary Interpretation of the Holy Quran (Mukhtasar Tafsir) into Amharic, has presented religious television programs on Africa TV, Zawiya TV, and Noor Al-Huda TV since 2008, serves on the African Scholars Union, and presides over the Al-Fajr Islamic Foundation.`,
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
  sections: {
    lectures: true,
    articles: true,
    fatwas: true,
    courses: true,
    library: true,
    events: true,
    questions: true,
  },
  socials: {
    youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
    facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
    telegram: "https://t.me/ustazmuhammadferej",
  },
  location: "Addis Ababa, Ethiopia",
  updated_at: new Date().toISOString(),
};

import { getProfile as getStoredProfile } from "@/lib/db/repository";

export async function getProfile(locale?: string): Promise<PublicProfile> {
  const isArabic = locale === "ar";
  const name = isArabic ? "الشيخ محمد فرج مجنو" : undefined;

  try {
    const stored = getStoredProfile();
    return {
      ...stored,
      name: name || stored.name,
      locale: locale || stored.locale || "en",
      direction: isArabic ? "rtl" : "ltr",
    };
  } catch {
    return {
      ...FALLBACK_PROFILE,
      name: name || FALLBACK_PROFILE.name,
      locale: locale || "en",
      direction: isArabic ? "rtl" : "ltr",
    };
  }
}
