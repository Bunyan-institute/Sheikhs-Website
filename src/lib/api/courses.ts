import { bunyan } from "./client";
import type { ListResponse, PublicCourse } from "./types";

export const AUTHENTIC_COURSES: PublicCourse[] = [
  {
    object: "course",
    id: "crs_kitab_tawheed",
    title: "የኪታቡ አተውሂድ የተሟላ ትምህርት (Comprehensive Study of Kitab At-Tawheed)",
    slug: "comprehensive-kitab-at-tawheed",
    summary: "32+ ክፍሎች ያሉት የተሟላ የተውሂድ ትምህርት፤ የእምነት ማዕዘናት፣ የሽርክ አደጋዎችና የተውሂድ ጥበቃ በኡስታዝ ሙሐመድ ፈረጅ።",
    description: "ኪታቡ አተውሂድ በኢስላማዊ እምነት (ዐቂዳህ) ውስጥ እጅግ መሠረታዊ የሆነ ኪታብ ነው። በዚህ ተከታታይ የትምህርት ኮርስ ኡስታዝ ሙሐመድ ፈረጅ መጽሐፉን ከነማስረጃው በዝርዝር በማብራራት ለዘመናችን ሙስሊም ህብረተሰብ በሚገባ መልኩ ያቀርቡታል። የድምጽና የጽሑፍ ማብራሪያዎችን አካቷል።",
    enrolment_open: true,
    lesson_count: 32,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_crs_1",
      kind: "image",
      url: "/images/photo_11_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["aqeedah", "tawheed", "classical-studies"],
    tags: ["ኪታቡ-አተውሂድ", "ዐቂዳህ", "ተውሂድ", "ደርስ"],
    lessons: [
      {
        object: "lesson",
        id: "les_tawheed_23",
        title: "ትምህርት 23፦ የእምነት ንጽሕና እና የሽርክ አደጋዎች (ክፍል 23)",
        summary: "በአላህ ላይ ከማጋራት መጠበቅና የተውሂድ ድንበሮች ማብራሪያ።",
        duration_seconds: 1912,
        position: 1,
      },
      {
        object: "lesson",
        id: "les_tawheed_24",
        title: "ትምህርት 24፦ የኢኽላስና የቅንነት መርሆዎች (ክፍል 24)",
        summary: "አምልኮትን ለአላህ ብቻ የማጥራትና የውሸት ተስፋዎችን የማስወገድ ድንጋጌዎች።",
        duration_seconds: 1974,
        position: 2,
      },
      {
        object: "lesson",
        id: "les_tawheed_25",
        title: "ትምህርት 25፦ አንደበትን መጠበቅና በአላህ ብቻ መማል (ክፍል 25)",
        summary: "በፍጡራን መማል ክልከላና በአንደበት የሚፈጸሙ የሽርክ አይነቶች።",
        duration_seconds: 1813,
        position: 3,
      },
      {
        object: "lesson",
        id: "les_tawheed_26",
        title: "ትምህርት 26፦ በፈተና ወቅት መጽናትና የአላህ ውሳኔ (ክፍል 26)",
        summary: "በቀደር (በአላህ ውሳኔ) ማመንና በችግር ወቅት ትዕግስትን መላበስ።",
        duration_seconds: 2503,
        position: 4,
      },
      {
        object: "lesson",
        id: "les_tawheed_32",
        title: "ትምህርት 32፦ የተውሂድ ማጠቃለያና የመጨረሻ ምዕራፎች (ክፍል 32)",
        summary: "የመጽሐፉ ማጠቃለያ፣ የተውሂድ ፍሬዎችና የጽናት መመሪያዎች።",
        duration_seconds: 2084,
        position: 5,
      },
    ],
    published_at: "2024-01-15T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "course",
    id: "crs_fiqh_worship",
    title: "ትክክለኛ የውዱዕና የሰላት አሰጋገድ ትምህርት (Fiqh of Wudu & Salah)",
    slug: "fiqh-of-wudu-and-salah",
    summary: "የውዱዕ አደራረግ ደረጃ በደረጃ፣ የሶላት ማዕዘናት፣ ዋጂባቶች፣ ሱናዎችና አፍራሾች በዝርዝር።",
    description: "ሶላት የእምነታችን ምሰሶ ናት። ነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) «እኔ ስሰግድ እንዳያችሁኝ ስገዱ» ባሉት መሠረት፣ በዚህ ኮርስ ላይ ትክክለኛ የውዱዕ አደራረግ፣ የሶላት አቋቋም፣ ሩኩዕ፣ ሱጁድና ተሻሁድ በምስልና በማብራሪያ ተካቷል።",
    enrolment_open: true,
    lesson_count: 8,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_crs_2",
      kind: "image",
      url: "/images/photo_17_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["fiqh", "salah", "worship"],
    tags: ["ሶላት", "ውዱዕ", "ጣሃራ", "ፊቅህ"],
    lessons: [
      {
        object: "lesson",
        id: "les_wudu_practical",
        title: "ክፍል 1፦ ትክክለኛ የውዱዕ አደራረግ ተግባራዊ ትምህርት",
        summary: "ከእጅ መታጠብ ጀምሮ እስከ እግር ማጠብ ያለው የውዱዕ ቅደም ተከተልና ሱናዎች።",
        duration_seconds: 2400,
        position: 1,
      },
      {
        object: "lesson",
        id: "les_salah_conditions",
        title: "ክፍል 2፦ የሶላት ቅድመ-ሁኔታዎችና ማዕዘናት (አርካን)",
        summary: "የሶላት ሸርጦች፣ ተክቢረተል ኢሕራም፣ ፋቲሃህና ሩኩዕ።",
        duration_seconds: 2700,
        position: 2,
      },
      {
        object: "lesson",
        id: "les_salah_mistakes",
        title: "ክፍል 3፦ በሶላት ውስጥ የሚፈጸሙ የተለመዱ ስህተቶችና ማረሚያቸው",
        summary: "በሱጁድ፣ በእርጋታ ማጣትና በንባብ የሚከሰቱ ግድፈቶች።",
        duration_seconds: 2500,
        position: 3,
      },
    ],
    published_at: "2023-08-10T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "course",
    id: "crs_islamic_banking",
    title: "የሸሪዓዊ የፋይናንስና የባንክ ስራ መርሆዎች — AAOIFI Standards",
    slug: "islamic-banking-aaoifi-standards",
    summary: "ከወለድ የጸዳ የባንክ አገልግሎት ህጎች፣ የሙራበሃ፣ ሙዳረባና ኢጃራህ ኮንትራቶች አሰራር።",
    description: "የAAOIFI ሰርቲፋይድ የሸሪዓ ኦዲተር በሆኑት በሼክ ሙሐመድ ፈረጅ የሚሰጥ ፕሮፌሽናል ስልጠና። የኢትዮጵያ የባንክ ስራ ከሸሪዓ ጋር የተጣጣመ እንዲሆን የሚያስችሉ ተግባራዊ መመሪያዎችንና የውል ቅጾችን ያስተምራል።",
    enrolment_open: true,
    lesson_count: 10,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_crs_3",
      kind: "image",
      url: "/images/photo_13_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["islamic-finance", "aaoifi", "banking"],
    tags: ["ኢስላሚክ-ባንክ", "AAOIFI", "ሙራበሃ", "ፋይናንስ"],
    lessons: [
      {
        object: "lesson",
        id: "les_bank_intro",
        title: "ክፍል 1፦ የእስላማዊ ፋይናንስ መሰረቶችና የሪባ ክልከላ",
        summary: "የወለድ አይነቶች፣ የሸሪዓዊ የፍትሕ ሚዛንና የካፒታል ሚና።",
        duration_seconds: 3000,
        position: 1,
      },
      {
        object: "lesson",
        id: "les_bank_murabaha",
        title: "ክፍል 2፦ የሙራበሃ ውልና የሸቀጦች ግዢ አፈጻጸም",
        summary: "የአማናህ ባንኪንግ የሙራበሃ ፋይናንሲንግ ደንቦች።",
        duration_seconds: 3200,
        position: 2,
      },
    ],
    published_at: "2023-11-01T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
];

import { getAllCourses, getCourseByIdOrSlug } from "@/lib/db/repository";

export async function getCourses(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicCourse>> {
  try {
    let list = getAllCourses();
    if (params.category && params.category.length > 0) {
      list = list.filter((c) => c.categories.some((cat) => params.category!.includes(cat)));
    }
    return {
      object: "list",
      data: list,
      has_more: false,
      next_cursor: null,
    };
  } catch {
    return {
      object: "list",
      data: AUTHENTIC_COURSES,
      has_more: false,
      next_cursor: null,
    };
  }
}

export async function getCourse(reference: string, locale?: string): Promise<PublicCourse> {
  try {
    const found = getCourseByIdOrSlug(reference);
    if (found) {
      return found;
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_COURSES.find(
    (c) => c.slug === reference || c.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Course ${reference} not found`);
}
