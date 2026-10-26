import type { PortalDatabase } from "./types";
import type { MediaRef } from "@/lib/api/types";
import { AUTHENTIC_LECTURES } from "@/lib/api/lectures";
import { AUTHENTIC_SERIES } from "@/lib/api/series";
import { AUTHENTIC_ARTICLES } from "@/lib/api/articles";
import { AUTHENTIC_FATWAS } from "@/lib/api/fatwas";
import { AUTHENTIC_COURSES } from "@/lib/api/courses";
import { AUTHENTIC_BOOKS } from "@/lib/api/library";
import { AUTHENTIC_EVENTS } from "@/lib/api/events";
import { journeyData } from "@/data/journey";
import { qualifications } from "@/data/qualifications";

const SEED_MEDIA_ITEMS: MediaRef[] = [
  {
    object: "media",
    id: "med_portrait",
    kind: "image",
    url: "/images/sheikh-portrait.jpg",
    mime_type: "image/jpeg",
    width: 1280,
    height: 1280,
    duration_seconds: null,
  },
  ...Array.from({ length: 17 }, (_, i) => ({
    object: "media" as const,
    id: `med_gallery_photo_${i + 1}`,
    kind: "image" as const,
    url: `/images/photo_${i + 1}_2026-09-30_23-42-17.jpg`,
    mime_type: "image/jpeg",
    width: 1280,
    height: 960,
    duration_seconds: null,
  })),
  {
    object: "media",
    id: "med_pdf_kitab_tawheed",
    kind: "document",
    url: "https://ia800305.us.archive.org/24/items/KitabAtTawheedAmharic/KitabAtTawheed.pdf",
    mime_type: "application/pdf",
    width: null,
    height: null,
    duration_seconds: null,
  },
];

export function getInitialSeedDatabase(): PortalDatabase {
  return {
    version: 1,
    updated_at: new Date().toISOString(),
    profile: {
      object: "profile",
      id: "sheikh-ferej",
      name: "Sheikh Muhammed Ferej Megeno",
      headline: "Islamic Scholar, Educator & Sharia Consultant",
      biography:
        "Sheikh Muhammed Ferej Megeno (الشيخ محمد فرج مجنو) is a prominent Ethiopian Islamic scholar, educator, and certified AAOIFI Sharia consultant. With over 35 years devoted to traditional Islamic knowledge circles (Halaqat), curriculum design, and public education across Ethiopia and the Horn of Africa, he serves as President of the Al-Fajr Islamic Foundation, Member of the African Scholars Union, and resident Sharia Consultant at Wegagen Bank.",
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
        tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
        youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
        facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
        telegram: "https://t.me/ustazmuhammadferej",
      },
      location: "Addis Ababa, Ethiopia",
      updated_at: new Date().toISOString(),
    },
    journey: journeyData.map((j) => ({
      year: j.year,
      title: j.title,
      institution: j.institution,
      description: j.description,
      type: j.type === "qualification" ? "education" : (j.type as any),
    })),
    qualifications: qualifications.map((q) => ({
      id: q.id,
      title: q.title,
      issuer: q.issuer,
      year: q.year,
      type: (q.type as any) || "other",
      description: q.description,
    })),
    lectures: AUTHENTIC_LECTURES,
    series: AUTHENTIC_SERIES,
    articles: AUTHENTIC_ARTICLES,
    fatwas: AUTHENTIC_FATWAS,
    courses: AUTHENTIC_COURSES,
    books: AUTHENTIC_BOOKS,
    events: AUTHENTIC_EVENTS,
    media: SEED_MEDIA_ITEMS,
    inquiries: [
      {
        id: "inq_initial_sample_1",
        question:
          "አሰላሙ አለይኩም ኡስታዝ፤ በዘመናዊ የሞባይል ባንኪንግና ዲጂታል ክፍያዎች ላይ የሚቆረጡ የአገልግሎት ክፍያዎች በሸሪዓ እንዴት ይታያሉ?",
        name: "አብዱረህማን ከማል",
        email: "abdurahman@example.com",
        is_anonymous: false,
        locale: "am",
        created_at: "2026-10-24T12:00:00Z",
        status: "answered",
        notes: "Answered and published under Fatwas: Sharia Rulings on Digital Banking Fees.",
      },
      {
        id: "inq_initial_sample_2",
        question:
          "Regarding travel prayers (Salah al-Safar): if I am staying in a city for 5 days for work, when do I discontinue shortening and combining prayers according to classical consensus?",
        name: "Bilal Ahmed",
        email: "bilal.ahmed@example.com",
        is_anonymous: false,
        locale: "en",
        created_at: "2026-10-25T14:30:00Z",
        status: "pending",
        notes: "Pending review by Sheikh's office.",
      },
    ],
  };
}
