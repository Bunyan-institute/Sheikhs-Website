import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const manifestPath = path.join(projectRoot, "data", "rawdatul-anwar-manifest.json");
const seedPath = path.join(projectRoot, "src", "lib", "db", "seed", "content-seed.json");

if (!fs.existsSync(manifestPath)) {
  console.error("rawdatul-anwar-manifest.json not found.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

const seriesDef = {
  id: "ser_rawdatul_anwar",
  title: "روضة الأنوار في سيرة النبي المختار (ረውደቱል አንዋር)",
  slug: "rawdatul-anwar",
  description: "የአላህ መልዕክተኛ (ሰ.ዐ.ወ) የተከበረች ታሪክ፣ የህይወት ጉዞና የነብይነት ፈለግ ከታማኝና ከተጣራ የሲራህ ምንጮች የተዘጋጀ ተከታታይ የደርስ ስብስብ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
  cover: "/images/sheikh-portrait.jpg",
  categories: ["seerah", "history", "prophetic"],
  tags: ["seerah", "rawdatul-anwar", "prophet-muhammed", "sirah"],
};

// 1. Upsert Series in seed
const existingIdx = seed.series.findIndex((s) => s.slug === seriesDef.slug || s.id === seriesDef.id);
const seriesObj = {
  object: "series",
  id: seriesDef.id,
  title: seriesDef.title,
  slug: seriesDef.slug,
  description: seriesDef.description,
  locale: "am",
  direction: "ltr",
  cover: { url: seriesDef.cover },
  lecture_count: manifest.length,
  published_at: "2026-11-16T12:00:00Z",
  updated_at: new Date().toISOString(),
  status: "published",
};

if (existingIdx >= 0) {
  seed.series[existingIdx] = { ...seed.series[existingIdx], ...seriesObj };
} else {
  seed.series.push(seriesObj);
}

// 2. Ingest Lectures & Media Assets
let addedLectures = 0;
let updatedLectures = 0;

for (const item of manifest) {
  const trackStr = item.track.toString().padStart(2, "0");
  const lectureId = `lec_rawdatul_anwar_${trackStr}`;
  const mediaId = `med_rawdatul_anwar_${trackStr}`;

  const mediaRef = {
    id: mediaId,
    kind: "audio",
    type: "audio",
    url: item.audio_url,
    title: item.title,
    duration_seconds: item.duration_seconds,
    file_size: item.file_size,
    mime_type: "audio/mpeg",
    width: null,
    height: null,
    description: item.title,
    thumbnail_url: seriesDef.cover,
  };

  // Upsert into seed.media
  const existingMediaIdx = seed.media.findIndex((m) => m.id === mediaId || m.url === item.audio_url);
  if (existingMediaIdx >= 0) {
    seed.media[existingMediaIdx] = { ...seed.media[existingMediaIdx], ...mediaRef };
  } else {
    seed.media.push(mediaRef);
  }

  const lectureObj = {
    object: "lecture",
    id: lectureId,
    title: item.title,
    slug: item.slug,
    description: `የአላህ መልዕክተኛ (ሰ.ዐ.ወ) የተከበረች ታሪክ፣ የህይወት ጉዞና የነብይነት ፈለግ ከታማኝና ከተጣራ የሲራህ ምንጮች የተዘጋጀ ተከታታይ የደርስ ስብስብ በሸይኽ ሙሐመድ ፈረጅ መገኖ — ${item.display_label}።`,
    summary: `ረውደቱል አንዋር በሸይኽ ሙሐመድ ፈረጅ መገኖ — ${item.display_label}። ተከታታይ የነብዩ (ሰ.ዐ.ወ) የሲራህ ትምህርት።`,
    locale: "am",
    direction: "ltr",
    status: "published",
    type: "audio",
    duration_seconds: item.duration_seconds,
    audio_url: item.audio_url,
    video_url: null,
    series: {
      id: seriesDef.id,
      title: seriesDef.title,
      position: item.track,
    },
    media: [mediaRef],
    tags: seriesDef.tags,
    categories: seriesDef.categories,
    published_at: "2026-11-16T12:00:00Z",
    updated_at: new Date().toISOString(),
  };

  const existingLecIdx = seed.lectures.findIndex((l) => l.slug === item.slug || l.id === lectureId);
  if (existingLecIdx >= 0) {
    seed.lectures[existingLecIdx] = { ...seed.lectures[existingLecIdx], ...lectureObj };
    updatedLectures++;
  } else {
    seed.lectures.push(lectureObj);
    addedLectures++;
  }
}

// 3. Write back seed file
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), "utf-8");

console.log("Rawdatul Anwar Seed Ingestion Complete:");
console.log(`  Added Lectures:   ${addedLectures}`);
console.log(`  Updated Lectures: ${updatedLectures}`);
console.log(`  Total Lectures:   ${seed.lectures.length}`);
console.log(`  Total Series:     ${seed.series.length}`);
console.log(`  Total Media:      ${seed.media.length}`);
