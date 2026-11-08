import type { Metadata } from "next";
import type { PublicFatwa, PublicArticle, PublicCourse, PublicLecture, PublicBook, PublicEvent, PublicSeries } from "./api/types";
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
 * Note: 'en' is the prefix-less defaultLocale in routing.ts, so English URLs have no /en prefix.
 */
export function buildHreflangAlternates(pathname: string, currentLocale?: string): Metadata["alternates"] {
  const siteUrl = getSiteUrl();
  const cleanPath = pathname.replace(/^\/(en|ar|am|om)(?=\/|$)/, "").replace(/^\/+/, "");
  const suffix = cleanPath ? `/${cleanPath}` : "";

  const languages: Record<string, string> = {
    en: `${siteUrl}${suffix}`,
    ar: `${siteUrl}/ar${suffix}`,
    am: `${siteUrl}/am${suffix}`,
    om: `${siteUrl}/om${suffix}`,
    "x-default": `${siteUrl}${suffix}`,
  };

  const canonical =
    currentLocale === "en" || !currentLocale
      ? `${siteUrl}${suffix}`
      : `${siteUrl}/${currentLocale}${suffix}`;

  return {
    canonical,
    languages,
  };
}

/**
 * Resolves the absolute URL for any subpath in a target locale without causing 307 redirects.
 * English is prefix-less ('/'), while other locales are prefixed ('/am', '/ar', '/om').
 */
export function getLocalizedUrl(pathname: string, locale: string): string {
  const siteUrl = getSiteUrl();
  const clean = pathname.replace(/^\/(en|ar|am|om)(?=\/|$)/, "").replace(/^\/+/, "");
  const suffix = clean ? `/${clean}` : "";

  if (locale === "en") {
    return `${siteUrl}${suffix}`;
  }
  return `${siteUrl}/${locale}${suffix}`;
}

/**
 * Returns alternate hreflang dictionary for sitemap XML generation.
 */
export function buildSitemapAlternates(pathname: string) {
  const clean = pathname.replace(/^\/(en|ar|am|om)(?=\/|$)/, "").replace(/^\/+/, "");
  const suffix = clean ? `/${clean}` : "";
  const siteUrl = getSiteUrl();

  return {
    en: `${siteUrl}${suffix}`,
    ar: `${siteUrl}/ar${suffix}`,
    am: `${siteUrl}/am${suffix}`,
    om: `${siteUrl}/om${suffix}`,
    "x-default": `${siteUrl}${suffix}`,
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
  const fatwaUrl = getLocalizedUrl(`/fatwas/${fatwa.slug}`, locale);
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
  const articleUrl = getLocalizedUrl(`/articles/${article.slug}`, locale);
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
  const courseUrl = getLocalizedUrl(`/courses/${course.slug}`, locale);
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
  const lectureUrl = getLocalizedUrl(`/lectures/${lecture.slug}`, locale);
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
  const itemUrl = getLocalizedUrl(`/library/${item.slug}`, locale);
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
  const eventUrl = getLocalizedUrl(`/events/${event.slug}`, locale);
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

export interface SitelinkDefinition {
  subpath: string;
  name: Record<string, string>;
  description: Record<string, string>;
}

export const PRIMARY_SITELINKS: SitelinkDefinition[] = [
  {
    subpath: "/fatwas",
    name: {
      en: "Fatwas & Sharia Rulings",
      am: "ፈትዋዎች (የሸሪዓ ብይኖች)",
      ar: "الفتاوى الشرعية",
      om: "Fatwaawwan fi Murtii",
    },
    description: {
      en: "Authenticated answers to Islamic jurisprudence and Sharia questions according to Quran and Sunnah.",
      am: "በቁርኣንና ሐዲስ መረጃዎች ላይ የተመሠረቱ ይፋዊ የኢስላማዊ ፊቅህ ፈትዋዎች እና ብይኖች።",
      ar: "فتاوى شرعية معتمدة ومؤصلة بالأدلة من الكتاب والسنة في مختلف أبواب الفقه الإسلامي.",
      om: "Fatwaawwan fi deebiiwwan shari'aa ragaalee Qur'aana fi Hadiisa irratti hundaa'an.",
    },
  },
  {
    subpath: "/articles",
    name: {
      en: "Scholarly Articles & Treatises",
      am: "ጽሑፎችና ምርምሮች",
      ar: "المقالات والبحوث",
      om: "Barreeffamoota fi Qorannoowwan",
    },
    description: {
      en: "Academic Islamic papers, Friday reminders, and research articles by Sheikh Muhammed Ferej.",
      am: "የሸይኽ ሙሐመድ ፈረጅ ጥናታዊ ጽሑፎች፣ የጁሙዓ ማስታወሻዎች እና ተከታታይ የዕውቀት ትምህርቶች።",
      ar: "مقالات علمية وبحوث منهجية وتوجيهات دعوية من كتابات فضيلة الشيخ محمد فرج مجنو.",
      om: "Barreeffamoota barnootaa fi qorannoowwan Islaamaa Sheekh Muhammad Farajtiin qophaa'an.",
    },
  },
  {
    subpath: "/series",
    name: {
      en: "Audio & Video Lesson Series",
      am: "የትምህርት ስብስቦች",
      ar: "السلاسل العلمية والمنهجية",
      om: "Walitti-qabiinsa Barnootaa",
    },
    description: {
      en: "Complete multi-part lecture series covering Tafsir, Hadith compilations, and classical Fiqh books.",
      am: "የተፍሲር፣ የሐዲስ ኪታቦችና የፊቅህ ትምህርቶች የተሟሉ ተከታታይ የድምፅና ቪዲዮ ስብስቦች።",
      ar: "سلاسل صوتية ومرئية مكتملة في تفسير كتاب الله وشروح كتب أمهات الحديث والفقه.",
      om: "Darsiiwwan sagalee fi viidiyoo walitti-fufaa Tafsiira, Hadiisaa fi Fiqhii.",
    },
  },
  {
    subpath: "/courses",
    name: {
      en: "Islamic Courses & Syllabi",
      am: "የሸሪዓ ኮርሶች",
      ar: "الدورات التأصيلية",
      om: "Koorsiiwwan Barnootaa",
    },
    description: {
      en: "Structured Islamic knowledge curriculum, AAOIFI Sharia standards, and online learning modules.",
      am: "የተዋቀሩ የሸሪዓ ሥርዓተ-ትምህርቶች፣ የአይኦፊ ደረጃዎች እና ተከታታይ የዲጂታል ኮርሶች።",
      ar: "مناهج تعليمية مؤصلة تشمل المعايير الشرعية ودورات الفقه والحديث المصممة لطلاب العلم.",
      om: "Koorsoota barnoota amantii Islaamaa tartiibaan qophaa'anii fi leenjiilee shari'aa.",
    },
  },
  {
    subpath: "/ask",
    name: {
      en: "Ask the Sheikh",
      am: "ፈትዋ ይጠይቁ",
      ar: "استفتاء الشيخ",
      om: "Sheikh Gaafadhaa",
    },
    description: {
      en: "Directly submit your personal Islamic jurisprudence inquiries, Sharia doubts, or financial advice questions.",
      am: "የግል የሃይማኖት ጥያቄዎን፣ የሸሪዓ ማብራሪያ ወይም የፋይናንስ ምክር በቀጥታ ለሸይኹ ቢሮ ያቅርቡ።",
      ar: "إرسال الأسئلة والاستفتاءات الشرعية والاستشارات الفقهية مباشرة إلى فضيلة الشيخ.",
      om: "Gaaffilee amantii, fatwaa fi gorsa dhimmoota jireenyaa kallattiin dhiyeessaa.",
    },
  },
];

/**
 * Generates Schema.org ItemList with SiteNavigationElement for Google Sitelinks.
 */
export function buildSitelinksNavigationSchema(locale: string = "en") {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#sitelinks`,
    name: "Primary Sitelinks Navigation",
    description: "Primary navigational pillars of Sheikh Muhammed Ferej Megeno's official platform",
    itemListElement: PRIMARY_SITELINKS.map((item, index) => {
      const name = item.name[locale] || item.name.en;
      const description = item.description[locale] || item.description.en;
      const url = getLocalizedUrl(item.subpath, locale);

      return {
        "@type": "SiteNavigationElement",
        position: index + 1,
        name,
        description,
        url,
      };
    }),
  };
}

/**
 * Generates WebSite Schema with SearchAction and Sitelinks hasPart.
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
    hasPart: PRIMARY_SITELINKS.map((item) => ({
      "@type": "WebPage",
      "@id": `${getLocalizedUrl(item.subpath, locale)}#webpage`,
      name: item.name[locale] || item.name.en,
      description: item.description[locale] || item.description.en,
      url: getLocalizedUrl(item.subpath, locale),
    })),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getLocalizedUrl("/search", locale)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates Schema.org CreativeWorkSeries for audio/video lesson series.
 */
export function buildSeriesSchema(series: PublicSeries, locale: string) {
  const siteUrl = getSiteUrl();
  const seriesUrl = getLocalizedUrl(`/series/${series.slug}`, locale);
  const scholar = getScholarEntity();

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    "@id": `${seriesUrl}#series`,
    name: series.title,
    description: series.description || series.title,
    url: seriesUrl,
    inLanguage: locale,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
    },
    image: series.cover?.url ? `${siteUrl}${series.cover.url}` : `${siteUrl}/images/sheikh-portrait.jpg`,
    numberOfItems: series.lecture_count || series.lectures?.length || 0,
    ...(series.lectures && series.lectures.length > 0
      ? {
          hasPart: series.lectures.map((lec, index) => ({
            "@type": lec.media?.video ? "VideoObject" : "AudioObject",
            position: lec.series?.position || index + 1,
            name: lec.title,
            description: lec.summary || lec.title,
            url: getLocalizedUrl(`/lectures/${lec.slug}`, locale),
          })),
        }
      : {}),
  };
}

/**
 * Generates Schema.org CollectionPage with ItemList.
 */
export function buildCollectionSchema(params: {
  name: string;
  description?: string;
  url: string;
  inLanguage: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${params.url}#collection`,
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: params.inLanguage,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: params.items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: item.url,
        description: item.description,
      })),
    },
  };
}

/**
 * Generates Schema.org ContactPage linking to Bunyan Institute and the Sheikh.
 */
export function buildContactSchema(locale: string = "en") {
  const siteUrl = getSiteUrl();
  const contactUrl = getLocalizedUrl("/contact", locale);
  const scholar = getScholarEntity();
  const org = getOrganizationEntity();

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${contactUrl}#contactpage`,
    url: contactUrl,
    name: "Contact Sheikh Muhammed Ferej Megeno | Bunyan Institute",
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: org.name,
      url: siteUrl,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Scholarly Inquiry & Fatwa Submissions",
          availableLanguage: ["Amharic", "Arabic", "Afaan Oromo", "English"],
          url: getLocalizedUrl("/ask", locale),
        },
      ],
    },
    about: {
      "@type": "Person",
      "@id": `${siteUrl}/#scholar`,
      name: scholar.name,
    },
  };
}

/**
 * Generates comprehensive localized metadata for the homepage across 4 languages.
 */
export function getHomepageMetadata(locale: string): Metadata {
  const siteUrl = getSiteUrl();
  const pageUrl = getLocalizedUrl("", locale);
  const imageUrl = `${siteUrl}/images/sheikh-portrait.jpg`;

  const copyByLocale: Record<string, { title: string; description: string; ogLocale: string; keywords: string[] }> = {
    am: {
      title: "ሸይኽ ሙሐመድ ፈረጅ መገኖ | ይፋዊ የኢስላማዊ ዕውቀትና ፈትዋ መድረክ",
      description:
        "የሸይኽ ሙሐመድ ፈረጅ መገኖ ይፋዊ ድረ-ገጽ፡ በኢስላማዊ ፊቅህ፣ የተፍሲርና ሐዲስ ትምህርቶች፣ የሸሪዓ ብይኖች (ፈትዋዎች)፣ ኮርሶች እና ዲጂታል መጽሐፍት የተደራጀ የዕውቀት ማዕከል።",
      ogLocale: "am_ET",
      keywords: [
        "ሸይኽ ሙሐመድ ፈረጅ",
        "ፈትዋ",
        "የሸሪዓ ብይን",
        "ኢስላማዊ ትምህርት",
        "ፊቅህ",
        "ተፍሲር",
        "ሐዲስ",
        "ቡንያን ተቋም",
        "ኢትዮጵያ ኢስላም",
        "ኡስታዝ ሙሐመድ ፈረጅ",
      ],
    },
    ar: {
      title: "الشيخ محمد فرج مجنو | المنصة العلمية والفتاوى الشرعية الرسمية",
      description:
        "الموقع الرسمي لفضيلة الشيخ محمد فرج مجنو حفظه الله، المستشار الشرعي المعتمد من هيئة أيوفي (AAOIFI). خزانة علمية تضم الفتاوى الشرعية المؤصلة، دروس التفسير، وشروح كتب الحديث والفقه.",
      ogLocale: "ar_SA",
      keywords: [
        "الشيخ محمد فرج مجنو",
        "محمد فرج",
        "فتاوى شرعية",
        "فقه إسلامي",
        "تفسير القرآن",
        "معهد بنيان",
        "علماء إثيوبيا",
        "معايير أيوفي",
        "دروس إسلامية",
      ],
    },
    om: {
      title: "Sheekh Muhammad Faraj Maganoo | Maddeen Barnoota Islaamaa fi Fatwaa",
      description:
        "Wabii seera qabeessaa Sheekh Muhammad Faraj Maganoo: Fatwaawwan Fiqhii, barumsa Qur'aanaa fi Hadiisaa, koorsiiwwan fi kitaabbilee amantii Islaamaa.",
      ogLocale: "om_ET",
      keywords: [
        "Sheekh Muhammad Faraj",
        "Fatwaa",
        "Barnoota Islaamaa",
        "Fiqhii",
        "Tafsiira",
        "Qur'aana",
        "Oromoo",
        "Bunyaan",
      ],
    },
    en: {
      title: "Sheikh Muhammed Ferej Megeno | Official Islamic Scholar Platform",
      description:
        "Official website of Sheikh Muhammed Ferej Megeno: certified AAOIFI Sharia consultant, traditional Islamic scholar, and educator. Explore authenticated fatwas, Quranic exegesis (Tafsir), structured fiqh courses, and audio-video archives.",
      ogLocale: "en_US",
      keywords: [
        "Sheikh Muhammed Ferej Megeno",
        "Sheikh Muhammed Ferej",
        "Ustaz Muhammad Ferej",
        "Islamic Fatwa Archive",
        "AAOIFI Sharia Advisor Ethiopia",
        "Islamic Studies Addis Ababa",
        "Tafsir lectures",
        "Fiqh rulings",
        "Bunyan Institute",
      ],
    },
  };

  const copy = copyByLocale[locale] || copyByLocale.en;

  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    alternates: buildHreflangAlternates("", locale),
    openGraph: {
      type: "website",
      locale: copy.ogLocale,
      url: pageUrl,
      title: copy.title,
      description: copy.description,
      siteName: "Sheikh Muhammed Ferej Megeno Official",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Sheikh Muhammed Ferej Megeno",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [imageUrl],
    },
  };
}
