"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import {
  saveLecture,
  deleteLecture,
  saveSeries,
  deleteSeries,
  saveArticle,
  deleteArticle,
  saveFatwa,
  deleteFatwa,
  saveCourse,
  deleteCourse,
  saveBook,
  deleteBook,
  saveEvent,
  deleteEvent,
  saveMediaItem,
  deleteMediaItem,
  updateInquiryStatus,
  deleteInquiry,
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
import type { PublicLecture, PublicArticle, PublicFatwa, PublicCourse, PublicBook, PublicEvent } from "@/lib/api/types";
import type { JourneyMilestone, QualificationRecord } from "@/lib/db/types";

async function assertAuthenticated() {
  const session = await getSessionUser();
  if (!session) {
    throw new Error("Unauthorized access. Admin session required.");
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

export async function saveLectureAction(data: {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  videoUrl?: string;
  audioUrl?: string;
  durationSeconds?: number;
  transcript?: string;
  seriesId?: string;
  seriesTitle?: string;
  categories?: string[];
  tags?: string[];
  publishedAt?: string;
}) {
  await assertAuthenticated();

  const lecture = saveLecture({
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
    series: data.seriesId
      ? {
          id: data.seriesId,
          title: data.seriesTitle || "Riyad us-Saliheen",
          position: 1,
        }
      : null,
    categories: data.categories && data.categories.length > 0 ? data.categories : ["Lectures"],
    tags: data.tags || [],
  });

  return { success: true, lecture };
}

export async function deleteLectureAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteLecture(id);
  return { success: deleted };
}

// ── Series Actions ──

export async function saveSeriesAction(data: {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  lectureCount?: number;
  coverUrl?: string;
}) {
  await assertAuthenticated();

  const series = saveSeries({
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    lecture_count: data.lectureCount || 0,
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_${data.slug}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 800,
          duration_seconds: null,
        }
      : null,
  });

  return { success: true, series };
}

export async function deleteSeriesAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteSeries(id);
  return { success: deleted };
}

// ── Article Actions ──

export async function saveArticleAction(data: {
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

  const article = saveArticle({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    body: data.body,
    reading_minutes: data.readingMinutes || 5,
    categories: data.categories || ["hadith"],
    tags: data.tags || [],
    published_at: data.publishedAt || new Date().toISOString(),
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_art_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 800,
          duration_seconds: null,
        }
      : null,
  });

  return { success: true, article };
}

export async function deleteArticleAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteArticle(id);
  return { success: deleted };
}

// ── Fatwa Actions ──

export async function saveFatwaAction(data: {
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

  const fatwa = saveFatwa({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    question: data.question,
    answer: data.answer,
    categories: data.categories || ["fiqh"],
    tags: data.tags || [],
    published_at: data.publishedAt || new Date().toISOString(),
  });

  return { success: true, fatwa };
}

export async function deleteFatwaAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteFatwa(id);
  return { success: deleted };
}

// ── Course Actions ──

export async function saveCourseAction(data: {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  enrolmentOpen?: boolean;
  lessonCount?: number;
  coverUrl?: string;
  categories?: string[];
}) {
  await assertAuthenticated();

  const course = saveCourse({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    description: data.description || null,
    enrolment_open: Boolean(data.enrolmentOpen),
    lesson_count: data.lessonCount || 0,
    categories: data.categories || ["islamic-studies"],
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_crs_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 800,
          duration_seconds: null,
        }
      : null,
  });

  return { success: true, course };
}

export async function deleteCourseAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteCourse(id);
  return { success: deleted };
}

// ── Book / Library Actions ──

export async function saveBookAction(data: {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  author?: string;
  publisher?: string;
  year?: number;
  kind?: "book" | "document" | "recommended_text";
  fileUrl?: string;
  externalUrl?: string;
  coverUrl?: string;
  categories?: string[];
}) {
  await assertAuthenticated();

  const book = saveBook({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    description: data.description || null,
    author: data.author || "Sheikh Muhammed Ferej",
    publisher: data.publisher || null,
    year: data.year || new Date().getFullYear(),
    kind: data.kind || "document",
    external_url: data.externalUrl || null,
    categories: data.categories || ["treatise"],
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_cov_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1000,
          height: 1400,
          duration_seconds: null,
        }
      : null,
    file: data.fileUrl
      ? {
          object: "media",
          id: `med_file_${Date.now()}`,
          kind: "document",
          url: data.fileUrl,
          mime_type: "application/pdf",
          width: null,
          height: null,
          duration_seconds: null,
        }
      : null,
  });

  return { success: true, book };
}

export async function deleteBookAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteBook(id);
  return { success: deleted };
}

// ── Event Actions ──

export async function saveEventAction(data: {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  venueName?: string;
  venueAddress?: string;
  onlineUrl?: string;
  registrationRequired?: boolean;
  coverUrl?: string;
  categories?: string[];
}) {
  await assertAuthenticated();

  const event = saveEvent({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    description: data.description || null,
    starts_at: data.startsAt,
    ends_at: data.endsAt || null,
    venue_name: data.venueName || null,
    venue_address: data.venueAddress || null,
    online_url: data.onlineUrl || null,
    registration_required: Boolean(data.registrationRequired),
    categories: data.categories || ["khutbah"],
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_evt_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 800,
          duration_seconds: null,
        }
      : null,
  });

  return { success: true, event };
}

export async function deleteEventAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteEvent(id);
  return { success: deleted };
}

// ── Media Actions ──

export async function saveMediaAction(data: {
  id?: string;
  url: string;
  kind?: "image" | "audio" | "video" | "document";
}) {
  await assertAuthenticated();

  const media = saveMediaItem({
    object: "media",
    id: data.id || `med_${Date.now()}`,
    kind: data.kind || "image",
    url: data.url,
    mime_type: data.kind === "video" ? "video/mp4" : "image/jpeg",
    width: 1200,
    height: 800,
    duration_seconds: null,
  });

  return { success: true, media };
}

export async function deleteMediaAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteMediaItem(id);
  return { success: deleted };
}

// ── Inquiry Actions ──

export async function updateInquiryStatusAction(
  id: string,
  status: "pending" | "answered" | "archived",
  notes?: string
) {
  await assertAuthenticated();
  const updated = updateInquiryStatus(id, status, notes);
  return { success: Boolean(updated), inquiry: updated };
}

export async function deleteInquiryAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteInquiry(id);
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

  const fatwa = saveFatwa({
    title: data.title,
    slug: data.slug,
    summary: `Scholarly ruling responding to community inquiry #${data.inquiryId}`,
    question: data.title,
    answer: data.answer,
    categories: [data.category || "fiqh"],
    published_at: new Date().toISOString(),
  });

  updateInquiryStatus(data.inquiryId, "answered", `Converted to public Fatwa: ${fatwa.slug}`);

  return { success: true, fatwa };
}

// ── Profile Actions ──

export async function updateProfileAction(data: {
  name: string;
  headline?: string;
  biography?: string;
  location?: string;
  photoUrl?: string;
  socials?: {
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    telegram?: string;
  };
}) {
  await assertAuthenticated();

  const profile = updateProfile({
    name: data.name,
    headline: data.headline || null,
    biography: data.biography || null,
    location: data.location || null,
    socials: {
      tiktok: data.socials?.tiktok || "",
      youtube: data.socials?.youtube || "",
      facebook: data.socials?.facebook || "",
      telegram: data.socials?.telegram || "",
    },
    photo: data.photoUrl
      ? {
          object: "media",
          id: "med_portrait_custom",
          kind: "image",
          url: data.photoUrl,
          mime_type: "image/jpeg",
          width: 1280,
          height: 1280,
          duration_seconds: null,
        }
      : undefined,
  });

  return { success: true, profile };
}

export async function updateJourneyAction(milestones: JourneyMilestone[]) {
  await assertAuthenticated();
  const journey = updateJourney(milestones);
  return { success: true, journey };
}

export async function updateQualificationsAction(qualifications: QualificationRecord[]) {
  await assertAuthenticated();
  const quals = updateQualifications(qualifications);
  return { success: true, qualifications: quals };
}

// ── Backup Actions ──

export async function restoreDatabaseAction(jsonString: string) {
  await assertAuthenticated();
  try {
    const db = importDatabaseJson(jsonString);
    return { success: true, version: db.version };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to parse database JSON." };
  }
}

export async function resetDatabaseAction() {
  await assertAuthenticated();
  const db = resetDatabase();
  refreshCache();
  return { success: true, version: db.version };
}

// ── Certificate & Registration Admin Actions ──

export async function revokeCertificateAction(id: string, reason?: string) {
  await assertAuthenticated();
  const cert = revokeCertificate(id, reason);
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
  const cert = issueCertificate(data);
  refreshCache();
  return { success: true, certificate: cert };
}

export async function updateEventRegistrationStatusAction(
  id: string,
  status: "confirmed" | "cancelled" | "attended"
) {
  await assertAuthenticated();
  const updated = updateEventRegistrationStatus(id, status);
  refreshCache();
  return { success: Boolean(updated), registration: updated };
}

export async function deleteEventRegistrationAction(id: string) {
  await assertAuthenticated();
  const deleted = deleteEventRegistration(id);
  refreshCache();
  return { success: deleted };
}
