import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const seedPath = path.join(projectRoot, "src", "lib", "db", "seed", "content-seed.json");
const repoPath = path.join(projectRoot, "src", "lib", "db", "repository.ts");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

// Manifest files
const manifests = {
  "rawdatul-anwar": "data/rawdatul-anwar-manifest.json",
  "miat-hadith-volume-1": "data/miat-hadith-volume-1-manifest.json",
  "miat-hadith-volume-2": "data/miat-hadith-volume-2-manifest.json",
  "miat-hadith-volume-3": "data/miat-hadith-volume-3-manifest.json",
  "usul-al-iman": "data/usul-al-iman-manifest.json",
  "nawaqid-al-islam": "data/nawaqid-al-islam-manifest.json",
  "tashil-al-aqeedah": "data/tashil-al-aqeedah-manifest.json",
  "ramadan-lessons": "data/ramadan-lessons-manifest.json",
  "akhlaq-al-muslim": "data/akhlaq-al-muslim-manifest.json",
  "standalone": "data/standalone-lectures-manifest.json",
  "audio-manifest": "data/audio-manifest.json",
};

const manifestMap = new Map();
const durationMap = new Map();

for (const [mName, mPath] of Object.entries(manifests)) {
  const full = path.join(projectRoot, mPath);
  if (fs.existsSync(full)) {
    const data = JSON.parse(fs.readFileSync(full, "utf-8"));
    if (Array.isArray(data)) {
      for (const it of data) {
        const url = it.audio_url || it.url;
        const dur = it.duration_seconds || it.duration;
        if (it.slug && url) manifestMap.set(it.slug, url);
        if (it.slug && dur) durationMap.set(it.slug, dur);
        if (it.filename && url) manifestMap.set(it.filename, url);
      }
    }
  }
}

// Media assets map
const mediaAssetsMap = new Map();
for (const m of seed.media || []) {
  if (m.id) mediaAssetsMap.set(m.id, m);
  if (m.url) mediaAssetsMap.set(m.url, m);
}

// Canonical series definitions
const seriesMetadata = {
  "ser-riyadus-saliheen": {
    id: "ser-riyadus-saliheen",
    title: "Explanation of Riyad us-Saliheen (شرح رياض الصالحين / ሪያዱ ሷሊሂን)",
    slug: "riyadus-saliheen",
    description: "A comprehensive Hadith exegesis of Riyad us-Saliheen by Imam an-Nawawi, expounded by Sheikh Muhammed Ferej Megeno on Africa TV and Darul Hadith, focusing on prophetic manners, authentic Sunnah, and character purification.",
    cover: "/images/photo_11_2026-09-30_23-42-17.jpg",
    categories: ["hadith", "akhlaq", "sunnah"],
    tags: ["ሪያዱ-ሷሊሂን", "ሀዲስ", "ሸይኽ-ሙሐመድ-ፈረጅ", "ደርስ"]
  },
  "ser_arbain_nawawi": {
    id: "ser_arbain_nawawi",
    title: "الأربعون النووية (Al-Arba'in An-Nawawiyyah / አርበዒን ነወውያ)",
    slug: "al-arbain-an-nawawiyyah",
    description: "የኢማም አን-ነወዊይ አርበዒን ሐዲስ የተሟላ ማብራሪያና ትንታኔ በሸይኽ ሙሐመድ ፈረጅ መገኖ። የኢስላም መሰረታዊ መርሆዎችን የያዙ 42 አንኳር ሐዲሶች ማብራሪያ።",
    cover: "/images/hadith-slides/0.jpg",
    categories: ["hadith", "sunnah", "tarbiyah"],
    tags: ["አርበዒን-ነወውያ", "ሐዲስ", "ሸይኽ-ሙሐመድ-ፈረጅ", "arbain-hadith"]
  },
  "ser_aqeedah_wasitiyyah": {
    id: "ser_aqeedah_wasitiyyah",
    title: "العقيدة الواسطية (Al-Aqeedah Al-Wasitiyyah / አቂደቱል ዋሲጢያ)",
    slug: "aqeedah-al-wasitiyyah",
    description: "የሸይኹል ኢስላም ኢብኑ ተይሚያህ አል-አቂዳ አል-ዋሲጢያህ ኪታብ ጥልቅ ማብራሪያ በሸይኽ ሙሐመድ ፈረጅ መገኖ። የአህሉሱና ወልጀማዐህ መሰረታዊ የአቂዳ እምነቶች።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["aqeedah", "tawheed", "scholarly"],
    tags: ["አቂደቱል-ዋሲጢያህ", "አቂዳ", "ተውሂድ", "wasitiyyah"]
  },
  "ser_khudh_aqeedatak": {
    id: "ser_khudh_aqeedatak",
    title: "خذ عقيدتك من الكتاب والسنة (Khudh Aqeedatak / ኪታቡ ኹዝ ዓቂደተክ)",
    slug: "khudh-aqeedatak",
    description: "የሸይኽ ሙሐመድ ጃሚል ዘይኑ 'ኹዝ ዓቂደተከ ሚነል ኪታቢ ወስ-ሱንናህ' (እምነትህን ከቁርኣንና ከሐዲስ ያዝ) የተሰኘው አንኳር ኪታብ ማብራሪያ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-hero.jpg",
    categories: ["aqeedah", "tawheed", "fundamentals"],
    tags: ["ኹዝ-ዓቂደተክ", "አቂዳ", "ተውሂድ", "khudh-aqeedatak"]
  },
  "ser_rawdatul_anwar": {
    id: "ser_rawdatul_anwar",
    title: "روضة الأنوار في سيرة النبي المختار (ረውደቱል አንዋር)",
    slug: "rawdatul-anwar",
    description: "የአላህ መልዕክተኛ (ሰ.ዐ.ወ) የተከበረች ታሪክ፣ የህይወት ጉዞና የነብይነት ፈለግ ከታማኝና ከተጣራ የሲራህ ምንጮች የተዘጋጀ ተከታታይ የደርስ ስብስብ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["seerah", "history", "prophetic"],
    tags: ["seerah", "rawdatul-anwar", "prophet-muhammed", "sirah"]
  },
  "ser_miat_hadith_v1": {
    id: "ser_miat_hadith_v1",
    title: "مائة حديث — الجزء الأول (100 ሀዲስ — ክፍል 1)",
    slug: "miat-hadith-volume-1",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል አንድ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-hero.jpg",
    categories: ["hadith", "sunnah"],
    tags: ["hadith", "sunnah", "tarbiyah", "100-hadith"]
  },
  "ser_miat_hadith_v2": {
    id: "ser_miat_hadith_v2",
    title: "مائة حديث — الجزء الثاني (100 ሀዲስ — ክፍል 2)",
    slug: "miat-hadith-volume-2",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሁለት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["hadith", "sunnah"],
    tags: ["hadith", "sunnah", "tarbiyah", "100-hadith"]
  },
  "ser_miat_hadith_v3": {
    id: "ser_miat_hadith_v3",
    title: "مائة حديث — الجزء الثالث (100 ሀዲስ — ክፍል 3)",
    slug: "miat-hadith-volume-3",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሦስት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-hero.jpg",
    categories: ["hadith", "sunnah"],
    tags: ["hadith", "sunnah", "tarbiyah", "100-hadith"]
  },
  "usul-al-iman": {
    id: "usul-al-iman",
    title: "أصول الإيمان (ኡሱሉል ኢማን)",
    slug: "usul-al-iman",
    description: "የኡሱሉል ኢማን ኪታብ ማብራሪያ ተከታታይ ትምህርቶች በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — መሰረተ እምነት፣ የተውሂድ ክፍሎች፣ ኢባዳ፣ የሽርክ አደጋዎች፣ በመላኢካዎች፣ በመጽሐፍት፣ በመልክተኞች፣ በመጨረሻው ቀንና በቀደር ማመን።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["aqeedah", "iman", "tawheed"],
    tags: ["usul-al-iman", "አቂዳ", "ኡሱሉል-ኢማን", "መሰረተ-እምነት"]
  },
  "nawaqid-al-islam": {
    id: "nawaqid-al-islam",
    title: "نواقض الإسلام (ኢስላምን የሚያፈርሱ ነገሮች)",
    slug: "nawaqid-al-islam",
    description: "የሸይኽ ሙሐመድ ኢብኑ ዐብዲልወሀብ ኪታብ ማብራሪያ በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — ሙስሊምን ከእስልምና የሚያስወጡ አስርቱ አበይት አፍራሽ ነገሮች ዝርዝር ትንታኔ።",
    cover: "/images/sheikh-hero.jpg",
    categories: ["aqeedah", "tawheed"],
    tags: ["ነዋቂድ-አል-ኢስላም", "ኢስላምን-የሚያፈርሱ", "አቂዳ", "ተውሂድ"]
  },
  "tashil-al-aqeedah": {
    id: "tashil-al-aqeedah",
    title: "تسهيل العقيدة الإسلامية (ተስሂሉ አል-አቂዳ)",
    slug: "tashil-al-aqeedah",
    description: "የኢስላማዊ አቂዳ ማቅለያ ትምህርቶች በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — ተውሂድ፣ የሰለፎች ጎዳና፣ ሚዛናዊነትና የአህሉሱናህ መለያዎች።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["aqeedah", "tawheed"],
    tags: ["ተስሂሉ-አል-አቂዳ", "አቂዳ", "ተውሂድ", "tashil-al-aqeedah"]
  },
  "ramadan-lessons": {
    id: "ramadan-lessons",
    title: "ስለ ረመዳን እና ተዛማጅ ትምህርቶች (دروس رمضان)",
    slug: "ramadan-lessons",
    description: "የተከበረውን የረመዳን ወር አቀባበል፣ የተራዊህና የተሀጁድ ሰላት፣ ለይለቱል ቀድር፣ የመጨረሻዎቹ አስር ቀናት እና ዘካቱል ፊጥርን የተመለከቱ ትምህርቶች።",
    cover: "/images/sheikh-hero.jpg",
    categories: ["fiqh", "ramadan", "fasting"],
    tags: ["ረመዳን", "ጾም", "ተራዊህ", "ዘካቱል-ፊጥር"]
  },
  "akhlaq-al-muslim": {
    id: "akhlaq-al-muslim",
    title: "خلق المسلم (የሙስሊም ስነ-ምግባር)",
    slug: "akhlaq-al-muslim",
    description: "የአንድ ሙስሊም ስነምግባር ከአላህ፣ ከመልእክተኛው ሰለላሁ ዐለይሂ ወሰለም፣ ከቅዱስ ቁርኣን እና ከሰው ልጆች ጋር ሊኖረው የሚገባውን እስላማዊ ስነምግባር የሚያብራራ።",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["akhlaq", "tarbiyah", "manners"],
    tags: ["የሙስሊም-ስነምግባር", "አኽላቅ", "ተርቢያህ", "akhlaq"]
  }
};

// 1. Normalize all lectures
const normalizedLectures = [];
const lecturesBySeriesId = {};
for (const sId of Object.keys(seriesMetadata)) {
  lecturesBySeriesId[sId] = [];
}

for (const raw of seed.lectures) {
  // Extract audio & video
  let audio = null;
  let video = null;
  let transcript = null;

  if (Array.isArray(raw.media)) {
    for (const m of raw.media) {
      if (m.kind === "audio" || m.type === "audio" || m.url?.endsWith(".mp3") || m.mime_type === "audio/mpeg") {
        audio = m.url;
      }
      if (m.kind === "video" || m.type === "video") {
        video = m.url;
      }
    }
  } else if (raw.media && typeof raw.media === "object") {
    audio = raw.media.audio || raw.audio_url || null;
    video = raw.media.video || raw.video_url || null;
    transcript = raw.media.transcript || raw.transcript || null;
  }

  if (!audio && raw.audio_url) audio = raw.audio_url;
  if (!video && raw.video_url) video = raw.video_url;
  if (!transcript && raw.transcript) transcript = raw.transcript;

  if (!audio && raw.mediaRefId && mediaAssetsMap.has(raw.mediaRefId)) {
    audio = mediaAssetsMap.get(raw.mediaRefId).url;
  }
  if (!audio && mediaAssetsMap.has(`media-${raw.id}`)) {
    audio = mediaAssetsMap.get(`media-${raw.id}`).url;
  }
  if (!audio && manifestMap.has(raw.slug)) {
    audio = manifestMap.get(raw.slug);
  }

  // Duration
  let duration = raw.duration_seconds || raw.duration;
  if (!duration && durationMap.has(raw.slug)) {
    duration = durationMap.get(raw.slug);
  }
  duration = duration ? Number(duration) : null;

  // Determine series
  let sId = raw.series?.id || raw.seriesId || null;
  if (!sId) {
    if (raw.id.startsWith("usul-al-iman")) sId = "usul-al-iman";
    else if (raw.id.startsWith("nawaqid-al-islam")) sId = "nawaqid-al-islam";
    else if (raw.id.startsWith("tashil-al-aqeedah")) sId = "tashil-al-aqeedah";
    else if (raw.id.startsWith("ramadan-lessons")) sId = "ramadan-lessons";
    else if (raw.id.startsWith("akhlaq-al-muslim")) sId = "akhlaq-al-muslim";
    else if (raw.id.startsWith("lec_rawda")) sId = "ser_rawdatul_anwar";
  }

  // Determine position
  let position = raw.series?.position || raw.orderInSeries || raw.track || null;
  if (!position) {
    const numMatch = raw.slug?.match(/\d+/) || raw.id?.match(/\d+/);
    if (numMatch) position = parseInt(numMatch[0], 10);
  }
  position = position ? Number(position) : 1;

  let seriesRef = null;
  if (sId && seriesMetadata[sId]) {
    const sMeta = seriesMetadata[sId];
    seriesRef = {
      id: sMeta.id,
      title: sMeta.title,
      position: position,
    };
  }

  // Cover image
  let coverUrl = raw.cover?.url || raw.cover || null;
  if (!coverUrl && seriesRef && seriesMetadata[seriesRef.id]) {
    coverUrl = seriesMetadata[seriesRef.id].cover;
  }
  if (!coverUrl) {
    coverUrl = "/images/sheikh-portrait.jpg";
  }

  const summary = raw.summary || raw.description || raw.title;

  const cleanLecture = {
    object: "lecture",
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    summary: summary,
    locale: raw.locale || "am",
    direction: raw.direction || "ltr",
    duration_seconds: duration,
    published_at: raw.published_at || "2024-03-01T08:00:00Z",
    updated_at: raw.updated_at || new Date().toISOString(),
    status: "published",
    cover: {
      object: "media",
      id: `med_cov_${raw.id}`,
      kind: "image",
      url: coverUrl,
      mime_type: "image/jpeg",
      width: 1280,
      height: 720,
      duration_seconds: null,
    },
    media: {
      audio: audio,
      video: video,
      transcript: transcript,
    },
    series: seriesRef,
    categories: raw.categories || (seriesRef && seriesMetadata[seriesRef.id]?.categories) || ["general"],
    tags: raw.tags || (seriesRef && seriesMetadata[seriesRef.id]?.tags) || ["lecture"],
  };

  normalizedLectures.push(cleanLecture);
  if (seriesRef && lecturesBySeriesId[seriesRef.id]) {
    lecturesBySeriesId[seriesRef.id].push(cleanLecture);
  }
}

// 2. Normalize series
const normalizedSeries = [];
for (const [sId, sMeta] of Object.entries(seriesMetadata)) {
  const ownLectures = lecturesBySeriesId[sId] || [];
  ownLectures.sort((a, b) => (a.series?.position || 0) - (b.series?.position || 0));

  const cleanSeries = {
    object: "series",
    id: sMeta.id,
    title: sMeta.title,
    slug: sMeta.slug,
    description: sMeta.description,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: `med_ser_${sMeta.slug}_cover`,
      kind: "image",
      url: sMeta.cover,
      mime_type: "image/jpeg",
      width: 1280,
      height: 720,
      duration_seconds: null,
    },
    lecture_count: ownLectures.length,
    published_at: "2024-03-01T08:00:00Z",
    updated_at: new Date().toISOString(),
    status: "published",
    lectures: ownLectures,
  };

  normalizedSeries.push(cleanSeries);
}

// 3. Update seed
seed.lectures = normalizedLectures;
seed.series = normalizedSeries;

// Save normalized seed
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n", "utf-8");

// Bump SEED_VERSION_KEY in repository.ts
const newVersionKey = `_seed_version_20261118_complete_archive_${Date.now()}`;
let repoCode = fs.readFileSync(repoPath, "utf-8");
repoCode = repoCode.replace(/const SEED_VERSION_KEY = ['"][^'"]+['"];/, `const SEED_VERSION_KEY = "${newVersionKey}";`);
fs.writeFileSync(repoPath, repoCode, "utf-8");

console.log("=== Seed Normalization Successful ===");
console.log(`Total Lectures: ${seed.lectures.length}`);
console.log(`Audio Lectures: ${seed.lectures.filter(l => l.media?.audio).length}`);
console.log(`Video Lectures: ${seed.lectures.filter(l => l.media?.video).length}`);
console.log(`Series Count:   ${seed.series.length}`);
seed.series.forEach(s => {
  console.log(`  - [${s.id}] ${s.slug}: ${s.lecture_count} lessons`);
});
console.log(`New Version Key: ${newVersionKey}`);
