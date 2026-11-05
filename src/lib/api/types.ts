// ── Media ──
export type ContentStatus = "draft" | "published";

export interface MediaRef {
  object: "media";
  id: string;
  kind: "image" | "audio" | "video" | "document";
  url: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  /** Gallery metadata (admin-managed); absent on plain cover/file references. */
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
}

// ── List response envelope ──
export interface ListResponse<T> {
  object: "list";
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

// ── Section governance ──
export interface SectionMap {
  lectures: boolean;
  articles: boolean;
  fatwas: boolean;
  courses: boolean;
  library: boolean;
  events: boolean;
  questions: boolean;
}

// ── Profile ──
export interface PublicProfile {
  object: "profile";
  id: string;
  name: string;
  headline: string | null;
  biography: string | null;
  languages: string[];
  locale: string;
  direction: "ltr" | "rtl";
  photo: MediaRef | null;
  location?: string | null;
  sections: SectionMap;
  socials: Record<string, string>;
  updated_at: string;
}

// ── Lecture ──
export interface PublicLecture {
  object: "lecture";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  locale: string;
  direction: "ltr" | "rtl";
  duration_seconds: number | null;
  published_at: string | null;
  updated_at: string;
  cover: MediaRef | null;
  media: {
    audio: string | null;
    video: string | null;
    transcript: string | null;
  };
  series: {
    id: string;
    title: string;
    position: number | null;
  } | null;
  categories: string[];
  tags: string[];
}

// ── Series ──
export interface PublicSeries {
  object: "series";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  description: string | null;
  locale: string;
  direction: "ltr" | "rtl";
  cover: MediaRef | null;
  lecture_count: number;
  published_at: string | null;
  updated_at: string;
  lectures?: PublicLecture[];
}

// ── Article ──
export interface PublicArticle {
  object: "article";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body?: string | null;
  reading_minutes: number | null;
  locale: string;
  direction: "ltr" | "rtl";
  cover: MediaRef | null;
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

// ── Fatwa ──
export interface PublicFatwa {
  object: "fatwa";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  question: string | null;
  answer?: string | null;
  locale: string;
  direction: "ltr" | "rtl";
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

// ── Course ──
export interface PublicLesson {
  object: "lesson";
  id: string;
  title: string;
  summary: string | null;
  duration_seconds: number | null;
  position: number;
}

export interface PublicCourse {
  object: "course";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  enrolment_open: boolean;
  lesson_count: number;
  lessons?: PublicLesson[];
  locale: string;
  direction: "ltr" | "rtl";
  cover: MediaRef | null;
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

// ── Library (Book) ──
export interface PublicBook {
  object: "book";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description?: string | null;
  author: string | null;
  publisher: string | null;
  year: number | null;
  isbn: string | null;
  kind: "book" | "document" | "recommended_text";
  locale: string;
  direction: "ltr" | "rtl";
  cover: MediaRef | null;
  file: MediaRef | null;
  external_url: string | null;
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

// ── Event ──
export interface PublicEvent {
  object: "event";
  status?: ContentStatus;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description?: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  registration_required: boolean;
  capacity: number | null;
  locale: string;
  direction: "ltr" | "rtl";
  cover: MediaRef | null;
  categories: string[];
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

// ── Taxonomy ──
export interface PublicCategory {
  object: "category";
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface PublicTag {
  object: "tag";
  id: string;
  name: string;
  slug: string;
}

// ── Search ──
export interface SearchResult {
  object: string;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  locale: string;
  score: number;
  published_at: string | null;
}

// ── Question submission ──
export interface QuestionReceipt {
  object: "question";
  id: string;
  received: true;
}
