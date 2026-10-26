import crypto from "crypto";
import { loadDatabase, saveDatabase, resetDatabase, exportDatabaseJson, importDatabaseJson } from "./store";
import type {
  PortalDatabase,
  InquiryRecord,
  JourneyMilestone,
  QualificationRecord,
  EventRegistrationRecord,
  CourseEnrollmentRecord,
  CourseExamConfig,
  IssuedCertificateRecord,
  ExamQuestion,
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

// ── Event Registrations ──

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
  const registration: EventRegistrationRecord = {
    id: `evtr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    event_id: payload.event_id,
    event_slug: payload.event_slug,
    event_title: payload.event_title,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || undefined,
    city: payload.city?.trim() || undefined,
    attendees_count: payload.attendees_count && payload.attendees_count > 0 ? payload.attendees_count : 1,
    created_at: new Date().toISOString(),
    status: "confirmed",
    notes: payload.notes?.trim() || undefined,
  };

  db.event_registrations.unshift(registration);
  saveDatabase(db);
  return registration;
}

export function updateEventRegistrationStatus(
  id: string,
  status: EventRegistrationRecord["status"]
): EventRegistrationRecord | null {
  const db = loadDatabase();
  const record = db.event_registrations.find((r) => r.id === id);
  if (!record) return null;
  record.status = status;
  saveDatabase(db);
  return record;
}

export function deleteEventRegistration(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.event_registrations.length;
  db.event_registrations = db.event_registrations.filter((r) => r.id !== id);
  if (db.event_registrations.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ── Course Enrollments ──

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
  const normalizedEmail = email.trim().toLowerCase();
  return (
    db.course_enrollments.find(
      (e) =>
        (e.course_id === courseIdOrSlug || e.course_slug === courseIdOrSlug) &&
        e.student_email.toLowerCase() === normalizedEmail
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

  const enrollment: CourseEnrollmentRecord = {
    id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    course_id: payload.course_id,
    course_slug: payload.course_slug,
    course_title: payload.course_title,
    student_name: payload.student_name.trim(),
    student_email: payload.student_email.trim().toLowerCase(),
    student_phone: payload.student_phone?.trim() || undefined,
    city: payload.city?.trim() || undefined,
    created_at: new Date().toISOString(),
    completed_lessons: [],
    exam_attempts: [],
    certificate_id: null,
    status: "enrolled",
  };

  db.course_enrollments.unshift(enrollment);
  saveDatabase(db);
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
  return enr;
}

// ── Course Exams & Grading ──

export function getCourseExam(courseIdOrSlug: string): CourseExamConfig | null {
  const db = loadDatabase();
  return (
    db.course_exams[courseIdOrSlug] ||
    db.course_exams["comprehensive-kitab-at-tawheed"] ||
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
  return examConfig;
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
  if (lower.includes("tawheed")) acronym = "TWH";
  else if (lower.includes("fiqh")) acronym = "FQH";
  else if (lower.includes("hadith")) acronym = "HDT";
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

// ── Certificates & Public Verification ──

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
  return cert;
}

export function revokeCertificate(id: string, reason?: string): IssuedCertificateRecord | null {
  const db = loadDatabase();
  const cert = db.certificates.find((c) => c.id.toUpperCase() === id.trim().toUpperCase());
  if (!cert) return null;

  cert.revoked = true;
  cert.revoked_reason = reason?.trim() || "Revoked by Scholarly Accreditation Board.";
  saveDatabase(db);
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
