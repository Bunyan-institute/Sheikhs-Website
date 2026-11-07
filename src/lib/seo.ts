import type { Metadata } from "next";
import type { PublicFatwa, PublicArticle, PublicCourse, PublicLecture, PublicBook, PublicEvent } from "./api/types";
import { locales, type Locale } from "../i18n/config.ts";

export const PRIMARY_DOMAIN = "https://www.sheikhmuhammedferej.info";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  return PRIMARY_DOMAIN;
}

export interface ScholarEntity {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  alternateName: string[];
  jobTitle: string;
  honorificPrefix?: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  worksFor: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  knowsLanguage: string[];
  knowsAbout: string[];
  hasCredential: Array<{
    "@type": "EducationalOccupationalCredential";
    credentialCategory: "degree" | "diploma" | "certificate";
    name: string;
    recognizedBy: {
      "@type": "Organization";
      name: string;
    };
  }>;
}

/**
 * Authoritative Schema.org Person entity representing Sheikh Muhammed Ferej Megeno.
 */
export function getScholarEntity(): ScholarEntity {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#scholar`,
    name: "Sheikh Muhammed Ferej Megeno",
    alternateName: [
      "ሸይኽ ሙሐመድ ፈረጅ መገኖ",
      "الشيخ محمد فرج مجنو",
      "Ustaz Muhammad Ferej",
      "Ustaz Muhammed Ferej",
      "Sheikh Muhammad Ferej",
    ],
    honorificPrefix: "Sheikh",
    jobTitle: "Islamic Scholar, Educator & AAOIFI-Certified Sharia Consultant",
    description:
      "Prominent Ethiopian Islamic scholar, educator, and certified AAOIFI Sharia consultant with over 35 years devoted to traditional Islamic knowledge circles (Halaqat), curriculum design, and public education across Ethiopia and the Horn of Africa.",
    url: siteUrl,
    image: `${siteUrl}/images/sheikh-portrait.jpg`,
    sameAs: [
      "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
      "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/",
      "https://t.me/ustazmuhammadferej",
      "https://www.tiktok.com/@ustazmuhammadferej0",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Bunyan Institute for Islamic Studies & Research",
      url: siteUrl,
    },
    knowsLanguage: ["am", "ar", "om", "en"],
    knowsAbout: [
      "Islamic Jurisprudence (Fiqh)",
      "Fatwa Issuance & Sharia Rulings",
      "AAOIFI Sharia Standards",
      "Islamic Banking & Halal Finance",
      "Quranic Exegesis (Tafsir)",
      "Hadith Sciences & Sanad",
      "Islamic Creed & Aqeedah",
      "Islamic Family Law (Ahwal Shakhsiyyah)",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Master's in Islamic Studies (Distinction)",
        recognizedBy: {
          "@type": "Organization",
          name: "Islamic University of Minnesota",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Bachelor's in Sharia and Law (Excellent Grade)",
        recognizedBy: {
          "@type": "Organization",
          name: "Islamic University of Minnesota",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "diploma",
        name: "Diploma in Sharia Standards (AAOIFI)",
        recognizedBy: {
          "@type": "Organization",
          name: "Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI)",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certificate",
        name: "Traditional Knowledge Transmission (Sanad & Halaqat)",
        recognizedBy: {
          "@type": "Organization",
          name: "Senior Traditional Scholars of Silti & Jimma",
        },
      },
    ],
  };
}

export function getOrganizationEntity() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Bunyan Institute for Islamic Studies & Research",
    alternateName: ["የቡንያን የኢስላማዊ ጥናትና ምርምር ተቋም", "معهد بنيان للدراسات الإسلامية"],
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512.png`,
    founder: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: "Sheikh Muhammed Ferej Megeno",
    },
  };
}

/**
 * Generates canonical link and bidirectional hreflang alternate links for en, ar, am, om, and x-default.
 */
export function buildHreflangAlternates(pathname: string, currentLocale?: string): Metadata["alternates"] {
  const siteUrl = getSiteUrl();
  const cleanPath = pathname.replace(/^\/(en|ar|am|om)/, "").replace(/^\/+/, "");
  const suffix = cleanPath ? `/${cleanPath}` : "";

  const languages: Record<string, string> = {
    en: `${siteUrl}/en${suffix}`,
    ar: `${siteUrl}/ar${suffix}`,
    am: `${siteUrl}/am${suffix}`,
    om: `${siteUrl}/om${suffix}`,
    "x-default": `${siteUrl}${suffix ? `/${cleanPath}` : ""}`,
  };

  const canonical = currentLocale
    ? `${siteUrl}/${currentLocale}${suffix}`
    : `${siteUrl}${suffix ? `/${cleanPath}` : ""}`;

  return {
    canonical,
    languages,
  };
}

/**
 * Builds rich multilingual keywords for fatwas across Amharic, Arabic, Afaan Oromoo, and English.
 */
export function buildFatwaKeywords(fatwa: PublicFatwa, _locale: string): string[] {
  const baseCategories = fatwa.categories || [];
  const baseTags = fatwa.tags || [];

  const commonKeywords = [
    "Sheikh Muhammed Ferej",
    "ሸይኽ ሙሐመድ ፈረጅ",
    "الشيخ محمد فرج",
    "Ustaz Muhammad Ferej",
    "fatwa",
    "ፈትዋ",
    "فتوى",
    "murtii islaamaa",
    "Islamic ruling",
    "የሸሪዓ ብይን",
    "حكم شرعي",
    "fiqh",
    "ፊቅህ",
    "فقه",
    "Sharia question",
    "Islamic answer",
    "Halal",
    "ሀላል",
    "حلال",
  ];

  return Array.from(new Set([...commonKeywords, ...baseCategories, ...baseTags, fatwa.title]));
}

/**
 * Generates Schema.org QAPage structured data attributing the fatwa ruling directly to Sheikh Muhammed Ferej.
 */
export function buildFatwaSchema(fatwa: PublicFatwa, locale: string) {
  const siteUrl = getSiteUrl();
  const fatwaUrl = `${siteUrl}/${locale}/fatwas/${fatwa.slug}`;
  const scholar = getScholarEntity();

  const stripHtml = (text: string) => text.replace(/<[^>]*>?/gm, "").trim();
  const cleanQuestion = fatwa.question ? stripHtml(fatwa.question) : fatwa.title;
  const cleanAnswer = fatwa.answer ? stripHtml(fatwa.answer) : (fatwa.summary || "");

  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${fatwaUrl}#qapage`,
    url: fatwaUrl,
    name: fatwa.title,
    inLanguage: locale,
    mainEntity: {
      "@type": "Question",
      "@id": `${fatwaUrl}#question`,
      name: fatwa.title,
      text: cleanQuestion,
      dateCreated: fatwa.published_at || undefined,
      author: {
        "@type": "Person",
        name: "Seeker / Questioner",
      },
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${fatwaUrl}#answer`,
        text: cleanAnswer,
        datePublished: fatwa.published_at || undefined,
        url: `${fatwaUrl}#answer`,
        inLanguage: locale,
        upvoteCount: 1,
        author: {
          "@type": "Person",
          "@id": `${siteUrl}/#scholar`,
          name: scholar.name,
          alternateName: scholar.alternateName,
          jobTitle: scholar.jobTitle,
          url: siteUrl,
          image: scholar.image,
        },
      },
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList.
 */
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates Schema.org ScholarlyArticle or Article.
 */
export function buildArticleSchema(article: PublicArticle, locale: string) {
  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/${locale}/articles/${article.slug}`;
  const scholar = getScholarEntity();

  const stripHtml = (text: string) => text.replace(/<[^>]*>?/gm, "").trim();
  const bodyText = article.body ? stripHtml(article.body) : (article.summary || "");

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.summary || article.title,
    articleBody: bodyText.slice(0, 5000),
    inLanguage: locale,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || undefined,
    url: articleUrl,
    image: article.cover?.url ? `${siteUrl}${article.cover.url}` : `${siteUrl}/images/sheikh-portrait.jpg`,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Bunyan Institute for Islamic Studies & Research",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icons/icon-512.png`,
      },
    },
    keywords: [...(article.categories || []), ...(article.tags || [])].join(", "),
  };
}

/**
 * Generates Schema.org Course.
 */
export function buildCourseSchema(course: PublicCourse, locale: string) {
  const siteUrl = getSiteUrl();
  const courseUrl = `${siteUrl}/${locale}/courses/${course.slug}`;
  const scholar = getScholarEntity();

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: course.title,
    description: course.description || course.title,
    url: courseUrl,
    inLanguage: locale,
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Bunyan Institute for Islamic Studies & Research",
      sameAs: siteUrl,
    },
    instructor: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
      jobTitle: scholar.jobTitle,
    },
    educationalLevel: "Comprehensive Islamic Education",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      inLanguage: locale,
    },
  };
}

/**
 * Generates Schema.org VideoObject / AudioObject.
 */
export function buildLectureSchema(lecture: PublicLecture, locale: string) {
  const siteUrl = getSiteUrl();
  const lectureUrl = `${siteUrl}/${locale}/lectures/${lecture.slug}`;
  const scholar = getScholarEntity();
  const isVideo = Boolean(lecture.media?.video);

  return {
    "@context": "https://schema.org",
    "@type": isVideo ? "VideoObject" : "AudioObject",
    "@id": `${lectureUrl}#media`,
    name: lecture.title,
    description: lecture.summary || lecture.title,
    url: lectureUrl,
    inLanguage: locale,
    uploadDate: lecture.published_at || undefined,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
    },
    thumbnailUrl: lecture.cover?.url ? `${siteUrl}${lecture.cover.url}` : `${siteUrl}/images/sheikh-portrait.jpg`,
    contentUrl: lecture.media?.audio || lecture.media?.video || undefined,
  };
}

/**
 * Generates Schema.org Book or DigitalDocument.
 */
export function buildLibrarySchema(item: PublicBook, locale: string) {
  const siteUrl = getSiteUrl();
  const itemUrl = `${siteUrl}/${locale}/library/${item.slug}`;
  const scholar = getScholarEntity();

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${itemUrl}#book`,
    name: item.title,
    description: item.summary || item.description || item.title,
    url: itemUrl,
    inLanguage: locale,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: item.author || scholar.name,
    },
    image: item.cover?.url ? `${siteUrl}${item.cover.url}` : undefined,
    publisher: {
      "@type": "Organization",
      name: item.publisher || "Bunyan Institute",
    },
  };
}

/**
 * Generates Schema.org Event.
 */
export function buildEventSchema(event: PublicEvent, locale: string) {
  const siteUrl = getSiteUrl();
  const eventUrl = `${siteUrl}/${locale}/events/${event.slug}`;
  const scholar = getScholarEntity();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl}#event`,
    name: event.title,
    description: event.summary || event.description || event.title,
    startDate: event.starts_at,
    endDate: event.ends_at || event.starts_at,
    url: eventUrl,
    inLanguage: locale,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.online_url
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue_name || "Addis Ababa, Ethiopia",
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue_address || undefined,
        addressLocality: "Addis Ababa",
        addressCountry: "ET",
      },
    },
    performer: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
      jobTitle: scholar.jobTitle,
    },
    organizer: {
      "@type": "Organization",
      name: "Bunyan Institute",
      url: siteUrl,
    },
  };
}

/**
 * Generates WebSite Schema with SearchAction.
 */
export function buildWebsiteSchema(locale: string = "en") {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Sheikh Muhammed Ferej Megeno | Official Platform",
    alternateName: [
      "ሸይኽ ሙሐመድ ፈረጅ መገኖ",
      "الشيخ محمد فرج مجنو",
      "Sheikh Muhammed Ferej Official Archive",
    ],
    description:
      "Official Islamic knowledge platform, fatwa archive, courses, and educational lectures of Sheikh Muhammed Ferej Megeno.",
    inLanguage: locale,
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
