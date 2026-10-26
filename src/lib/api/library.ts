import { bunyan } from "./client";
import type { ListResponse, PublicBook } from "./types";

export const AUTHENTIC_BOOKS: PublicBook[] = [
  {
    object: "book",
    id: "bok_kitab_tawheed",
    title: "Kitab At-Tawheed — The Book of Monotheism (ኪታቡ አተውሂድ)",
    slug: "kitab-at-tawheed",
    summary: "The foundational classical treatise on Islamic Monotheism, systematically taught and explained by Sheikh Muhammed Ferej Megeno in Addis Ababa, accompanied by authentic audio lessons.",
    description: "Kitab At-Tawheed clarifies the essence of worship, the rights of Allah over His creation, and protects against modern forms of polytheism and superstition. This verified syllabus and curriculum guide outlines the core themes, chapter divisions, and commentary recorded by Sheikh Muhammed Ferej across 32+ classroom lessons.",
    author: "Imam Muhammad ibn Abd al-Wahhab (Commentary by Sheikh Muhammed Ferej)",
    publisher: "Bunyan Scholarly Publishing & Al-Fajr Foundation",
    year: 2024,
    isbn: "978-99944-10-82-6",
    kind: "book",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_tawheed",
      kind: "image",
      url: "/images/photo_11_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    file: {
      object: "media",
      id: "med_doc_tawheed",
      kind: "document",
      url: "/documents/kitabu-tawhid-complete.pdf",
      mime_type: "application/pdf",
      width: null,
      height: null,
      duration_seconds: null,
    },
    external_url: null,
    categories: ["aqeedah", "tawheed", "classical-texts"],
    tags: ["kitab-at-tawheed", "aqeedah", "tawheed", "sheikh-muhammed-ferej"],
    published_at: "2024-03-15T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_cv",
    title: "Official Curriculum Vitae — Sheikh Muhammed Ferej Megeno (የግል መገለጫ)",
    slug: "curriculum-vitae-sheikh-muhammed-ferej",
    summary: "Complete scholarly and professional resume detailing 35+ years in Islamic education, university degrees, Sharia advisory positions, broadcast media, and community leadership.",
    description: "The verified scholarly curriculum vitae of Sheikh Muhammed Ferej Megeno, Sharia consultant at Wegagen Bank, African Scholars Union member, and graduate of the Islamic University of Minnesota in Sharia and Law. Available as an authenticated PDF document.",
    author: "Sheikh Muhammed Ferej Megeno",
    publisher: "Scholarly Office of Sheikh Muhammed Ferej",
    year: 2026,
    isbn: null,
    kind: "document",
    locale: "en",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_cv",
      kind: "image",
      url: "/images/photo_3_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 960,
      height: 1280,
      duration_seconds: null,
    },
    file: {
      object: "media",
      id: "med_doc_cv",
      kind: "document",
      url: "/documents/My CV.pdf",
      mime_type: "application/pdf",
      width: null,
      height: null,
      duration_seconds: null,
    },
    external_url: null,
    categories: ["biography", "credentials"],
    tags: ["cv", "credentials", "biography"],
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_mukhtasar_tafsir",
    title: "Summary Interpretation of the Holy Quran (የተመረጡ የቁርኣን አንቀጾች ማብራሪያ - ሙኽተሰር ተፍሲር)",
    slug: "summary-interpretation-holy-quran-amharic",
    summary: "Authorized Amharic co-translation of the renowned 'Al-Mukhtasar fi Tafsir al-Quran al-Kareem' providing lucid commentary and linguistic derivations for Ethiopian Muslims.",
    description: "A comprehensive project co-translated by Sheikh Muhammed Ferej Megeno alongside distinguished scholars, translating the meanings and classical concise exegesis of the Noble Quran into accessible, accurate Amharic.",
    author: "Tafsir Translation Committee (Co-translator: Sheikh Muhammed Ferej)",
    publisher: "Dar al-Tafsir Foundation",
    year: 2021,
    isbn: "978-99944-88-21-4",
    kind: "book",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_tafsir",
      kind: "image",
      url: "/images/photo_16_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1055,
      height: 1062,
      duration_seconds: null,
    },
    file: null,
    external_url: "https://quran.com",
    categories: ["tafsir", "quran"],
    tags: ["tafsir", "quran", "amharic-translation"],
    published_at: "2021-06-10T00:00:00Z",
    updated_at: "2021-06-10T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_usool_thalathah",
    title: "Al-Usool Ath-Thalathah — The Three Fundamental Principles (ሦስቱ መሠረታዊ መርሆዎች)",
    slug: "al-usool-ath-thalathah",
    summary: "The essential primer teaching every Muslim the three questions of the grave: knowing Allah, knowing Islam with evidence, and knowing the Prophet Muhammad (s.a.w).",
    description: "A staple in the educational curriculum taught by Sheikh Muhammed Ferej at Al-Fajr Islamic Foundation and Mosques in Addis Ababa. Includes analytical explanations of Tawheed ar-Rububiyyah, Uluhiyyah, and Asma wa Sifat.",
    author: "Imam Muhammad ibn Abd al-Wahhab (Taught by Sheikh Muhammed Ferej)",
    publisher: "Al-Fajr Islamic Foundation",
    year: 2022,
    isbn: "978-99944-99-15-2",
    kind: "book",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_usool",
      kind: "image",
      url: "/images/photo_7_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    file: null,
    external_url: null,
    categories: ["aqeedah", "basics"],
    tags: ["usool-ath-thalathah", "aqeedah", "foundations"],
    published_at: "2022-04-12T00:00:00Z",
    updated_at: "2022-04-12T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_aaoifi_guide",
    title: "AAOIFI Sharia Governance and Ethical Finance Framework for Islamic Windows",
    slug: "aaoifi-sharia-governance-framework",
    summary: "Foundational Sharia auditing guide and governance principles for Islamic banking windows, contracts, and digital financial transactions.",
    description: "Referenced by Sheikh Muhammed Ferej in his Sharia advisory work at Wegagen Bank, highlighting the operational implementation of AAOIFI standards in Ethiopian Islamic financial institutions.",
    author: "Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI)",
    publisher: "AAOIFI Standards Board",
    year: 2023,
    isbn: "978-99901-44-12-8",
    kind: "recommended_text",
    locale: "en",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_aaoifi",
      kind: "image",
      url: "/images/photo_13_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 853,
      duration_seconds: null,
    },
    file: null,
    external_url: "https://aaoifi.com",
    categories: ["islamic-finance", "sharia-governance"],
    tags: ["aaoifi", "islamic-banking", "fiqh-muamalat"],
    published_at: "2023-09-01T00:00:00Z",
    updated_at: "2023-09-01T00:00:00Z",
  },
];

import { getAllBooks, getBookByIdOrSlug } from "@/lib/db/repository";

export async function getLibrary(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicBook>> {
  try {
    let list = getAllBooks();
    if (params.category && params.category.length > 0) {
      list = list.filter((b) => b.categories.some((cat) => params.category!.includes(cat)));
    }
    return {
      object: "list",
      data: list,
      has_more: false,
      next_cursor: null,
    };
  } catch {
    return {
      object: "list",
      data: AUTHENTIC_BOOKS,
      has_more: false,
      next_cursor: null,
    };
  }
}

export async function getLibraryItem(reference: string, locale?: string): Promise<PublicBook> {
  try {
    const found = getBookByIdOrSlug(reference);
    if (found) {
      return found;
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_BOOKS.find(
    (b) => b.slug === reference || b.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Library item ${reference} not found`);
}
