import { bunyan } from "./client";
import type { ListResponse, PublicEvent } from "./types";

export const AUTHENTIC_EVENTS: PublicEvent[] = [
  {
    object: "event",
    id: "evt_jumah_alfajr",
    title: "የጁምዓ ኹጥባህ — የተውሂድና የተረጋጋ ልብ ፋይዳ (Friday Khutbah)",
    slug: "friday-khutbah-importance-of-sincerity",
    summary: "በአል-ፈጅር መስጂድ የሚካሄድ ሳምንታዊ የጁምዓ ኹጥባህ በኡስታዝ ሙሐመድ ፈረጅ፤ የኢኽላስና የቅንነት መርሆዎች።",
    description: "ሳምንታዊ የጁምዓ ሰላት ኹጥባህ በአዲስ አበባ አል-ፈጅር መስጂድ የሚካሄድ ሲሆን በዕለቱም የልብ ንጽሕና፣ የአላህ ፍራቻ እና የህብረተሰብ አንድነት ዙሪያ ሰፊ ማብራሪያ ይሰጣል። በድረ-ገጹ የቀጥታ ስርጭትና የድምጽ ቅጂ ይቀርባል።",
    starts_at: "2026-10-09T09:30:00Z",
    ends_at: "2026-10-09T10:30:00Z",
    timezone: "Africa/Addis_Ababa",
    venue_name: "Al-Fajr Mosque",
    venue_address: "Addis Ababa, Ethiopia",
    online_url: "https://youtube.com/@muhammadferej",
    registration_required: false,
    capacity: null,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_evt_1",
      kind: "image",
      url: "/images/photo_15_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["khutbah", "jumah"],
    tags: ["ጁምዓ", "ኹጥባህ", "አል-ፈጅር", "አዲስ-አበባ"],
    published_at: "2026-09-25T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "event",
    id: "evt_riyadus_saliheen_conference",
    title: "የሪያዱ ሷሊሂን ዓመታዊ ጉባኤ (Annual Riyad us-Saliheen Conference)",
    slug: "annual-riyadus-saliheen-conference",
    summary: "ለሶስት ተከታታይ ቀናት የሚቆይ ጥልቅ የሀዲስና የስነ-ምግባር ትምህርት ጉባኤ በሸይኽ ሙሐመድ ፈረጅ መጀኖ።",
    description: "በየዓመቱ የሚዘጋጅ ልዩ የሀዲስና የስነ-ምግባር ትምህርት ጉባኤ። ተሳታፊዎች የሪያዱ ሷሊሂንን ዋና ዋና ምዕራፎች ከታላቁ ሊቅ ሸይኽ ሙሐመድ ፈረጅ ጋር በአካልና በበይነመረብ ይማራሉ። በጉባኤው ማጠናቀቂያ ላይ የተሳትፎ ሰርተፊኬት ይሰጣል።",
    starts_at: "2026-10-25T06:00:00Z",
    ends_at: "2026-10-27T15:00:00Z",
    timezone: "Africa/Addis_Ababa",
    venue_name: "Addis Ababa Cultural & Conference Hall",
    venue_address: "Addis Ababa, Ethiopia",
    online_url: "https://youtube.com/@muhammadferej",
    registration_required: true,
    capacity: 500,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_evt_2",
      kind: "image",
      url: "/images/photo_12_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["seminar", "aqeedah"],
    tags: ["ሴሚናር", "ኪታቡ-አተውሂድ", "ደርስ", "ኮንፈረንስ"],
    published_at: "2026-09-20T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
  {
    object: "event",
    id: "evt_aaoifi_workshop",
    title: "እስላማዊ ባንኪንግና የሸሪዓ አስተዳደር አውደ ጥናት (Islamic Banking Workshop)",
    slug: "islamic-banking-sharia-governance-workshop",
    summary: "በወጋገን ባንክ አማናህ መስኮት አስተባባሪነት ለባንክ ባለሙያዎችና ለነጋዴዎች የሚዘጋጅ የሸሪዓዊ ፋይናንስ ስልጠና።",
    description: "የAAOIFI ዓለም አቀፍ የሸሪዓ መመዘኛዎችን መሠረት ያደረገ ተግባራዊ አውደ-ጥናት። ከወለድ የጸዳ የፋይናንስ አማራጮች፣ የሙራበሃ ውሎችና የኦዲት ስርዓቶች ይዳሰሳሉ። አቅራቢ፦ ሼክ ሙሐመድ ፈረጅ (የሸሪዓ አማካሪና ኦዲተር)።",
    starts_at: "2026-11-15T06:30:00Z",
    ends_at: "2026-11-15T13:30:00Z",
    timezone: "Africa/Addis_Ababa",
    venue_name: "Wegagen Bank Headquarters Hall",
    venue_address: "Addis Ababa, Ethiopia",
    online_url: null,
    registration_required: true,
    capacity: 120,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_evt_3",
      kind: "image",
      url: "/images/photo_13_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["workshop", "islamic-finance"],
    tags: ["ወጋገን-አማናህ", "ኢስላሚክ-ባንክ", "AAOIFI", "አውደ-ጥናት"],
    published_at: "2026-09-15T00:00:00Z",
    updated_at: "2026-09-30T00:00:00Z",
  },
];

import { getAllEvents, getEventByIdOrSlug } from "@/lib/db/repository";

export async function getEvents(params: { limit?: string; cursor?: string; locale?: string; from?: string; to?: string; sort?: string; category?: string[]; tag?: string[] } = {}): Promise<ListResponse<PublicEvent>> {
  let list: PublicEvent[] = [];
  try {
    list = getAllEvents();
  } catch {
    list = AUTHENTIC_EVENTS;
  }
  if (!list || list.length === 0) {
    list = AUTHENTIC_EVENTS;
  }
  if (params.category && params.category.length > 0) {
    list = list.filter((e) => e.categories.some((cat) => params.category!.includes(cat)));
  }
  return {
    object: "list",
    data: list,
    has_more: false,
    next_cursor: null,
  };
}

export async function getEvent(reference: string, locale?: string): Promise<PublicEvent> {
  try {
    const found = getEventByIdOrSlug(reference);
    if (found) {
      return found;
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_EVENTS.find(
    (e) => e.slug === reference || e.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Event ${reference} not found`);
}
