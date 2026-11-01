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
    event_registrations: [
      {
        id: "evtr_sample_101",
        event_id: "evt_jumah_alfajr",
        event_slug: "friday-khutbah-importance-of-sincerity",
        event_title: "የጁምዓ ኹጥባህ — የተውሂድና የተረጋጋ ልብ ፋይዳ (Friday Khutbah)",
        name: "Dawud Mohammed",
        email: "dawud.m@example.com",
        phone: "+251 91 122 3344",
        city: "Addis Ababa",
        attendees_count: 2,
        created_at: "2026-10-24T15:00:00Z",
        status: "confirmed",
        notes: "Family attendance",
      },
      {
        id: "evtr_sample_102",
        event_id: "evt_jumah_alfajr",
        event_slug: "friday-khutbah-importance-of-sincerity",
        event_title: "የጁምዓ ኹጥባህ — የተውሂድና የተረጋጋ ልብ ፋይዳ (Friday Khutbah)",
        name: "Khadija Omar",
        email: "khadija.o@example.com",
        phone: "+251 92 345 6789",
        city: "Addis Ababa",
        attendees_count: 1,
        created_at: "2026-10-25T09:30:00Z",
        status: "confirmed",
      },
    ],
    course_enrollments: [
      {
        id: "enr_sample_201",
        course_id: "crs_riyadus_saliheen",
        course_slug: "comprehensive-riyadus-saliheen",
        course_title: "የሪያዱ ሷሊሂን የተሟላ ትምህርት (Comprehensive Study of Riyad us-Saliheen)",
        student_name: "Ahmad Ibn Yusuf al-Habashi",
        student_email: "ahmad.yusuf@example.com",
        student_phone: "+251 91 445 5667",
        city: "Addis Ababa",
        created_at: "2026-10-15T10:00:00Z",
        completed_lessons: [
          "les_riyad_23",
          "les_riyad_24",
          "les_riyad_25",
          "les_riyad_26",
          "les_riyad_27",
          "les_riyad_28",
          "les_riyad_29",
          "les_riyad_30",
          "les_riyad_31",
          "les_riyad_32",
        ],
        exam_attempts: [
          {
            attempt_date: "2026-10-20T14:00:00Z",
            score: 100,
            passed: true,
          },
        ],
        certificate_id: "MFM-2026-RDS-1001",
        status: "completed",
      },
    ],
    course_exams: {
      "comprehensive-riyadus-saliheen": {
        course_id: "comprehensive-riyadus-saliheen",
        passing_percentage: 70,
        questions: [
          {
            id: "q1",
            question: "According to the famous Hadith of Umar ibn al-Khattab (رضي الله عنه) opening Riyad us-Saliheen, how are actions evaluated by Allah?",
            options: [
              "Actions are judged exclusively by their intentions (Innama al-A'malu bin-Niyyat)",
              "Actions are judged purely by their physical appearance and social outcome",
              "Actions are judged by ancestral tradition and tribal consensus",
              "Actions are judged by financial cost and magnitude alone"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (ﷺ) declared that all actions are judged by intention, and each person receives what they intended."
          },
          {
            id: "q2",
            question: "In the Chapter on Repentance (Bab at-Tawbah), what are the fundamental conditions when a sin involves the rights of another human being?",
            options: [
              "Ceasing the sin, sincere remorse, firm determination not to return, and restoring or seeking pardon for the usurped right",
              "Merely fasting three consecutive days without reimbursing stolen wealth",
              "Asking public forgiveness on social media while retaining another person's property",
              "Supplication alone without restitution"
            ],
            correct_option_index: 0,
            explanation: "When sins violate human rights (money, honor, injury), repentance requires returning the right or obtaining genuine absolution."
          },
          {
            id: "q3",
            question: "How did Sheikh Muhammed Ferej elucidate the three dimensions of Patience (As-Sabr) in his Riyad us-Saliheen discourses?",
            options: [
              "Patience upon obeying Allah, patience from disobeying Allah, and patience upon painful decrees of Allah",
              "Patience with wealth, patience with food, and patience with sleep",
              "Patience only when one has no strength to retaliate",
              "Patience confined exclusively to physical illness"
            ],
            correct_option_index: 0,
            explanation: "Classical Ahlus-Sunnah scholars classify Sabr into: Sabr upon obedience, Sabr from sins, and Sabr upon tribulations."
          },
          {
            id: "q4",
            question: "What prophetic consequence is affirmed in Riyad us-Saliheen regarding Truthfulness (As-Sidq)?",
            options: [
              "Truthfulness leads to righteousness (Birr), and righteousness leads to Paradise",
              "Truthfulness causes loss of worldly status and reputation",
              "Truthfulness is recommended only in legal disputes",
              "Truthfulness is superseded by expediency"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (ﷺ) stated: 'Truthfulness leads to righteousness, and righteousness leads to Paradise' (Bukhari & Muslim)."
          },
          {
            id: "q5",
            question: "What is the comprehensive meaning of the Hadith 'The Religion is Sincere Advice' (Ad-Deenu An-Naseehah)?",
            options: [
              "Sincerity towards Allah, His Book, His Messenger, the leaders of the Muslims, and their common folk",
              "Only offering criticism to political figures in public gatherings",
              "Private advice limited exclusively to family members",
              "A formal judicial procedure restricted to courts"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (ﷺ) explained that Naseehah encompasses devotion to Allah, His Book, His Messenger, leaders, and all Muslims."
          },
          {
            id: "q6",
            question: "According to the Hadith on God-consciousness (Taqwa), where is Taqwa primarily seated as demonstrated by the Prophet (ﷺ)?",
            options: [
              "In the heart, as the Prophet pointed three times to his chest: 'At-Taqwa hahuna'",
              "Exclusively in outward garment style and length",
              "Solely in eloquent public speaking and oratory",
              "In physical residence in specific geographic locations"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (peace and blessings be upon him) pointed to his heart and said: 'God-fearing piety is here' three times."
          },
          {
            id: "q7",
            question: "How does authentic Islamic doctrine reconcile Sincere Reliance upon Allah (Tawakkul) with adopting material means (Al-Asbab)?",
            options: [
              "Tawakkul relies completely with the heart on Allah while dutifully exerting lawful worldly means (like tying the camel)",
              "Tawakkul requires total abandonment of medicine, employment, and planning",
              "Believing material means produce results independent of Allah's Will",
              "Only adopting means without prayer or reliance on Allah"
            ],
            correct_option_index: 0,
            explanation: "True Tawakkul unites spiritual reliance on Allah with adopting appropriate lawful means, as in the Hadith: 'Tie her and rely upon Allah.'"
          },
          {
            id: "q8",
            question: "What does the prophetic guidance in Riyad us-Saliheen teach regarding maintaining ties of kinship (Silat ar-Rahim)?",
            options: [
              "It expands sustenance, elongates righteous lifespan, and is maintained even towards relatives who sever relations",
              "It is only required towards relatives who reciprocate visits and gifts",
              "It is prohibited if relatives live in different towns",
              "It is limited strictly to siblings only"
            ],
            correct_option_index: 0,
            explanation: "The true maintainer of kinship is one who reconciles and upholds ties even when relatives sever them (Sahih Bukhari)."
          }
        ]
      }
    },
    certificates: [
      {
        id: "MFM-2026-RDS-1001",
        verification_token: "d8f3a1b9e2c40586719a84f3e2b1098475a6c3d2e1f0b9a876543210fedcba98",
        course_id: "comprehensive-riyadus-saliheen",
        course_slug: "comprehensive-riyadus-saliheen",
        course_title: "የሪያዱ ሷሊሂን የተሟላ ትምህርት (Comprehensive Study of Riyad us-Saliheen)",
        student_name: "Ahmad Ibn Yusuf al-Habashi",
        student_email: "ahmad.yusuf@example.com",
        issued_at: "2026-10-20T14:05:00Z",
        hijri_date: "11 Rabi' al-Thani 1448 AH",
        score_percentage: 100,
        grade_title: "Mumtaz with Highest Honors (ممتاز مع مرتبة الشرف)",
        instructor_name: "Sheikh Muhammed Ferej Megeno",
        authority_seal: "Al-Fajr Islamic Foundation & AAOIFI Sharia Council Accreditation",
        revoked: false,
        revoked_reason: null,
      },
    ],
  };
}
