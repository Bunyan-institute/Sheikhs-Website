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
        course_id: "crs_kitab_tawheed",
        course_slug: "comprehensive-kitab-at-tawheed",
        course_title: "የኪታቡ አተውሂድ የተሟላ ትምህርት (Comprehensive Study of Kitab At-Tawheed)",
        student_name: "Ahmad Ibn Yusuf al-Habashi",
        student_email: "ahmad.yusuf@example.com",
        student_phone: "+251 91 445 5667",
        city: "Addis Ababa",
        created_at: "2026-10-15T10:00:00Z",
        completed_lessons: [
          "les_tawheed_23",
          "les_tawheed_24",
          "les_tawheed_25",
          "les_tawheed_26",
          "les_tawheed_27",
          "les_tawheed_28",
          "les_tawheed_29",
          "les_tawheed_30",
          "les_tawheed_31",
          "les_tawheed_32",
        ],
        exam_attempts: [
          {
            attempt_date: "2026-10-20T14:00:00Z",
            score: 100,
            passed: true,
          },
        ],
        certificate_id: "MFM-2026-TWH-1001",
        status: "completed",
      },
    ],
    course_exams: {
      "comprehensive-kitab-at-tawheed": {
        course_id: "comprehensive-kitab-at-tawheed",
        passing_percentage: 70,
        questions: [
          {
            id: "q1",
            question: "What is the primary division of Tawheed that was the core dispute between the Messengers and their peoples?",
            options: [
              "Tawheed al-Uluhiyyah (Singling out Allah exclusively in worship and devotion)",
              "Tawheed ar-Rububiyyah (Recognizing Allah as sole Creator and Provider)",
              "Tawheed al-Asma wa as-Sifat (Affirming Divine Names and Attributes)",
              "Philosophical scholastic theology (Ilm al-Kalam)"
            ],
            correct_option_index: 0,
            explanation: "All pagan nations admitted Allah was the Creator (Rububiyyah), but refused to direct all worship exclusively to Him (Uluhiyyah)."
          },
          {
            id: "q2",
            question: "According to the principles elucidated in Kitab At-Tawheed, what constitutes Major Shirk (Ash-Shirk al-Akbar)?",
            options: [
              "Directing any act of worship (supplication, sacrifice, vows, fear, reliance) to other than Allah",
              "Showing off in voluntary righteous deeds (Ar-Riyaa)",
              "Swearing unintentionally by the Ka'bah",
              "Committing a major sin while acknowledging its prohibition"
            ],
            correct_option_index: 0,
            explanation: "Major Shirk invalidates all good deeds and expels one from the fold of Islam if died upon without repentance."
          },
          {
            id: "q3",
            question: "What does the testimony 'La ilaha illallah' necessitate structurally?",
            options: [
              "Absolute negation of divinity from all creation (An-Nafy) and exclusive affirmation for Allah alone (Al-Ithbat)",
              "Affirming Allah as Creator while permitting seeking spiritual intercession through graves",
              "Merely verbal utterance without requirement of understanding or action",
              "Negating all attributes of Allah to avoid anthropomorphism"
            ],
            correct_option_index: 0,
            explanation: "'La ilaha' negates all false gods; 'illallah' affirms true worship solely to Allah."
          },
          {
            id: "q4",
            question: "What is the ruling on wearing amulets, charms, or strings (Tama'im) believing they ward off harm independently?",
            options: [
              "Prohibited and considered a manifestation of Shirk that compromises pure Tawakkul",
              "Permissible and recommended for travelers and infants",
              "A mandatory traditional custom",
              "Permitted provided it is concealed underneath garments"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (peace be upon him) said: 'Whoever wears an amulet has committed an act of Shirk' (Ahmad)."
          },
          {
            id: "q5",
            question: "How did the Prophet (peace and blessings be upon him) classify subtle ostentation (Ar-Riyaa)?",
            options: [
              "Lesser Shirk (Ash-Shirk al-Asghar), more concealed than the crawling of an ant",
              "A minor cultural custom with no theological consequence",
              "A praiseworthy practice to motivate others",
              "An act that completely invalidates all previous good deeds forever"
            ],
            correct_option_index: 0,
            explanation: "The Prophet expressed greatest fear for his Ummah regarding Lesser Shirk: Ar-Riyaa (showing off)."
          },
          {
            id: "q6",
            question: "What is the status of slaughtering (Adh-Dhabh) for spirits, jinn, or tombs?",
            options: [
              "Major Shirk that places the perpetrator under the curse of Allah",
              "Disliked (Makruh) but permissible as cultural respect",
              "Permitted during regional reconciliation ceremonies",
              "A minor sin that does not affect Tawheed"
            ],
            correct_option_index: 0,
            explanation: "The Prophet (pbuh) said: 'May Allah curse whoever slaughters for other than Allah' (Sahih Muslim)."
          },
          {
            id: "q7",
            question: "What constitutes sincere reliance on Allah (Tawakkul) in Islamic creed?",
            options: [
              "Placing full heart trust in Allah while taking lawful worldly means",
              "Abandoning all worldly means, work, and medical treatments completely",
              "Relying solely on material means without remembering Allah",
              "Wishing for success without practical effort or devotion"
            ],
            correct_option_index: 0,
            explanation: "True Tawakkul combines spiritual trust in the Divine Decree with adopting appropriate means."
          },
          {
            id: "q8",
            question: "What are the two inseparable conditions for any deed to be accepted by Allah?",
            options: [
              "Sincerity for Allah alone (Ikhlas) and conformity to the Sunnah (Mutaba'ah)",
              "Popular consensus and large financial expenditure",
              "Severe physical exertion and difficulty",
              "Strict adherence to ancestral traditional norms"
            ],
            correct_option_index: 0,
            explanation: "Allah accepts only deeds performed purely for His Face and in strict accordance with the prophetic guidance."
          }
        ]
      }
    },
    certificates: [
      {
        id: "MFM-2026-TWH-1001",
        verification_token: "d8f3a1b9e2c40586719a84f3e2b1098475a6c3d2e1f0b9a876543210fedcba98",
        course_id: "comprehensive-kitab-at-tawheed",
        course_slug: "comprehensive-kitab-at-tawheed",
        course_title: "የኪታቡ አተውሂድ የተሟላ ትምህርት (Comprehensive Study of Kitab At-Tawheed)",
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
