import crypto from "crypto";
import { loadDatabase, saveDatabase, resetDatabase, exportDatabaseJson, importDatabaseJson } from "./store";
import { execute, queryAll, queryOne } from "./sqlite-client";
import { seedSqliteIfEmpty } from "./sqlite-seed";
import type {
  InquiryRecord,
  JourneyMilestone,
  QualificationRecord,
  EventRegistrationRecord,
  CourseEnrollmentRecord,
  CourseExamConfig,
  IssuedCertificateRecord,
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

// Ensure SQLite schema and seed migration runs on startup
seedSqliteIfEmpty().catch((err) => {
  console.warn("SQLite auto-seed notice:", err);
});

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

async function persistLectureToSql(l: PublicLecture) {
  try {
    await execute(
      `INSERT OR REPLACE INTO lectures (id, title, slug, summary, duration_seconds, published_at, updated_at, cover_json, media_json, series_json, categories_json, tags_json, locale, direction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        l.id,
        l.title,
        l.slug,
        l.summary ?? null,
        l.duration_seconds ?? null,
        l.published_at ?? null,
        l.updated_at || new Date().toISOString(),
        JSON.stringify(l.cover ?? null),
        JSON.stringify(l.media || {}),
        JSON.stringify(l.series ?? null),
        JSON.stringify(l.categories ?? []),
        JSON.stringify(l.tags ?? []),
        l.locale || "am",
        l.direction || "ltr",
      ]
    );
  } catch (err) {
    console.error("Failed to persist lecture to SQLite:", err);
  }
}

async function deleteLectureFromSql(id: string) {
  try {
    await execute("DELETE FROM lectures WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete lecture from SQLite:", err);
  }
}

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
  persistLectureToSql(completeLecture);
  triggerRevalidations();
  return completeLecture;
}

export async function saveLectureAsync(lectureData: Partial<PublicLecture> & { title: string; slug: string }): Promise<PublicLecture> {
  const lecture = saveLecture(lectureData);
  await persistLectureToSql(lecture);
  return lecture;
}

export function deleteLecture(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.lectures.length;
  db.lectures = db.lectures.filter((l) => l.id !== id);
  if (db.lectures.length !== initialLength) {
    saveDatabase(db);
    deleteLectureFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteLectureAsync(id: string): Promise<boolean> {
  const deleted = deleteLecture(id);
  await deleteLectureFromSql(id);
  return deleted;
}

// ── Series ──

async function persistSeriesToSql(s: PublicSeries) {
  try {
    await execute(
      `INSERT OR REPLACE INTO series (id, title, slug, description, locale, direction, cover_json, lecture_count, published_at, updated_at, lectures_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        s.id,
        s.title,
        s.slug,
        s.description ?? null,
        s.locale || "am",
        s.direction || "ltr",
        JSON.stringify(s.cover ?? null),
        s.lecture_count || 0,
        s.published_at ?? null,
        s.updated_at || new Date().toISOString(),
        JSON.stringify(s.lectures || []),
      ]
    );
  } catch (err) {
    console.error("Failed to persist series to SQLite:", err);
  }
}

async function deleteSeriesFromSql(id: string) {
  try {
    await execute("DELETE FROM series WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete series from SQLite:", err);
  }
}

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
  persistSeriesToSql(completeSeries);
  triggerRevalidations();
  return completeSeries;
}

export async function saveSeriesAsync(seriesData: Partial<PublicSeries> & { title: string; slug: string }): Promise<PublicSeries> {
  const series = saveSeries(seriesData);
  await persistSeriesToSql(series);
  return series;
}

export function deleteSeries(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.series.length;
  db.series = db.series.filter((s) => s.id !== id);
  if (db.series.length !== initialLength) {
    saveDatabase(db);
    deleteSeriesFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteSeriesAsync(id: string): Promise<boolean> {
  const deleted = deleteSeries(id);
  await deleteSeriesFromSql(id);
  return deleted;
}

// ── Articles ──

async function persistArticleToSql(a: PublicArticle) {
  try {
    await execute(
      `INSERT OR REPLACE INTO articles (id, title, slug, summary, body, reading_minutes, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        a.id,
        a.title,
        a.slug,
        a.summary ?? null,
        a.body ?? "",
        a.reading_minutes ?? 5,
        a.locale || "am",
        a.direction || "ltr",
        JSON.stringify(a.cover ?? null),
        JSON.stringify(a.categories ?? []),
        JSON.stringify(a.tags ?? []),
        a.published_at ?? null,
        a.updated_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist article to SQLite:", err);
  }
}

async function deleteArticleFromSql(id: string) {
  try {
    await execute("DELETE FROM articles WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete article from SQLite:", err);
  }
}

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
    body: articleData.body || "",
    reading_minutes: articleData.reading_minutes ?? 5,
    locale: articleData.locale ?? "am",
    direction: articleData.direction ?? "ltr",
    published_at: articleData.published_at ?? now,
    updated_at: now,
    cover: articleData.cover ?? null,
    categories: articleData.categories ?? ["articles"],
    tags: articleData.tags ?? [],
  };

  if (existingIndex >= 0) {
    db.articles[existingIndex] = completeArticle;
  } else {
    db.articles.unshift(completeArticle);
  }

  saveDatabase(db);
  persistArticleToSql(completeArticle);
  triggerRevalidations();
  return completeArticle;
}

export async function saveArticleAsync(articleData: Partial<PublicArticle> & { title: string; slug: string }): Promise<PublicArticle> {
  const article = saveArticle(articleData);
  await persistArticleToSql(article);
  return article;
}

export function deleteArticle(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id);
  if (db.articles.length !== initialLength) {
    saveDatabase(db);
    deleteArticleFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteArticleAsync(id: string): Promise<boolean> {
  const deleted = deleteArticle(id);
  await deleteArticleFromSql(id);
  return deleted;
}

// ── Fatwas ──

async function persistFatwaToSql(f: PublicFatwa) {
  try {
    await execute(
      `INSERT OR REPLACE INTO fatwas (id, title, slug, summary, question, answer, locale, direction, categories_json, tags_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        f.id,
        f.title,
        f.slug,
        f.summary ?? null,
        f.question ?? null,
        f.answer ?? null,
        f.locale || "am",
        f.direction || "ltr",
        JSON.stringify(f.categories || []),
        JSON.stringify(f.tags || []),
        f.published_at ?? null,
        f.updated_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist fatwa to SQLite:", err);
  }
}

async function deleteFatwaFromSql(id: string) {
  try {
    await execute("DELETE FROM fatwas WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete fatwa from SQLite:", err);
  }
}

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
    published_at: fatwaData.published_at ?? now,
    updated_at: now,
    categories: fatwaData.categories ?? ["fiqh"],
    tags: fatwaData.tags ?? [],
  };

  if (existingIndex >= 0) {
    db.fatwas[existingIndex] = completeFatwa;
  } else {
    db.fatwas.unshift(completeFatwa);
  }

  saveDatabase(db);
  persistFatwaToSql(completeFatwa);
  triggerRevalidations();
  return completeFatwa;
}

export async function saveFatwaAsync(fatwaData: Partial<PublicFatwa> & { title: string; slug: string }): Promise<PublicFatwa> {
  const fatwa = saveFatwa(fatwaData);
  await persistFatwaToSql(fatwa);
  return fatwa;
}

export function deleteFatwa(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.fatwas.length;
  db.fatwas = db.fatwas.filter((f) => f.id !== id);
  if (db.fatwas.length !== initialLength) {
    saveDatabase(db);
    deleteFatwaFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteFatwaAsync(id: string): Promise<boolean> {
  const deleted = deleteFatwa(id);
  await deleteFatwaFromSql(id);
  return deleted;
}

// ── Courses ──

async function persistCourseToSql(c: PublicCourse) {
  try {
    await execute(
      `INSERT OR REPLACE INTO courses (id, title, slug, summary, description, enrolment_open, lesson_count, lessons_json, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        c.id,
        c.title,
        c.slug,
        c.summary ?? null,
        c.description ?? null,
        c.enrolment_open ? 1 : 0,
        c.lesson_count || (c.lessons ? c.lessons.length : 0),
        JSON.stringify(c.lessons || []),
        c.locale || "am",
        c.direction || "ltr",
        JSON.stringify(c.cover ?? null),
        JSON.stringify(c.categories || []),
        JSON.stringify(c.tags || []),
        c.published_at ?? null,
        c.updated_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist course to SQLite:", err);
  }
}

async function deleteCourseFromSql(id: string) {
  try {
    await execute("DELETE FROM courses WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete course from SQLite:", err);
  }
}

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
    categories: courseData.categories ?? ["Islamic Studies"],
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
  persistCourseToSql(completeCourse);
  triggerRevalidations();
  return completeCourse;
}

export async function saveCourseAsync(courseData: Partial<PublicCourse> & { title: string; slug: string }): Promise<PublicCourse> {
  const course = saveCourse(courseData);
  await persistCourseToSql(course);
  return course;
}

export function deleteCourse(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.courses.length;
  db.courses = db.courses.filter((c) => c.id !== id);
  if (db.courses.length !== initialLength) {
    saveDatabase(db);
    deleteCourseFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteCourseAsync(id: string): Promise<boolean> {
  const deleted = deleteCourse(id);
  await deleteCourseFromSql(id);
  return deleted;
}

// ── Books & Digital Library ──

async function persistBookToSql(b: PublicBook) {
  try {
    await execute(
      `INSERT OR REPLACE INTO library_items (id, title, slug, summary, description, author, publisher, year, isbn, kind, locale, direction, cover_json, file_json, external_url, categories_json, tags_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        b.id,
        b.title,
        b.slug,
        b.summary ?? null,
        b.description ?? null,
        b.author ?? "Sheikh Muhammed Ferej Megeno",
        b.publisher ?? null,
        b.year ?? null,
        b.isbn ?? null,
        b.kind || "document",
        b.locale || "am",
        b.direction || "ltr",
        JSON.stringify(b.cover ?? null),
        JSON.stringify(b.file ?? null),
        b.external_url ?? null,
        JSON.stringify(b.categories ?? []),
        JSON.stringify(b.tags ?? []),
        b.published_at ?? null,
        b.updated_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist book to SQLite:", err);
  }
}

async function deleteBookFromSql(id: string) {
  try {
    await execute("DELETE FROM library_items WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete book from SQLite:", err);
  }
}

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
    author: bookData.author ?? "Sheikh Muhammed Ferej Megeno",
    publisher: bookData.publisher ?? null,
    year: bookData.year ?? new Date().getFullYear(),
    isbn: bookData.isbn ?? null,
    kind: bookData.kind ?? "document",
    locale: bookData.locale ?? "am",
    direction: bookData.direction ?? "ltr",
    cover: bookData.cover ?? null,
    file: bookData.file ?? null,
    external_url: bookData.external_url ?? null,
    categories: bookData.categories ?? ["Publications"],
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
  persistBookToSql(completeBook);
  triggerRevalidations();
  return completeBook;
}

export async function saveBookAsync(bookData: Partial<PublicBook> & { title: string; slug: string }): Promise<PublicBook> {
  const book = saveBook(bookData);
  await persistBookToSql(book);
  return book;
}

export function deleteBook(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.books.length;
  db.books = db.books.filter((b) => b.id !== id);
  if (db.books.length !== initialLength) {
    saveDatabase(db);
    deleteBookFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteBookAsync(id: string): Promise<boolean> {
  const deleted = deleteBook(id);
  await deleteBookFromSql(id);
  return deleted;
}

// ── Events ──

async function persistEventToSql(ev: PublicEvent) {
  try {
    await execute(
      `INSERT OR REPLACE INTO events (id, title, slug, summary, description, starts_at, ends_at, timezone, venue_name, venue_address, online_url, registration_required, capacity, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        ev.id,
        ev.title,
        ev.slug,
        ev.summary ?? null,
        ev.description ?? null,
        ev.starts_at,
        ev.ends_at ?? null,
        ev.timezone || "Africa/Addis_Ababa",
        ev.venue_name ?? null,
        ev.venue_address ?? null,
        ev.online_url ?? null,
        ev.registration_required ? 1 : 0,
        ev.capacity ?? null,
        ev.locale || "am",
        ev.direction || "ltr",
        JSON.stringify(ev.cover ?? null),
        JSON.stringify(ev.categories ?? []),
        JSON.stringify(ev.tags ?? []),
        ev.published_at ?? null,
        ev.updated_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist event to SQLite:", err);
  }
}

async function deleteEventFromSql(id: string) {
  try {
    await execute("DELETE FROM events WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete event from SQLite:", err);
  }
}

export function getAllEvents(): PublicEvent[] {
  const db = loadDatabase();
  return [...db.events].sort((a, b) => {
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
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
    registration_required: Boolean(eventData.registration_required),
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
  persistEventToSql(completeEvent);
  triggerRevalidations();
  return completeEvent;
}

export async function saveEventAsync(eventData: Partial<PublicEvent> & { title: string; slug: string; starts_at: string }): Promise<PublicEvent> {
  const event = saveEvent(eventData);
  await persistEventToSql(event);
  return event;
}

export function deleteEvent(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== initialLength) {
    saveDatabase(db);
    deleteEventFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteEventAsync(id: string): Promise<boolean> {
  const deleted = deleteEvent(id);
  await deleteEventFromSql(id);
  return deleted;
}

// ── Media ──

async function persistMediaToSql(m: MediaRef) {
  try {
    await execute(
      `INSERT OR REPLACE INTO media_assets (id, url, kind, mime_type, width, height, duration_seconds, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        m.id,
        m.url,
        m.kind || "image",
        m.mime_type || "image/jpeg",
        m.width ?? null,
        m.height ?? null,
        m.duration_seconds ?? null,
        new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist media to SQLite:", err);
  }
}

async function deleteMediaFromSql(id: string) {
  try {
    await execute("DELETE FROM media_assets WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete media from SQLite:", err);
  }
}

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
  persistMediaToSql(mediaItem);
  triggerRevalidations();
  return mediaItem;
}

export async function saveMediaItemAsync(mediaItem: MediaRef): Promise<MediaRef> {
  const item = saveMediaItem(mediaItem);
  await persistMediaToSql(item);
  return item;
}

export function deleteMediaItem(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== initialLength) {
    saveDatabase(db);
    deleteMediaFromSql(id);
    triggerRevalidations();
    return true;
  }
  return false;
}

export async function deleteMediaItemAsync(id: string): Promise<boolean> {
  const deleted = deleteMediaItem(id);
  await deleteMediaFromSql(id);
  return deleted;
}

// ── Inquiries ──

async function persistInquiryToSql(inq: InquiryRecord) {
  try {
    await execute(
      `INSERT OR REPLACE INTO inquiries (id, question, name, email, is_anonymous, locale, status, notes, answer, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        inq.id,
        inq.question,
        inq.name ?? null,
        inq.email ?? null,
        inq.is_anonymous ? 1 : 0,
        inq.locale || "am",
        inq.status || "pending",
        inq.notes ?? null,
        inq.answer ?? null,
        inq.created_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist inquiry to SQLite:", err);
  }
}

async function deleteInquiryFromSql(id: string) {
  try {
    await execute("DELETE FROM inquiries WHERE id = ?;", [id]);
  } catch (err) {
    console.error("Failed to delete inquiry from SQLite:", err);
  }
}

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
  persistInquiryToSql(inquiry);
  return inquiry;
}

export async function createInquiryAsync(payload: {
  question: string;
  name?: string;
  email?: string;
  is_anonymous?: boolean;
  locale?: string;
}): Promise<InquiryRecord> {
  const inquiry = createInquiry(payload);
  await persistInquiryToSql(inquiry);
  return inquiry;
}

export function updateInquiryStatus(id: string, status: InquiryRecord["status"], notes?: string): InquiryRecord | null {
  const db = loadDatabase();
  const inq = db.inquiries.find((i) => i.id === id);
  if (!inq) return null;
  inq.status = status;
  if (notes !== undefined) inq.notes = notes;
  saveDatabase(db);
  persistInquiryToSql(inq);
  return inq;
}

export async function updateInquiryStatusAsync(id: string, status: InquiryRecord["status"], notes?: string): Promise<InquiryRecord | null> {
  const inq = updateInquiryStatus(id, status, notes);
  if (inq) {
    await persistInquiryToSql(inq);
  }
  return inq;
}

export function deleteInquiry(id: string): boolean {
  const db = loadDatabase();
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  if (db.inquiries.length !== initialLength) {
    saveDatabase(db);
    deleteInquiryFromSql(id);
    return true;
  }
  return false;
}

export async function deleteInquiryAsync(id: string): Promise<boolean> {
  const deleted = deleteInquiry(id);
  await deleteInquiryFromSql(id);
  return deleted;
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
  execute(
    `INSERT OR REPLACE INTO scholar_profile (id, name, headline, biography, languages_json, location, photo_json, sections_json, socials_json, locale, direction, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      db.profile.id || "primary",
      db.profile.name || "Sheikh Muhammed Ferej Megeno",
      db.profile.headline ?? null,
      db.profile.biography ?? null,
      JSON.stringify(db.profile.languages || ["am", "ar", "en", "om"]),
      db.profile.location ?? "Addis Ababa, Ethiopia",
      JSON.stringify(db.profile.photo ?? null),
      JSON.stringify(db.profile.sections || {}),
      JSON.stringify(db.profile.socials || {}),
      db.profile.locale || "am",
      db.profile.direction || "ltr",
      db.profile.updated_at,
    ]
  ).catch(console.error);
  triggerRevalidations();
  return db.profile;
}

export async function updateProfileAsync(partialProfile: Partial<PublicProfile>): Promise<PublicProfile> {
  const profile = updateProfile(partialProfile);
  await execute(
    `INSERT OR REPLACE INTO scholar_profile (id, name, headline, biography, languages_json, location, photo_json, sections_json, socials_json, locale, direction, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      profile.id || "primary",
      profile.name || "Sheikh Muhammed Ferej Megeno",
      profile.headline ?? null,
      profile.biography ?? null,
      JSON.stringify(profile.languages || ["am", "ar", "en", "om"]),
      profile.location ?? "Addis Ababa, Ethiopia",
      JSON.stringify(profile.photo ?? null),
      JSON.stringify(profile.sections || {}),
      JSON.stringify(profile.socials || {}),
      profile.locale || "am",
      profile.direction || "ltr",
      profile.updated_at,
    ]
  );
  return profile;
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

export async function updateJourneyAsync(milestones: JourneyMilestone[]): Promise<JourneyMilestone[]> {
  const updated = updateJourney(milestones);
  try {
    await execute("DELETE FROM journey_milestones;");
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      await execute(
        `INSERT INTO journey_milestones (id, year, title, institution, description, type, position, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [`jrn_${i}_${Date.now()}`, m.year, m.title, m.institution ?? null, m.description || "", m.type || "contribution", i, new Date().toISOString()]
      );
    }
  } catch (err) {
    console.error("Failed to sync journey to SQLite:", err);
  }
  return updated;
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

export async function updateQualificationsAsync(quals: QualificationRecord[]): Promise<QualificationRecord[]> {
  const updated = updateQualifications(quals);
  try {
    await execute("DELETE FROM qualifications;");
    for (let i = 0; i < quals.length; i++) {
      const q = quals[i];
      await execute(
        `INSERT INTO qualifications (id, title, issuer, year, type, description, position, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [q.id || `qual_${i}`, q.title, q.issuer, q.year, q.type || "academic", q.description || "", i, new Date().toISOString()]
      );
    }
  } catch (err) {
    console.error("Failed to sync qualifications to SQLite:", err);
  }
  return updated;
}

// ── Event Registrations ──

async function persistEventRegistrationToSql(reg: EventRegistrationRecord) {
  try {
    await execute(
      `INSERT OR REPLACE INTO event_registrations (id, event_id, event_slug, event_title, name, email, phone, city, attendees_count, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        reg.id,
        reg.event_id,
        reg.event_slug,
        reg.event_title,
        reg.name,
        reg.email,
        reg.phone ?? null,
        reg.city ?? null,
        reg.attendees_count || 1,
        reg.notes ?? null,
        reg.status || "confirmed",
        reg.created_at || new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist event registration to SQLite:", err);
  }
}

export function getAllEventRegistrations(): EventRegistrationRecord[] {
  const db = loadDatabase();
  return [...db.event_registrations].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getRegistrationsByEventId(eventIdOrSlug: string): EventRegistrationRecord[] {
  const db = loadDatabase();
  return db.event_registrations.filter(
    (r) => r.event_id === eventIdOrSlug || r.event_slug === eventIdOrSlug
  );
}

export function createEventRegistration(payload: {
  event_id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  attendees_count?: number;
  notes?: string;
}): EventRegistrationRecord {
  const db = loadDatabase();
  const id = `evtr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const reg: EventRegistrationRecord = {
    id,
    event_id: payload.event_id,
    event_slug: payload.event_slug,
    event_title: payload.event_title,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim(),
    city: payload.city?.trim(),
    attendees_count: Math.max(1, payload.attendees_count || 1),
    notes: payload.notes?.trim(),
    created_at: new Date().toISOString(),
    status: "confirmed",
  };
  db.event_registrations.unshift(reg);
  saveDatabase(db);
  persistEventRegistrationToSql(reg);
  return reg;
}

export async function createEventRegistrationAsync(payload: {
  event_id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  attendees_count?: number;
  notes?: string;
}): Promise<EventRegistrationRecord> {
  const reg = createEventRegistration(payload);
  await persistEventRegistrationToSql(reg);
  return reg;
}

export function updateEventRegistrationStatus(
  id: string,
  status: EventRegistrationRecord["status"]
): EventRegistrationRecord | null {
  const db = loadDatabase();
  const reg = db.event_registrations.find((r) => r.id === id);
  if (!reg) return null;
  reg.status = status;
  saveDatabase(db);
  persistEventRegistrationToSql(reg);
  return reg;
}

export async function updateEventRegistrationStatusAsync(
  id: string,
  status: EventRegistrationRecord["status"]
): Promise<EventRegistrationRecord | null> {
  const reg = updateEventRegistrationStatus(id, status);
  if (reg) {
    await persistEventRegistrationToSql(reg);
  }
  return reg;
}

export function deleteEventRegistration(id: string): boolean {
  const db = loadDatabase();
  const initLen = db.event_registrations.length;
  db.event_registrations = db.event_registrations.filter((r) => r.id !== id);
  if (db.event_registrations.length !== initLen) {
    saveDatabase(db);
    execute("DELETE FROM event_registrations WHERE id = ?;", [id]).catch(console.error);
    return true;
  }
  return false;
}

export async function deleteEventRegistrationAsync(id: string): Promise<boolean> {
  const deleted = deleteEventRegistration(id);
  await execute("DELETE FROM event_registrations WHERE id = ?;", [id]);
  return deleted;
}

// ── Course Enrollments & Progress ──

async function persistCourseEnrollmentToSql(enr: CourseEnrollmentRecord) {
  try {
    await execute(
      `INSERT OR REPLACE INTO course_enrollments (id, course_id, course_slug, course_title, student_name, student_email, student_phone, city, status, completed_lessons_json, exam_attempts_json, certificate_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        enr.id,
        enr.course_id,
        enr.course_slug,
        enr.course_title,
        enr.student_name,
        enr.student_email,
        enr.student_phone ?? null,
        enr.city ?? null,
        enr.status || "enrolled",
        JSON.stringify(enr.completed_lessons || []),
        JSON.stringify(enr.exam_attempts || []),
        enr.certificate_id ?? null,
        enr.created_at || new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  } catch (err) {
    console.error("Failed to persist course enrollment to SQLite:", err);
  }
}

export function getAllCourseEnrollments(): CourseEnrollmentRecord[] {
  const db = loadDatabase();
  return [...db.course_enrollments].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getEnrollmentByEmail(
  courseIdOrSlug: string,
  email: string
): CourseEnrollmentRecord | null {
  const db = loadDatabase();
  const cleanEmail = email.trim().toLowerCase();
  return (
    db.course_enrollments.find(
      (e) =>
        (e.course_id === courseIdOrSlug || e.course_slug === courseIdOrSlug) &&
        e.student_email.toLowerCase() === cleanEmail
    ) || null
  );
}

export function createCourseEnrollment(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  city?: string;
}): CourseEnrollmentRecord {
  const db = loadDatabase();
  const existing = getEnrollmentByEmail(payload.course_slug, payload.student_email);
  if (existing) {
    return existing;
  }

  const id = `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const enrollment: CourseEnrollmentRecord = {
    id,
    course_id: payload.course_id,
    course_slug: payload.course_slug,
    course_title: payload.course_title,
    student_name: payload.student_name.trim(),
    student_email: payload.student_email.trim().toLowerCase(),
    student_phone: payload.student_phone?.trim(),
    city: payload.city?.trim(),
    created_at: new Date().toISOString(),
    completed_lessons: [],
    exam_attempts: [],
    status: "enrolled",
    certificate_id: null,
  };

  db.course_enrollments.unshift(enrollment);
  saveDatabase(db);
  persistCourseEnrollmentToSql(enrollment);
  return enrollment;
}

export async function createCourseEnrollmentAsync(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  city?: string;
}): Promise<CourseEnrollmentRecord> {
  const enrollment = createCourseEnrollment(payload);
  await persistCourseEnrollmentToSql(enrollment);
  return enrollment;
}

export function toggleLessonProgress(
  enrollmentId: string,
  lessonId: string
): CourseEnrollmentRecord | null {
  const db = loadDatabase();
  const enr = db.course_enrollments.find((e) => e.id === enrollmentId);
  if (!enr) return null;

  if (enr.completed_lessons.includes(lessonId)) {
    enr.completed_lessons = enr.completed_lessons.filter((l) => l !== lessonId);
  } else {
    enr.completed_lessons.push(lessonId);
  }

  if (enr.completed_lessons.length > 0 && enr.status === "enrolled") {
    enr.status = "in_progress";
  }

  saveDatabase(db);
  persistCourseEnrollmentToSql(enr);
  return enr;
}

export async function toggleLessonProgressAsync(
  enrollmentId: string,
  lessonId: string
): Promise<CourseEnrollmentRecord | null> {
  const enr = toggleLessonProgress(enrollmentId, lessonId);
  if (enr) {
    await persistCourseEnrollmentToSql(enr);
  }
  return enr;
}

// ── Course Exams & Grading ──

export function getCourseExam(courseIdOrSlug: string): CourseExamConfig | null {
  const db = loadDatabase();
  return (
    db.course_exams[courseIdOrSlug] ||
    db.course_exams["comprehensive-riyadus-saliheen"] ||
    null
  );
}

export function saveCourseExam(
  courseIdOrSlug: string,
  examConfig: CourseExamConfig
): CourseExamConfig {
  const db = loadDatabase();
  db.course_exams[courseIdOrSlug] = examConfig;
  saveDatabase(db);
  execute(
    `INSERT OR REPLACE INTO course_exams (course_slug, course_id, passing_percentage, questions_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      courseIdOrSlug,
      examConfig.course_id || courseIdOrSlug,
      examConfig.passing_percentage || 70,
      JSON.stringify(examConfig.questions || []),
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  ).catch(console.error);
  return examConfig;
}

export async function saveCourseExamAsync(
  courseIdOrSlug: string,
  examConfig: CourseExamConfig
): Promise<CourseExamConfig> {
  const exam = saveCourseExam(courseIdOrSlug, examConfig);
  await execute(
    `INSERT OR REPLACE INTO course_exams (course_slug, course_id, passing_percentage, questions_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      courseIdOrSlug,
      examConfig.course_id || courseIdOrSlug,
      examConfig.passing_percentage || 70,
      JSON.stringify(examConfig.questions || []),
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
  return exam;
}

function computeHijriDate(): string {
  try {
    return (
      new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()) + " AH"
    );
  } catch {
    return "1448 AH";
  }
}

function generateCertificateVerificationToken(
  studentName: string,
  courseId: string,
  issueDate: string
): string {
  const secret = process.env.CERTIFICATE_SECRET || "sheikh_muhammed_ferej_scholarly_seal_2026";
  const data = `${studentName.trim().toLowerCase()}|${courseId.trim().toLowerCase()}|${issueDate}`;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function generateCertificateCode(courseSlug: string): string {
  const year = new Date().getFullYear();
  let acronym = "GEN";
  const lower = courseSlug.toLowerCase();
  if (lower.includes("riyad") || lower.includes("saliheen")) acronym = "RDS";
  else if (lower.includes("tafsir")) acronym = "TFS";
  else if (lower.includes("hadith")) acronym = "HDT";
  else if (lower.includes("fiqh")) acronym = "FQH";
  else if (lower.includes("aqeedah")) acronym = "AQD";
  else if (lower.includes("quran")) acronym = "QRN";

  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MFM-${year}-${acronym}-${rand}`;
}

export function submitCourseExam(payload: {
  course_id: string;
  student_email: string;
  student_name?: string;
  answers: Record<string, number>;
}): {
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  certificate?: IssuedCertificateRecord;
  enrollment?: CourseEnrollmentRecord;
} {
  const db = loadDatabase();
  const exam = getCourseExam(payload.course_id);
  if (!exam || !exam.questions || exam.questions.length === 0) {
    throw new Error("Exam configuration not found for this course.");
  }

  let correctCount = 0;
  for (const q of exam.questions) {
    const selected = payload.answers[q.id];
    if (selected !== undefined && selected === q.correct_option_index) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= (exam.passing_percentage || 70);

  // Find or create enrollment
  let enrollment = getEnrollmentByEmail(payload.course_id, payload.student_email);
  if (!enrollment && payload.student_name) {
    const course = db.courses.find((c) => c.id === payload.course_id || c.slug === payload.course_id);
    enrollment = createCourseEnrollment({
      course_id: payload.course_id,
      course_slug: course?.slug || payload.course_id,
      course_title: course?.title || "Comprehensive Islamic Studies",
      student_name: payload.student_name,
      student_email: payload.student_email,
    });
  }

  let certificate: IssuedCertificateRecord | undefined;

  if (passed) {
    const course = db.courses.find((c) => c.id === payload.course_id || c.slug === payload.course_id);
    const studentName = enrollment ? enrollment.student_name : (payload.student_name || "Enrolled Student");

    let gradeTitle = "Jayyid Jiddan (Very Good / جيد جداً)";
    if (score === 100) {
      gradeTitle = "Mumtaz with Highest Distinction (ممتاز مع مرتبة الشرف الأولى)";
    } else if (score >= 90) {
      gradeTitle = "Mumtaz with Distinction (ممتاز)";
    }

    certificate = issueCertificate({
      course_id: payload.course_id,
      course_slug: course?.slug || payload.course_id,
      course_title: course?.title || "Comprehensive Islamic Studies",
      student_name: studentName,
      student_email: payload.student_email,
      score_percentage: score,
      grade_title: gradeTitle,
    });

    if (enrollment) {
      enrollment.certificate_id = certificate.id;
      enrollment.status = "completed";
    }
  }

  if (enrollment) {
    enrollment.exam_attempts.push({
      attempt_date: new Date().toISOString(),
      score,
      passed,
    });
    saveDatabase(db);
    persistCourseEnrollmentToSql(enrollment);
  }

  return {
    score,
    passed,
    correct_count: correctCount,
    total_questions: exam.questions.length,
    certificate,
    enrollment: enrollment || undefined,
  };
}

export async function submitCourseExamAsync(payload: {
  course_id: string;
  student_email: string;
  student_name?: string;
  answers: Record<string, number>;
}) {
  return submitCourseExam(payload);
}

// ── Certificates & Public Verification ──

async function persistCertificateToSql(cert: IssuedCertificateRecord) {
  try {
    await execute(
      `INSERT OR REPLACE INTO certificates (id, verification_token, course_id, course_slug, course_title, student_name, student_email, score_percentage, grade_title, issued_at, hijri_date, instructor_name, authority_seal, revoked, revoked_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        cert.id,
        cert.verification_token,
        cert.course_id,
        cert.course_slug,
        cert.course_title,
        cert.student_name,
        cert.student_email,
        cert.score_percentage,
        cert.grade_title,
        cert.issued_at,
        cert.hijri_date ?? null,
        cert.instructor_name || "Sheikh Muhammed Ferej Megeno",
        cert.authority_seal || "AAOIFI Sharia Board & Al-Fajr Islamic Foundation",
        cert.revoked ? 1 : 0,
        cert.revoked_reason ?? null,
      ]
    );
  } catch (err) {
    console.error("Failed to persist certificate to SQLite:", err);
  }
}

export function getAllCertificates(): IssuedCertificateRecord[] {
  const db = loadDatabase();
  return [...db.certificates].sort((a, b) => {
    return new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime();
  });
}

export function getCertificateByCode(code: string): IssuedCertificateRecord | null {
  const db = loadDatabase();
  const cleanCode = code.trim().toUpperCase();
  return db.certificates.find((c) => c.id.toUpperCase() === cleanCode) || null;
}

export function issueCertificate(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  score_percentage: number;
  grade_title?: string;
}): IssuedCertificateRecord {
  const db = loadDatabase();

  // Check if a certificate already exists for this student & course
  const existing = db.certificates.find(
    (c) =>
      c.course_slug === payload.course_slug &&
      c.student_email.toLowerCase() === payload.student_email.toLowerCase() &&
      !c.revoked
  );
  if (existing) {
    return existing;
  }

  const issuedAt = new Date().toISOString();
  const id = generateCertificateCode(payload.course_slug);
  const token = generateCertificateVerificationToken(payload.student_name, payload.course_id, issuedAt);

  const cert: IssuedCertificateRecord = {
    id,
    verification_token: token,
    course_id: payload.course_id,
    course_slug: payload.course_slug,
    course_title: payload.course_title,
    student_name: payload.student_name.trim(),
    student_email: payload.student_email.trim().toLowerCase(),
    issued_at: issuedAt,
    hijri_date: computeHijriDate(),
    score_percentage: payload.score_percentage,
    grade_title: payload.grade_title || (payload.score_percentage >= 90 ? "Mumtaz (Distinction)" : "Jayyid Jiddan (Very Good)"),
    instructor_name: "Sheikh Muhammed Ferej Megeno",
    authority_seal: "Al-Fajr Islamic Foundation & AAOIFI Sharia Council Accreditation",
    revoked: false,
    revoked_reason: null,
  };

  db.certificates.unshift(cert);
  saveDatabase(db);
  persistCertificateToSql(cert);
  return cert;
}

export async function issueCertificateAsync(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  score_percentage: number;
  grade_title?: string;
}): Promise<IssuedCertificateRecord> {
  const cert = issueCertificate(payload);
  await persistCertificateToSql(cert);
  return cert;
}

export function revokeCertificate(id: string, reason?: string): IssuedCertificateRecord | null {
  const db = loadDatabase();
  const cert = db.certificates.find((c) => c.id.toUpperCase() === id.trim().toUpperCase());
  if (!cert) return null;

  cert.revoked = true;
  cert.revoked_reason = reason?.trim() || "Revoked by Scholarly Accreditation Board.";
  saveDatabase(db);
  persistCertificateToSql(cert);
  return cert;
}

export async function revokeCertificateAsync(id: string, reason?: string): Promise<IssuedCertificateRecord | null> {
  const cert = revokeCertificate(id, reason);
  if (cert) {
    await persistCertificateToSql(cert);
  }
  return cert;
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
    enrollmentsCount: db.course_enrollments.length,
    certificatesCount: db.certificates.length,
    eventRegistrationsCount: db.event_registrations.length,
    lastUpdated: db.updated_at,
    version: db.version,
  };
}

export { exportDatabaseJson, importDatabaseJson, resetDatabase };
