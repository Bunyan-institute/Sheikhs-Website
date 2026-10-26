import { loadDatabase, saveDatabase, resetDatabase, exportDatabaseJson, importDatabaseJson } from "./store";
import type {
  PortalDatabase,
  InquiryRecord,
  JourneyMilestone,
  QualificationRecord,
} from "./types";
import type {
  PublicLecture,
  PublicSeries,
  PublicArticle,
  PublicFatwa,
  PublicCourse,
  PublicBook,
  PublicEvent,
  PublicProfile,
  MediaRef,
} from "@/lib/api/types";

function triggerRevalidations() {
  try {
    // Safely revalidate if inside server request environment
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { revalidatePath } = require("next/cache");
    if (typeof revalidatePath === "function") {
      revalidatePath("/", "layout");
    }
  } catch {
    // Ignore in non-request contexts
  }
}

// ── Lectures ──

export function getAllLectures(): PublicLecture[] {
  const db = loadDatabase();
  return [...db.lectures].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
}

export function getLectureByIdOrSlug(identifier: string): PublicLecture | null {
  const db = loadDatabase();
  return db.lectures.find((l) => l.id === identifier || l.slug === identifier) || null;
}

export function saveLecture(lectureData: Partial<PublicLecture> & { title: string; slug: string }): PublicLecture {
  const db = loadDatabase();
  const id = lectureData.id || `lec_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.lectures.findIndex((l) => l.id === id || l.slug === lectureData.slug);

  const completeLecture: PublicLecture = {
    object: "lecture",
    id,
    title: lectureData.title,
    slug: lectureData.slug,
    summary: lectureData.summary ?? null,
    locale: lectureData.locale ?? "am",
    direction: lectureData.direction ?? "ltr",
    duration_seconds: lectureData.duration_seconds ?? null,
    published_at: lectureData.published_at ?? now,
    updated_at: now,
    cover: lectureData.cover ?? null,
    media: {
      audio: lectureData.media?.audio ?? null,
      video: lectureData.media?.video ?? null,
      transcript: lectureData.media?.transcript ?? null,
    },
    series: lectureData.series ?? null,
    categories: lectureData.categories ?? ["Lectures"],
    tags: lectureData.tags ?? [],
  };

  if (existingIndex >= 0) {
    db.lectures[existingIndex] = completeLecture;
  } else {
    db.lectures.unshift(completeLecture);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeLecture;
}

export function deleteLecture(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.lectures.length;
  db.lectures = db.lectures.filter((l) => l.id !== id);
  if (db.lectures.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Series ──

export function getAllSeries(): PublicSeries[] {
  const db = loadDatabase();
  return db.series;
}

export function getSeriesByIdOrSlug(identifier: string): PublicSeries | null {
  const db = loadDatabase();
  return db.series.find((s) => s.id === identifier || s.slug === identifier) || null;
}

export function saveSeries(seriesData: Partial<PublicSeries> & { title: string; slug: string }): PublicSeries {
  const db = loadDatabase();
  const id = seriesData.id || `ser_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.series.findIndex((s) => s.id === id || s.slug === seriesData.slug);

  const completeSeries: PublicSeries = {
    object: "series",
    id,
    title: seriesData.title,
    slug: seriesData.slug,
    description: seriesData.description ?? null,
    locale: seriesData.locale ?? "am",
    direction: seriesData.direction ?? "ltr",
    cover: seriesData.cover ?? null,
    lecture_count: seriesData.lecture_count ?? 0,
    published_at: seriesData.published_at ?? now,
    updated_at: now,
    lectures: seriesData.lectures ?? [],
  };

  if (existingIndex >= 0) {
    db.series[existingIndex] = completeSeries;
  } else {
    db.series.unshift(completeSeries);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeSeries;
}

export function deleteSeries(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.series.length;
  db.series = db.series.filter((s) => s.id !== id);
  if (db.series.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Articles ──

export function getAllArticles(): PublicArticle[] {
  const db = loadDatabase();
  return [...db.articles].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
}

export function getArticleByIdOrSlug(identifier: string): PublicArticle | null {
  const db = loadDatabase();
  return db.articles.find((a) => a.id === identifier || a.slug === identifier) || null;
}

export function saveArticle(articleData: Partial<PublicArticle> & { title: string; slug: string }): PublicArticle {
  const db = loadDatabase();
  const id = articleData.id || `art_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.articles.findIndex((a) => a.id === id || a.slug === articleData.slug);

  const completeArticle: PublicArticle = {
    object: "article",
    id,
    title: articleData.title,
    slug: articleData.slug,
    summary: articleData.summary ?? null,
    body: articleData.body ?? "",
    reading_minutes: articleData.reading_minutes ?? 5,
    locale: articleData.locale ?? "am",
    direction: articleData.direction ?? "ltr",
    cover: articleData.cover ?? null,
    categories: articleData.categories ?? ["hadith"],
    tags: articleData.tags ?? [],
    published_at: articleData.published_at ?? now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    db.articles[existingIndex] = completeArticle;
  } else {
    db.articles.unshift(completeArticle);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeArticle;
}

export function deleteArticle(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id);
  if (db.articles.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Fatwas ──

export function getAllFatwas(): PublicFatwa[] {
  const db = loadDatabase();
  return [...db.fatwas].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
}

export function getFatwaByIdOrSlug(identifier: string): PublicFatwa | null {
  const db = loadDatabase();
  return db.fatwas.find((f) => f.id === identifier || f.slug === identifier) || null;
}

export function saveFatwa(fatwaData: Partial<PublicFatwa> & { title: string; slug: string }): PublicFatwa {
  const db = loadDatabase();
  const id = fatwaData.id || `fat_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.fatwas.findIndex((f) => f.id === id || f.slug === fatwaData.slug);

  const completeFatwa: PublicFatwa = {
    object: "fatwa",
    id,
    title: fatwaData.title,
    slug: fatwaData.slug,
    summary: fatwaData.summary ?? null,
    question: fatwaData.question ?? null,
    answer: fatwaData.answer ?? null,
    locale: fatwaData.locale ?? "am",
    direction: fatwaData.direction ?? "ltr",
    categories: fatwaData.categories ?? ["fiqh"],
    tags: fatwaData.tags ?? [],
    published_at: fatwaData.published_at ?? now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    db.fatwas[existingIndex] = completeFatwa;
  } else {
    db.fatwas.unshift(completeFatwa);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeFatwa;
}

export function deleteFatwa(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.fatwas.length;
  db.fatwas = db.fatwas.filter((f) => f.id !== id);
  if (db.fatwas.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Courses ──

export function getAllCourses(): PublicCourse[] {
  const db = loadDatabase();
  return db.courses;
}

export function getCourseByIdOrSlug(identifier: string): PublicCourse | null {
  const db = loadDatabase();
  return db.courses.find((c) => c.id === identifier || c.slug === identifier) || null;
}

export function saveCourse(courseData: Partial<PublicCourse> & { title: string; slug: string }): PublicCourse {
  const db = loadDatabase();
  const id = courseData.id || `cou_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.courses.findIndex((c) => c.id === id || c.slug === courseData.slug);

  const completeCourse: PublicCourse = {
    object: "course",
    id,
    title: courseData.title,
    slug: courseData.slug,
    summary: courseData.summary ?? null,
    description: courseData.description ?? null,
    enrolment_open: courseData.enrolment_open ?? true,
    lesson_count: courseData.lesson_count ?? (courseData.lessons?.length || 0),
    lessons: courseData.lessons ?? [],
    locale: courseData.locale ?? "am",
    direction: courseData.direction ?? "ltr",
    cover: courseData.cover ?? null,
    categories: courseData.categories ?? ["aqeedah"],
    tags: courseData.tags ?? [],
    published_at: courseData.published_at ?? now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    db.courses[existingIndex] = completeCourse;
  } else {
    db.courses.unshift(completeCourse);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeCourse;
}

export function deleteCourse(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.courses.length;
  db.courses = db.courses.filter((c) => c.id !== id);
  if (db.courses.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Library / Books ──

export function getAllBooks(): PublicBook[] {
  const db = loadDatabase();
  return db.books;
}

export function getBookByIdOrSlug(identifier: string): PublicBook | null {
  const db = loadDatabase();
  return db.books.find((b) => b.id === identifier || b.slug === identifier) || null;
}

export function saveBook(bookData: Partial<PublicBook> & { title: string; slug: string }): PublicBook {
  const db = loadDatabase();
  const id = bookData.id || `bk_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.books.findIndex((b) => b.id === id || b.slug === bookData.slug);

  const completeBook: PublicBook = {
    object: "book",
    id,
    title: bookData.title,
    slug: bookData.slug,
    summary: bookData.summary ?? null,
    description: bookData.description ?? null,
    author: bookData.author ?? "Sheikh Muhammed Ferej",
    publisher: bookData.publisher ?? null,
    year: bookData.year ?? new Date().getFullYear(),
    isbn: bookData.isbn ?? null,
    kind: bookData.kind ?? "document",
    locale: bookData.locale ?? "am",
    direction: bookData.direction ?? "ltr",
    cover: bookData.cover ?? null,
    file: bookData.file ?? null,
    external_url: bookData.external_url ?? null,
    categories: bookData.categories ?? ["treatise"],
    tags: bookData.tags ?? [],
    published_at: bookData.published_at ?? now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    db.books[existingIndex] = completeBook;
  } else {
    db.books.unshift(completeBook);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeBook;
}

export function deleteBook(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.books.length;
  db.books = db.books.filter((b) => b.id !== id);
  if (db.books.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Events ──

export function getAllEvents(): PublicEvent[] {
  const db = loadDatabase();
  return [...db.events].sort((a, b) => {
    return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
  });
}

export function getEventByIdOrSlug(identifier: string): PublicEvent | null {
  const db = loadDatabase();
  return db.events.find((e) => e.id === identifier || e.slug === identifier) || null;
}

export function saveEvent(eventData: Partial<PublicEvent> & { title: string; slug: string; starts_at: string }): PublicEvent {
  const db = loadDatabase();
  const id = eventData.id || `evt_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = db.events.findIndex((e) => e.id === id || e.slug === eventData.slug);

  const completeEvent: PublicEvent = {
    object: "event",
    id,
    title: eventData.title,
    slug: eventData.slug,
    summary: eventData.summary ?? null,
    description: eventData.description ?? null,
    starts_at: eventData.starts_at,
    ends_at: eventData.ends_at ?? null,
    timezone: eventData.timezone ?? "Africa/Addis_Ababa",
    venue_name: eventData.venue_name ?? null,
    venue_address: eventData.venue_address ?? null,
    online_url: eventData.online_url ?? null,
    registration_required: eventData.registration_required ?? false,
    capacity: eventData.capacity ?? null,
    locale: eventData.locale ?? "am",
    direction: eventData.direction ?? "ltr",
    cover: eventData.cover ?? null,
    categories: eventData.categories ?? ["khutbah"],
    tags: eventData.tags ?? [],
    published_at: eventData.published_at ?? now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    db.events[existingIndex] = completeEvent;
  } else {
    db.events.unshift(completeEvent);
  }

  saveDatabase(db);
  triggerRevalidations();
  return completeEvent;
}

export function deleteEvent(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Media ──

export function getAllMedia(): MediaRef[] {
  const db = loadDatabase();
  return db.media;
}

export function saveMediaItem(mediaItem: MediaRef): MediaRef {
  const db = loadDatabase();
  const existingIndex = db.media.findIndex((m) => m.id === mediaItem.id);
  if (existingIndex >= 0) {
    db.media[existingIndex] = mediaItem;
  } else {
    db.media.unshift(mediaItem);
  }
  saveDatabase(db);
  triggerRevalidations();
  return mediaItem;
}

export function deleteMediaItem(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== initialLength) {
    saveDatabase(db);
    triggerRevalidations();
    return true;
  }
  return false;
}

// ── Inquiries ──

export function getAllInquiries(): InquiryRecord[] {
  const db = loadDatabase();
  return [...db.inquiries].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function createInquiry(payload: {
  question: string;
  name?: string;
  email?: string;
  is_anonymous?: boolean;
  locale?: string;
}): InquiryRecord {
  const db = loadDatabase();
  const inquiry: InquiryRecord = {
    id: `inq_${Date.now()}`,
    question: payload.question,
    name: payload.name,
    email: payload.email,
    is_anonymous: Boolean(payload.is_anonymous),
    locale: payload.locale ?? "am",
    created_at: new Date().toISOString(),
    status: "pending",
  };
  db.inquiries.unshift(inquiry);
  saveDatabase(db);
  return inquiry;
}

export function updateInquiryStatus(id: string, status: InquiryRecord["status"], notes?: string): InquiryRecord | null {
  const db = loadDatabase();
  const inq = db.inquiries.find((i) => i.id === id);
  if (!inq) return null;
  inq.status = status;
  if (notes !== undefined) inq.notes = notes;
  saveDatabase(db);
  return inq;
}

export function deleteInquiry(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  if (db.inquiries.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ── Profile, Journey & Qualifications ──

export function getProfile(): PublicProfile {
  const db = loadDatabase();
  return db.profile;
}

export function updateProfile(partialProfile: Partial<PublicProfile>): PublicProfile {
  const db = loadDatabase();
  db.profile = {
    ...db.profile,
    ...partialProfile,
    updated_at: new Date().toISOString(),
  };
  saveDatabase(db);
  triggerRevalidations();
  return db.profile;
}

export function getJourney(): JourneyMilestone[] {
  const db = loadDatabase();
  return db.journey;
}

export function updateJourney(milestones: JourneyMilestone[]): JourneyMilestone[] {
  const db = loadDatabase();
  db.journey = milestones;
  saveDatabase(db);
  triggerRevalidations();
  return db.journey;
}

export function getQualifications(): QualificationRecord[] {
  const db = loadDatabase();
  return db.qualifications;
}

export function updateQualifications(quals: QualificationRecord[]): QualificationRecord[] {
  const db = loadDatabase();
  db.qualifications = quals;
  saveDatabase(db);
  triggerRevalidations();
  return db.qualifications;
}

// ── Metrics ──

export function getSystemMetrics() {
  const db = loadDatabase();
  const pendingInquiries = db.inquiries.filter((i) => i.status === "pending").length;
  const videoLectures = db.lectures.filter((l) => Boolean(l.media?.video)).length;
  const audioLessons = db.lectures.filter((l) => Boolean(l.media?.audio && !l.media?.video)).length;

  return {
    lecturesCount: db.lectures.length,
    videoLectures,
    audioLessons,
    seriesCount: db.series.length,
    articlesCount: db.articles.length,
    fatwasCount: db.fatwas.length,
    coursesCount: db.courses.length,
    booksCount: db.books.length,
    eventsCount: db.events.length,
    mediaCount: db.media.length,
    inquiriesTotal: db.inquiries.length,
    pendingInquiries,
    lastUpdated: db.updated_at,
    version: db.version,
  };
}

export { exportDatabaseJson, importDatabaseJson, resetDatabase };
