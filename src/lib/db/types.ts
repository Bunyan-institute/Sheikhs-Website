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

export interface JourneyMilestone {
  year: string;
  title: string;
  institution?: string;
  description: string;
  type?: "education" | "position" | "contribution" | "qualification" | "teaching" | "current";
}

export interface QualificationRecord {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: "academic" | "traditional" | "certification" | "certificate" | "ijazah" | "other";
  description: string;
}

export interface InquiryRecord {
  id: string;
  question: string;
  name?: string;
  email?: string;
  is_anonymous: boolean;
  locale: string;
  created_at: string;
  status: "pending" | "answered" | "archived";
  notes?: string;
  answer?: string;
}

export interface EventRegistrationRecord {
  id: string; // e.g. "evtr_1793000..."
  event_id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  attendees_count: number;
  created_at: string;
  status: "confirmed" | "cancelled" | "attended";
  notes?: string;
}

export interface CourseEnrollmentRecord {
  id: string; // e.g. "enr_..."
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  city?: string;
  created_at: string;
  completed_lessons: string[];
  exam_attempts: {
    attempt_date: string;
    score: number;
    passed: boolean;
  }[];
  certificate_id?: string | null;
  status: "enrolled" | "in_progress" | "completed";
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
}

export interface CourseExamConfig {
  course_id: string;
  passing_percentage: number;
  questions: ExamQuestion[];
}

export interface IssuedCertificateRecord {
  id: string; // Unique serial, e.g. "MFM-2026-TWH-8842"
  verification_token: string; // Cryptographic HMAC digest
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  issued_at: string;
  hijri_date?: string;
  score_percentage: number;
  grade_title: string; // e.g. "Mumtaz (Distinction)", "Jayyid Jiddan (Very Good)"
  instructor_name: string; // "Sheikh Muhammed Ferej Megeno"
  authority_seal: string; // "Al-Fajr Islamic Foundation & AAOIFI Sharia Council"
  revoked: boolean;
  revoked_reason?: string | null;
}

export interface PortalDatabase {
  version: number;
  updated_at: string;
  profile: PublicProfile;
  journey: JourneyMilestone[];
  qualifications: QualificationRecord[];
  lectures: PublicLecture[];
  series: PublicSeries[];
  articles: PublicArticle[];
  fatwas: PublicFatwa[];
  courses: PublicCourse[];
  books: PublicBook[];
  events: PublicEvent[];
  media: MediaRef[];
  inquiries: InquiryRecord[];
  event_registrations: EventRegistrationRecord[];
  course_enrollments: CourseEnrollmentRecord[];
  course_exams: Record<string, CourseExamConfig>;
  certificates: IssuedCertificateRecord[];
}
