import { bunyan } from "./client";
import type { ListResponse, PublicCourse } from "./types";

export const AUTHENTIC_COURSES: PublicCourse[] = [
  {
    object: "course",
    id: "crs_riyadus_saliheen",
    title: "የሪያዱ ሷሊሂን የተሟላ ትምህርት (Comprehensive Study of Riyad us-Saliheen)",
    slug: "comprehensive-riyadus-saliheen",
    summary: "32+ ክፍሎች ያሉት የተሟላ የሀዲስ ትምህርት፤ የኢኽላስ፣ የተውባህ፣ የሶብርና የተግባራዊ ስነ-ምግባር ትምህርቶች በሸይኽ ሙሐመድ ፈረጅ።",
    description: "ሪያዱ ሷሊሂን በነቢያዊ ሀዲሶችና በስነ-ምግባር ትምህርት ውስጥ እጅግ ተወዳጅ የሆነ የሀዲስ መድበል ነው። በዚህ ተከታታይ ኮርስ ታላቁ ሊቅ ሸይኽ ሙሐመድ ፈረጅ መጀኖ ሀዲሶቹን በዝርዝር በማብራራት ለህይወታችን መመሪያ እንዲሆኑ ያቀርቡታል።",
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
    categories: ["hadith", "akhlaq", "classical-studies"],
    tags: ["ሪያዱ-ሷሊሂን", "ሀዲስ", "ስነ-ምግባር", "ሸይኽ-ሙሐመድ-ፈረጅ"],
    lessons: [
      {
        object: "lesson",
        id: "les_riyad_01",
        title: "ትምህርት 1፦ የኢኽላስና የቅን ኒያህ አስፈላጊነት (ክፍል 1)",
        summary: "ስራዎች በኒያህ እንደሚመዘኑ የሚገልጸው ታላቁ ሀዲስ ትንታኔ በሸይኽ ሙሐመድ ፈረጅ።",
        duration_seconds: 1837,
        position: 1,
      },
      {
        object: "lesson",
        id: "les_riyad_02",
        title: "ትምህርት 2፦ የተውባህ (የንስሃ) መስፈርቶችና በሮች (ክፍል 2)",
        summary: "አላህ ዘንድ ተቀባይነት ያለው እውነተኛ ንስሃ ማብራሪያ።",
        duration_seconds: 1912,
        position: 2,
      },
      {
        object: "lesson",
        id: "les_riyad_03",
        title: "ትምህርት 3፦ የሶብር (የትዕግስት) ታላቅነትና ደረጃዎች (ክፍል 3)",
        summary: "በፈተናዎች ወቅት ሙእሚን ሊኖረው የሚገባው ጽናት በሸይኽ ሙሐመድ ፈረጅ።",
        duration_seconds: 1974,
        position: 3,
      },
      {
        object: "lesson",
        id: "les_riyad_04",
        title: "ትምህርት 4፦ በፈተና ወቅት መጽናትና የአላህ ውሳኔ (ክፍል 4)",
        summary: "በቀደር (በአላህ ውሳኔ) ማመንና በችግር ወቅት ትዕግስትን መላበስ።",
        duration_seconds: 2503,
        position: 4,
      },
      {
        object: "lesson",
        id: "les_riyad_05",
        title: "ትምህርት 5፦ የሪያዱ ሷሊሂን ማጠቃለያና የጽናት መመሪያዎች (ክፍል 5)",
        summary: "የኪታቡ ማጠቃለያ፣ የሀዲስ ፍሬዎችና የጽናት መመሪያዎች።",
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
