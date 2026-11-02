"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import {
  saveLectureAsync,
  deleteLectureAsync,
  saveSeriesAsync,
  deleteSeriesAsync,
  saveArticleAsync,
  deleteArticleAsync,
  saveFatwaAsync,
  deleteFatwaAsync,
  saveCourseAsync,
  deleteCourseAsync,
  saveBookAsync,
  deleteBookAsync,
  saveEventAsync,
  deleteEventAsync,
  saveMediaItemAsync,
  deleteMediaItemAsync,
  updateInquiryStatusAsync,
  deleteInquiryAsync,
  updateProfileAsync,
  updateJourneyAsync,
  updateQualificationsAsync,
  issueCertificateAsync,
  revokeCertificateAsync,
  updateEventRegistrationStatusAsync,
  deleteEventRegistrationAsync,
  importDatabaseJson,
  resetDatabase,
} from "@/lib/db/repository";
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

  const lecture = await saveLectureAsync({
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

  refreshCache();
  return { success: true, lecture };
}

export async function deleteLectureAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteLectureAsync(id);
  refreshCache();
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

  const series = await saveSeriesAsync({
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    lecture_count: data.lectureCount || 0,
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_ser_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 800,
          height: 600,
          duration_seconds: null,
        }
      : null,
  });

  refreshCache();
  return { success: true, series };
}

export async function deleteSeriesAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteSeriesAsync(id);
  refreshCache();
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

  const article = await saveArticleAsync({
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

  refreshCache();
  return { success: true, article };
}

export async function deleteArticleAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteArticleAsync(id);
  refreshCache();
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

  const fatwa = await saveFatwaAsync({
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

  refreshCache();
  return { success: true, fatwa };
}

export async function deleteFatwaAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteFatwaAsync(id);
  refreshCache();
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
  tags?: string[];
  publishedAt?: string;
}) {
  await assertAuthenticated();

  const course = await saveCourseAsync({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    description: data.description || null,
    enrolment_open: data.enrolmentOpen ?? true,
    lesson_count: data.lessonCount ?? 0,
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_cou_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 675,
          duration_seconds: null,
        }
      : null,
    categories: data.categories || ["aqeedah"],
    tags: data.tags || [],
    published_at: data.publishedAt || new Date().toISOString(),
  });

  refreshCache();
  return { success: true, course };
}

export async function deleteCourseAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteCourseAsync(id);
  refreshCache();
  return { success: deleted };
}

// ── Library (Book) Actions ──

export async function saveBookAction(data: {
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

  const book = await saveBookAsync({
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary || null,
    description: data.description || null,
    author: data.author || "Sheikh Muhammed Ferej",
    publisher: data.publisher || null,
    year: data.year || new Date().getFullYear(),
    isbn: data.isbn || null,
    kind: data.kind || "document",
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_bk_cov_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 800,
          height: 1200,
          duration_seconds: null,
        }
      : null,
    file: data.fileUrl
      ? {
          object: "media",
          id: `med_bk_file_${Date.now()}`,
          kind: "document",
          url: data.fileUrl,
          mime_type: "application/pdf",
          width: null,
          height: null,
          duration_seconds: null,
        }
      : null,
    external_url: data.externalUrl || null,
    categories: data.categories || ["treatise"],
    tags: data.tags || [],
  });

  refreshCache();
  return { success: true, book };
}

export async function deleteBookAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteBookAsync(id);
  refreshCache();
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

  const event = await saveEventAsync({
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
    cover: data.coverUrl
      ? {
          object: "media",
          id: `med_evt_${Date.now()}`,
          kind: "image",
          url: data.coverUrl,
          mime_type: "image/jpeg",
          width: 1200,
          height: 675,
          duration_seconds: null,
        }
      : null,
    categories: data.categories || ["khutbah"],
    tags: data.tags || [],
  });

  refreshCache();
  return { success: true, event };
}

export async function deleteEventAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteEventAsync(id);
  refreshCache();
  return { success: deleted };
}

// ── Media Actions ──

export async function saveMediaAction(data: {
  id?: string;
  url: string;
  kind?: "image" | "audio" | "video" | "document";
}) {
  await assertAuthenticated();

  const media = await saveMediaItemAsync({
    object: "media",
    id: data.id || `med_${Date.now()}`,
    kind: data.kind || "image",
    url: data.url,
    mime_type: data.kind === "video" ? "video/mp4" : "image/jpeg",
    width: 1200,
    height: 800,
    duration_seconds: null,
  });

  refreshCache();
  return { success: true, media };
}

export async function deleteMediaAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteMediaItemAsync(id);
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
  const updated = await updateInquiryStatusAsync(id, status, notes);
  refreshCache();
  return { success: Boolean(updated), inquiry: updated };
}

export async function deleteInquiryAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteInquiryAsync(id);
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

  const fatwa = await saveFatwaAsync({
    title: data.title,
    slug: data.slug,
    summary: `Scholarly ruling responding to community inquiry #${data.inquiryId}`,
    question: data.title,
    answer: data.answer,
    categories: [data.category || "fiqh"],
    published_at: new Date().toISOString(),
  });

  await updateInquiryStatusAsync(data.inquiryId, "answered", `Converted to public Fatwa: ${fatwa.slug}`);
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
  socials?: {
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    telegram?: string;
  };
}) {
  await assertAuthenticated();

  const profile = await updateProfileAsync({
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

  refreshCache();
  return { success: true, profile };
}

export async function updateJourneyAction(milestones: JourneyMilestone[]) {
  await assertAuthenticated();
  const journey = await updateJourneyAsync(milestones);
  refreshCache();
  return { success: true, journey };
}

export async function updateQualificationsAction(qualifications: QualificationRecord[]) {
  await assertAuthenticated();
  const quals = await updateQualificationsAsync(qualifications);
  refreshCache();
  return { success: true, qualifications: quals };
}

// ── Backup Actions ──

export async function restoreDatabaseAction(jsonString: string) {
  await assertAuthenticated();
  try {
    const db = importDatabaseJson(jsonString);
    refreshCache();
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
  const cert = await revokeCertificateAsync(id, reason);
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
  const cert = await issueCertificateAsync(data);
  refreshCache();
  return { success: true, certificate: cert };
}

export async function updateEventRegistrationStatusAction(
  id: string,
  status: "confirmed" | "cancelled" | "attended"
) {
  await assertAuthenticated();
  const updated = await updateEventRegistrationStatusAsync(id, status);
  refreshCache();
  return { success: Boolean(updated), registration: updated };
}

export async function deleteEventRegistrationAction(id: string) {
  await assertAuthenticated();
  const deleted = await deleteEventRegistrationAsync(id);
  refreshCache();
  return { success: deleted };
}
