"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import {
  saveLecture,
  getLectureByIdOrSlug,
  deleteLecture,
  saveSeries,
  getSeriesByIdOrSlug,
  deleteSeries,
  saveArticle,
  deleteArticle,
  saveFatwa,
  deleteFatwa,
  saveCourse,
  getCourseByIdOrSlug,
  renameCourseSlug,
  getCourseExam,
  saveCourseExam,
  deleteCourseExam,
  updateEnrollmentStatus,
  deleteCourseEnrollment,
  deleteCertificate,
  deleteCourse,
  saveBook,
  deleteBook,
  saveEvent,
  deleteEvent,
  saveMediaItem,
  deleteMediaItem,
  updateInquiryStatus,
  deleteInquiry,
  getProfile,
  updateProfile,
  updateJourney,
  updateQualifications,
  issueCertificate,
  revokeCertificate,
  updateEventRegistrationStatus,
  deleteEventRegistration,
  importDatabaseJson,
  resetDatabase,
} from "@/lib/db/repository";
import { mediaRefFromUrl } from "@/lib/media-ref";
import { oembedEndpoint, parseMediaUrl } from "@/lib/media-source";
import { UserError } from "@/lib/user-error";
import type { SectionMap } from "@/lib/api/types";
import type { JourneyMilestone, QualificationRecord } from "@/lib/db/types";

async function assertAuthenticated() {
  const session = await getSessionUser();
  if (!session) {
    throw new Error("Unauthorized access. Admin session required.");
  }
}

type Failure = { success: false; error: string };

/** Runs an action body, returning expected (user-facing) errors as a result instead of throwing. */
async function guarded<T>(fn: () => Promise<T>): Promise<T | Failure> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof UserError) return { success: false, error: err.message };
    throw err;
  }
}

function refreshCache() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Ignore outside active request
  }
}

// ── Lecture Actions ──

/** Resolves the series a lecture belongs to from the database (title and next position), not from the client. */
async function resolveLectureSeries(lectureId: string | undefined, seriesId: string | undefined) {
  if (!seriesId) return null;
  const series = await getSeriesByIdOrSlug(seriesId);
  if (!series) throw new UserError("Selected series no longer exists.");
  const current = lectureId ? series.lectures?.find((l) => l.id === lectureId) : undefined;
  const position = current?.series?.position ?? (series.lectures?.length ?? 0) + 1;
  return { id: series.id, title: series.title, position };
}

export async function saveLectureAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  videoUrl?: string;
  audioUrl?: string;
  durationSeconds?: number;
  transcript?: string;
  /** undefined keeps the current cover; an empty string removes it. */
  coverUrl?: string;
  seriesId?: string;
  categories?: string[];
  tags?: string[];
  publishedAt?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const existingLecture = data.id ? await getLectureByIdOrSlug(data.id) : null;
    const lecture = await saveLecture({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      duration_seconds: data.durationSeconds || null,
      published_at: data.publishedAt || new Date().toISOString(),
      media: {
        video: data.videoUrl || null,
        audio: data.audioUrl || null,
        transcript: data.transcript || null,
      },
      series: await resolveLectureSeries(data.id, data.seriesId),
      cover: data.coverUrl !== undefined ? await mediaRefFromUrl(data.coverUrl, "image") : existingLecture?.cover ?? null,
    categories: data.categories ?? [],
      tags: data.tags || [],
    });

    refreshCache();
    return { success: true as const, lecture };
  });
}

export async function deleteLectureAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteLecture(id);
  refreshCache();
  return { success: deleted };
}

// ── Series Actions ──

export async function saveSeriesAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  description?: string;
  lectureCount?: number;
  coverUrl?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const series = await saveSeries({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      lecture_count: data.lectureCount || 0,
      cover: await mediaRefFromUrl(data.coverUrl, "image"),
    });

    refreshCache();
    return { success: true as const, series };
  });
}

export async function deleteSeriesAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteSeries(id);
  refreshCache();
  return { success: deleted };
}

// ── Article Actions ──

export async function saveArticleAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  body: string;
  readingMinutes?: number;
  categories?: string[];
  tags?: string[];
  coverUrl?: string;
  publishedAt?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const article = await saveArticle({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      body: data.body,
      reading_minutes: data.readingMinutes || 5,
      categories: data.categories ?? [],
      tags: data.tags || [],
      published_at: data.publishedAt || new Date().toISOString(),
      cover: await mediaRefFromUrl(data.coverUrl, "image"),
    });

    refreshCache();
    return { success: true as const, article };
  });
}

export async function deleteArticleAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteArticle(id);
  refreshCache();
  return { success: deleted };
}

// ── Fatwa Actions ──

export async function saveFatwaAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  question: string;
  answer: string;
  categories?: string[];
  tags?: string[];
  publishedAt?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const fatwa = await saveFatwa({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      question: data.question,
      answer: data.answer,
      categories: data.categories ?? [],
      tags: data.tags || [],
      published_at: data.publishedAt || new Date().toISOString(),
    });

    refreshCache();
    return { success: true as const, fatwa };
  });
}

export async function deleteFatwaAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteFatwa(id);
  refreshCache();
  return { success: deleted };
}

// ── Course Actions ──

export async function saveCourseAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  enrolmentOpen?: boolean;
  lessons?: { id?: string; title: string; summary?: string; durationMinutes?: number }[];
  coverUrl?: string;
  categories?: string[];
  tags?: string[];
  publishedAt?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const existing = data.id ? await getCourseByIdOrSlug(data.id) : null;
    // Lessons omitted by the caller are left untouched rather than wiped.
    const lessons = data.lessons
      ? data.lessons
          .filter((l) => l.title.trim())
          .map((l, i) => ({
            object: "lesson" as const,
            id: l.id || `lsn_${Date.now().toString(36)}_${i + 1}`,
            title: l.title.trim(),
            summary: l.summary?.trim() || null,
            duration_seconds: l.durationMinutes ? Math.round(l.durationMinutes * 60) : null,
            position: i + 1,
          }))
      : existing?.lessons ?? [];

    const course = await saveCourse({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      description: data.description || null,
      enrolment_open: data.enrolmentOpen ?? true,
      lessons,
      cover: await mediaRefFromUrl(data.coverUrl, "image"),
      categories: data.categories ?? [],
      tags: data.tags || [],
      published_at: data.publishedAt || existing?.published_at || new Date().toISOString(),
    });
    if (existing) await renameCourseSlug(existing.slug, course.slug);

    refreshCache();
    return { success: true as const, course };
  });
}

export async function deleteCourseAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteCourse(id);
  refreshCache();
  return { success: deleted };
}

// ── Library (Book) Actions ──

export async function saveBookAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  author?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  kind?: "book" | "document" | "recommended_text";
  coverUrl?: string;
  fileUrl?: string;
  externalUrl?: string;
  categories?: string[];
  tags?: string[];
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const book = await saveBook({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      description: data.description || null,
      author: data.author || null,
      publisher: data.publisher || null,
      year: data.year || null,
      isbn: data.isbn || null,
      kind: data.kind || "document",
      cover: await mediaRefFromUrl(data.coverUrl, "image"),
      file: await mediaRefFromUrl(data.fileUrl, "document"),
      external_url: data.externalUrl || null,
      categories: data.categories || ["treatise"],
      tags: data.tags || [],
    });

    refreshCache();
    return { success: true as const, book };
  });
}

export async function deleteBookAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteBook(id);
  refreshCache();
  return { success: deleted };
}

// ── Event Actions ──

export async function saveEventAction(data: {
  status?: "draft" | "published";
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  timezone?: string;
  venueName?: string;
  venueAddress?: string;
  onlineUrl?: string;
  registrationRequired?: boolean;
  capacity?: number;
  coverUrl?: string;
  categories?: string[];
  tags?: string[];
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const event = await saveEvent({
      status: data.status,
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      description: data.description || null,
      starts_at: data.startsAt,
      ends_at: data.endsAt || null,
      timezone: data.timezone || "Africa/Addis_Ababa",
      venue_name: data.venueName || null,
      venue_address: data.venueAddress || null,
      online_url: data.onlineUrl || null,
      registration_required: data.registrationRequired ?? false,
      capacity: data.capacity || null,
      cover: await mediaRefFromUrl(data.coverUrl, "image"),
      categories: data.categories || ["khutbah"],
      tags: data.tags || [],
    });

    refreshCache();
    return { success: true as const, event };
  });
}

export async function deleteEventAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteEvent(id);
  refreshCache();
  return { success: deleted };
}

// ── Media Actions ──

export async function saveMediaAction(data: {
  id?: string;
  url: string;
  kind?: "image" | "audio" | "video" | "document";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}) {
  await assertAuthenticated();
  return guarded(async () => {
    const ref = await mediaRefFromUrl(data.url, data.kind || "image", {
      id: data.id,
      title: data.title?.trim() || null,
      description: data.description?.trim() || null,
      thumbnail_url: data.thumbnailUrl?.trim() || null,
    });
    if (!ref) throw new UserError("A media URL is required.");
    const media = await saveMediaItem(ref);

    refreshCache();
    return { success: true as const, media };
  });
}

export async function deleteMediaAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteMediaItem(id);
  refreshCache();
  return { success: deleted };
}

// ── Inquiry Actions ──

export async function updateInquiryStatusAction(
  id: string,
  status: "pending" | "answered" | "archived",
  notes?: string
) {
  await assertAuthenticated();
  const updated = await updateInquiryStatus(id, status, notes);
  refreshCache();
  return { success: Boolean(updated), inquiry: updated };
}

export async function deleteInquiryAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteInquiry(id);
  refreshCache();
  return { success: deleted };
}

export async function convertInquiryToFatwaAction(data: {
  inquiryId: string;
  title: string;
  slug: string;
  answer: string;
  category?: string;
}) {
  await assertAuthenticated();

  const fatwa = await saveFatwa({
    title: data.title,
    slug: data.slug,
    summary: data.title,
    question: data.title,
    answer: data.answer,
    categories: data.category ? [data.category] : [],
    published_at: new Date().toISOString(),
  });

  await updateInquiryStatus(data.inquiryId, "answered", `Converted to public Fatwa: ${fatwa.slug}`);
  refreshCache();

  return { success: true, fatwa };
}

// ── Profile Actions ──

export async function updateProfileAction(data: {
  name: string;
  headline?: string;
  biography?: string;
  location?: string;
  photoUrl?: string;
  socials?: Record<string, string | undefined>;
  sections?: Partial<SectionMap>;
}) {
  await assertAuthenticated();

  const current = await getProfile();
  const socials = { ...current.socials };
  for (const [key, value] of Object.entries(data.socials ?? {})) socials[key] = value?.trim() ?? "";

  const profile = await updateProfile({
    name: data.name,
    headline: data.headline || null,
    biography: data.biography || null,
    location: data.location || null,
    socials,
    sections: { ...current.sections, ...data.sections },
    ...(data.photoUrl !== undefined && { photo: await mediaRefFromUrl(data.photoUrl, "image", { id: "med_portrait_custom" }) }),
  });

  refreshCache();
  return { success: true, profile };
}

export async function updateJourneyAction(milestones: JourneyMilestone[]) {
  await assertAuthenticated();
  const journey = await updateJourney(milestones);
  refreshCache();
  return { success: true, journey };
}

export async function updateQualificationsAction(qualifications: QualificationRecord[]) {
  await assertAuthenticated();
  const quals = await updateQualifications(qualifications);
  refreshCache();
  return { success: true, qualifications: quals };
}

// ── Backup Actions ──

export async function restoreDatabaseAction(jsonString: string) {
  await assertAuthenticated();
  try {
    await importDatabaseJson(jsonString);
    refreshCache();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to parse database JSON." };
  }
}

export async function resetDatabaseAction() {
  await assertAuthenticated();
  await resetDatabase();
  refreshCache();
  return { success: true };
}

// ── Certificate & Registration Admin Actions ──

export async function revokeCertificateAction(id: string, reason?: string) {
  await assertAuthenticated();
  const cert = await revokeCertificate(id, reason);
  refreshCache();
  return { success: Boolean(cert), certificate: cert };
}

export async function issueCertificateAction(data: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  score_percentage: number;
  grade_title?: string;
}) {
  await assertAuthenticated();
  const cert = await issueCertificate(data);
  refreshCache();
  return { success: true, certificate: cert };
}

export async function updateEventRegistrationStatusAction(
  id: string,
  status: "confirmed" | "cancelled" | "attended"
) {
  await assertAuthenticated();
  const updated = await updateEventRegistrationStatus(id, status);
  refreshCache();
  return { success: Boolean(updated), registration: updated };
}

export async function deleteEventRegistrationAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteEventRegistration(id);
  refreshCache();
  return { success: deleted };
}

// ── Course exam, enrollment & certificate management ──

export interface ExamInput {
  passingPercentage: number;
  questions: { id?: string; question: string; options: string[]; correctOptionIndex: number; explanation?: string }[];
}

export async function getCourseExamAction(courseSlug: string): Promise<ExamInput | null> {
  await assertAuthenticated();
  const exam = await getCourseExam(courseSlug);
  if (!exam) return null;
  return {
    passingPercentage: exam.passing_percentage,
    questions: exam.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correct_option_index,
      explanation: q.explanation,
    })),
  };
}

export async function saveCourseExamAction(courseSlug: string, input: ExamInput) {
  await assertAuthenticated();
  return guarded(async () => {    const course = await getCourseByIdOrSlug(courseSlug);
    if (!course) throw new UserError("Course not found.");

    const passing = Math.round(input.passingPercentage);
    if (!(passing >= 1 && passing <= 100)) throw new UserError("Passing percentage must be between 1 and 100.");
    if (input.questions.length === 0) throw new UserError("Add at least one question.");

    const questions = input.questions.map((q, i) => {
      const options = q.options.map((o) => o.trim()).filter(Boolean);
      if (!q.question.trim()) throw new UserError(`Question ${i + 1} has no text.`);
      if (options.length < 2) throw new UserError(`Question ${i + 1} needs at least two options.`);
      // The correct index refers to the trimmed list, so remap it if blank options were dropped.
      const correctText = q.options[q.correctOptionIndex]?.trim();
      const correct = options.indexOf(correctText ?? "");
      if (correct < 0) throw new UserError(`Question ${i + 1} needs a correct answer selected.`);
      return {
        id: q.id || `q${i + 1}`,
        question: q.question.trim(),
        options,
        correct_option_index: correct,
        ...(q.explanation?.trim() && { explanation: q.explanation.trim() }),
      };
    });

    await saveCourseExam(course.slug, { course_id: course.id, passing_percentage: passing, questions });
    refreshCache();
    return { success: true as const };
  });
}

export async function deleteCourseExamAction(courseSlug: string) {
  await assertAuthenticated();
  const deleted = await deleteCourseExam(courseSlug);
  refreshCache();
  return { success: deleted };
}

export async function updateEnrollmentStatusAction(id: string, status: "enrolled" | "in_progress" | "completed") {
  await assertAuthenticated();
  const ok = await updateEnrollmentStatus(id, status);
  refreshCache();
  return { success: ok };
}

export async function deleteEnrollmentAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteCourseEnrollment(id);
  refreshCache();
  return { success: deleted };
}

export async function deleteCertificateAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteCertificate(id);
  refreshCache();
  return { success: deleted };
}

// ── Link helper: title and picture for a pasted video link ──

export async function fetchMediaMetadata(url: string): Promise<{ success: true; title?: string; author?: string; thumbnailUrl?: string }> {
  await assertAuthenticated();
  const parsed = parseMediaUrl(url);
  const soft = { success: true as const, thumbnailUrl: parsed.thumbnailUrl };
  // Only youtube.com / tiktok.com oEmbed endpoints are ever contacted; the pasted URL is just a query value.
  const endpoint = oembedEndpoint(parsed);
  if (!endpoint) return soft;
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(4000), redirect: "error", cache: "no-store", headers: { accept: "application/json" } });
    if (!res.ok) return soft;
    const text = await res.text();
    if (text.length > 200_000) return soft;
    const json = JSON.parse(text) as { title?: unknown; author_name?: unknown; thumbnail_url?: unknown };
    const clamp = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : undefined);
    const thumb = clamp(json.thumbnail_url, 500);
    return {
      success: true,
      title: clamp(json.title, 200),
      author: clamp(json.author_name, 120),
      thumbnailUrl: thumb && /^https:\/\//.test(thumb) ? thumb : parsed.thumbnailUrl,
    };
  } catch {
    return soft;
  }
}
