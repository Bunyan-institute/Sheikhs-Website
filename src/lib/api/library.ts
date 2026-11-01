import type { ListResponse, PublicBook } from "./types";
import { getAllBooks, getBookByIdOrSlug } from "@/lib/db/repository";

export const AUTHENTIC_BOOKS: PublicBook[] = [
  {
    object: "book",
    id: "bok_cv",
    title: "Official Curriculum Vitae & Scholarly Profile — Sheikh Muhammed Ferej Megeno (የግል መገለጫ)",
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
    tags: ["cv", "credentials", "biography", "sheikh-muhammed-ferej"],
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_mukhtasar_tafsir",
    title: "Summary Interpretation of the Holy Quran — Mukhtasar Tafsir (የተመረጡ የቁርኣን አንቀጾች ማብራሪያ - ሙኽተሰር ተፍሲር)",
    slug: "summary-interpretation-holy-quran-amharic",
    summary: "Authorized Amharic co-translation of the renowned Al-Mukhtasar fi Tafsir al-Quran al-Kareem providing lucid commentary and linguistic derivations for Ethiopian Muslims.",
    description: "A comprehensive project co-translated by Sheikh Muhammed Ferej Megeno alongside distinguished scholars, translating the meanings and classical concise exegesis of the Noble Quran into accessible, accurate Amharic.",
    author: "Co-translated by Sheikh Muhammed Ferej Megeno",
    publisher: "Dar al-Tafsir & Al-Fajr Foundation",
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
    tags: ["tafsir", "quran", "amharic-translation", "sheikh-muhammed-ferej"],
    published_at: "2021-06-10T00:00:00Z",
    updated_at: "2021-06-10T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_ferej_riyadus_saliheen",
    title: "Riyadus Saliheen Television Exegesis — Sheikh Muhammed Ferej (የሪያዱ ሷሊሂን የአፍሪካ ቲቪ ማብራሪያ)",
    slug: "riyadus-saliheen-sheikh-muhammed-ferej",
    summary: "Scholarly commentary and practical moral rulings from Imam an-Nawawis classical Hadith compendium, delivered by Sheikh Muhammed Ferej on Africa TV.",
    description: "Comprehensive lessons on Hadith sciences, purification of the soul (Tazkiyah), and Islamic manners, broadcast extensively on Africa TV by Sheikh Muhammed Ferej Megeno.",
    author: "Sheikh Muhammed Ferej Megeno",
    publisher: "Africa TV & Al-Fajr Islamic Foundation",
    year: 2023,
    isbn: "978-99944-77-10-3",
    kind: "book",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_riyad",
      kind: "image",
      url: "/images/photo_11_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    file: null,
    external_url: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    categories: ["hadith", "africa-tv"],
    tags: ["riyadus-saliheen", "hadith", "africa-tv", "sheikh-muhammed-ferej"],
    published_at: "2023-05-15T00:00:00Z",
    updated_at: "2023-05-15T00:00:00Z",
  },
  {
    object: "book",
    id: "bok_ferej_fatawa",
    title: "Compendium of Contemporary Legal Inquiries & Fatwas — Sheikh Muhammed Ferej (የፈታዋ ስብስብ በሸይኽ ሙሐመድ ፈረጅ)",
    slug: "compendium-fatwas-sheikh-muhammed-ferej",
    summary: "A collected compendium of answers to contemporary inquiries on Islamic banking, family contracts, and ritual obligations.",
    description: "Authored and reviewed by Sheikh Muhammed Ferej Megeno, Sharia Consultant at Wegagen Bank and African Scholars Union member.",
    author: "Sheikh Muhammed Ferej Megeno",
    publisher: "Al-Fajr Islamic Foundation",
    year: 2024,
    isbn: "978-99944-55-40-1",
    kind: "book",
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_cov_fatawa",
      kind: "image",
      url: "/images/photo_12_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    file: null,
    external_url: null,
    categories: ["fatwa", "jurisprudence"],
    tags: ["fatwa", "fiqh", "sheikh-muhammed-ferej"],
    published_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
];

export async function getLibrary(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicBook>> {
  try {
    let list = getAllBooks();
    if (params.category && params.category.length > 0) {
      list = list.filter((b) => b.categories.some((cat) => params.category!.includes(cat)));
    }
    if (!list || list.length === 0) list = AUTHENTIC_BOOKS;
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
