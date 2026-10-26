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
  type?: "education" | "position" | "contribution" | "current";
}

export interface QualificationRecord {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: "academic" | "traditional" | "certification" | "other";
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
}
