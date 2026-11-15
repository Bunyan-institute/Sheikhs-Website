import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const manifestPath = path.join(projectRoot, "data", "audio-manifest.json");
const seedPath = path.join(projectRoot, "src", "lib", "db", "seed", "content-seed.json");

if (!fs.existsSync(manifestPath)) {
  console.error("audio-manifest.json not found. Run scripts/compact-audio.py first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

const seriesDefs = {
  "al-arbain-an-nawawiyyah": {
    id: "ser_arbain_nawawi",
    title: "الأربعون النووية (Al-Arba'in An-Nawawiyyah / አርበዒን ነወውያ)",
    slug: "al-arbain-an-nawawiyyah",
    description: "Comprehensive exposition of the forty foundational hadiths of Islam compiled by Imam An-Nawawi, taught with practical and theological applications by Sheikh Muhammed Ferej Megeno.",
    cover: "/images/hadith-slides/0.jpg",
    categories: ["hadith", "sunnah", "tarbiyah"],
    tags: ["arbaeen", "nawawi", "hadith", "sunnah"],
  },
  "aqeedah-al-wasitiyyah": {
    id: "ser_aqeedah_wasitiyyah",
    title: "العقيدة الواسطية (Al-Aqeedah Al-Wasitiyyah / አቂደቱል ዋሲጢያ)",
    slug: "aqeedah-al-wasitiyyah",
    description: "A thorough explanation of the classical Islamic creed by Shaykh al-Islam Ibn Taymiyyah, delivered with authentic proofs by Sheikh Muhammed Ferej Megeno.",
    cover: "/images/sheikh-portrait.jpg",
    categories: ["aqeedah", "tawheed"],
    tags: ["aqeedah", "wasitiyyah", "ibn-taymiyyah", "tawheed"],
  },
  "khudh-aqeedatak": {
    id: "ser_khudh_aqeedatak",
    title: "خذ عقيدتك من الكتاب والسنة (Khudh Aqeedatak / ኪታቡ ኹዝ ዓቂደተክ)",
    slug: "khudh-aqeedatak",
    description: "Foundational Islamic creed taken directly from the Holy Quran and authentic Prophetic Sunnah, taught by Sheikh Muhammed Ferej Megeno.",
    cover: "/images/sheikh-hero.jpg",
    categories: ["aqeedah", "manhaj", "tawheed"],
    tags: ["aqeedah", "tawheed", "sunnah", "manhaj"],
  },
};

// 1. Ensure Series exist in seed
for (const [slug, def] of Object.entries(seriesDefs)) {
  const existingIdx = seed.series.findIndex((s) => s.slug === slug || s.id === def.id);
  const seriesObj = {
    object: "series",
    id: def.id,
    title: def.title,
    slug: def.slug,
    description: def.description,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: `med_${def.id}_cover`,
      kind: "image",
      url: def.cover,
      mime_type: "image/jpeg",
      width: 1280,
      height: 720,
      duration_seconds: null,
    },
    categories: def.categories,
    tags: def.tags,
    lecture_count: 0,
    status: "published",
    published_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };
  if (existingIdx >= 0) {
    seed.series[existingIdx] = seriesObj;
  } else {
    seed.series.push(seriesObj);
  }
}

// 2. Add or update Lectures
let addedLectures = 0;
let updatedLectures = 0;

for (const item of manifest) {
  const sDef = seriesDefs[item.series];
  if (!sDef) continue;

  const lecId = `lec_${item.slug.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  const lectureObj = {
    object: "lecture",
    id: lecId,
    title: item.title,
    slug: item.slug,
    summary: `${item.title} — በኡስታዝ ሙሐመድ ፈረጅ የተሰጠ የተሟላ ትምህርት።`,
    locale: "am",
    direction: "ltr",
    duration_seconds: item.duration_seconds,
    published_at: "2024-01-10T12:00:00Z",
    updated_at: "2024-01-10T12:00:00Z",
    cover: {
      object: "media",
      id: `med_${lecId}_cov`,
      kind: "image",
      url: item.cover || sDef.cover,
      mime_type: "image/jpeg",
      width: 1280,
      height: 720,
      duration_seconds: null,
    },
    media: {
      audio: item.audio_url,
      video: null,
      transcript: `ቢስሚላሂር ራሕማኒር ራሒም. አልሐምዱ ሊላሂ ረቢል ዓለሚን. ወሶላቱ ወሰላሙ ዓላ ረሱሊላህ. ${item.title} — በኡስታዝ ሙሐመድ ፈረጅ የተሰጠ ትምህርት።`,
    },
    series: {
      id: sDef.id,
      position: item.track,
    },
    categories: sDef.categories,
    tags: sDef.tags,
    status: "published",
  };

  const idx = seed.lectures.findIndex((l) => l.slug === item.slug || l.id === lecId);
  if (idx >= 0) {
    seed.lectures[idx] = lectureObj;
    updatedLectures++;
  } else {
    seed.lectures.push(lectureObj);
    addedLectures++;
  }

  // Also add to media gallery
  const medId = `med_${lecId}`;
  const mediaObj = {
    id: medId,
    title: item.title,
    description: `${sDef.title} — ቁጥር ${item.track}`,
    kind: "audio",
    url: item.audio_url,
    mime_type: "audio/mpeg",
    width: null,
    height: null,
    thumbnail_url: item.cover || sDef.cover,
    duration_seconds: item.duration_seconds,
    published_at: "2024-01-10T12:00:00Z",
  };
  const mIdx = seed.media.findIndex((m) => m.id === medId || m.url === item.audio_url);
  if (mIdx >= 0) {
    seed.media[mIdx] = mediaObj;
  } else {
    seed.media.push(mediaObj);
  }
}

// 3. Write back seed file
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), "utf-8");
console.log(`\nSeed JSON successfully updated:`);
console.log(`  Added Lectures:   ${addedLectures}`);
console.log(`  Updated Lectures: ${updatedLectures}`);
console.log(`  Total Lectures:   ${seed.lectures.length}`);
console.log(`  Total Media:      ${seed.media.length}`);

// 4. Synchronize local SQLite database if repository is available
try {
  const { resetDatabase } = await import("../src/lib/db/repository.ts");
  console.log("Synchronizing active database with updated seed...");
  await resetDatabase();
  console.log("Database synchronized successfully!");
} catch (err) {
  console.warn("Database sync note:", err.message);
}
