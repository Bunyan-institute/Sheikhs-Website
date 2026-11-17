import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

const seedPath = path.join(projectRoot, "src", "lib", "db", "seed", "content-seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

const volumes = [
  {
    manifest: path.join(projectRoot, "data", "miat-hadith-volume-1-manifest.json"),
    id: "ser_miat_hadith_v1",
    title: "مائة حديث — الجزء الأول (100 ሀዲስ — ክፍል 1)",
    slug: "miat-hadith-volume-1",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል አንድ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-hero.jpg",
  },
  {
    manifest: path.join(projectRoot, "data", "miat-hadith-volume-2-manifest.json"),
    id: "ser_miat_hadith_v2",
    title: "مائة حديث — الجزء الثاني (100 ሀዲስ — ክፍል 2)",
    slug: "miat-hadith-volume-2",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሁለት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-portrait.jpg",
  },
  {
    manifest: path.join(projectRoot, "data", "miat-hadith-volume-3-manifest.json"),
    id: "ser_miat_hadith_v3",
    title: "مائة حديث — الجزء الثالث (100 ሀዲስ — ክፍል 3)",
    slug: "miat-hadith-volume-3",
    description: "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሦስት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
    cover: "/images/sheikh-hero.jpg",
  },
];

let totalAddedLectures = 0;
let totalUpdatedLectures = 0;

for (const vol of volumes) {
  if (!fs.existsSync(vol.manifest)) {
    console.warn(`Manifest not found for ${vol.title}: ${vol.manifest}`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(vol.manifest, "utf-8"));

  // 1. Upsert Series
  const existingIdx = seed.series.findIndex((s) => s.slug === vol.slug || s.id === vol.id);
  const seriesObj = {
    object: "series",
    id: vol.id,
    title: vol.title,
    slug: vol.slug,
    description: vol.description,
    locale: "am",
    direction: "ltr",
    cover: { url: vol.cover },
    lecture_count: manifest.length,
    published_at: "2026-11-17T06:00:00Z",
    updated_at: new Date().toISOString(),
    status: "published",
  };

  if (existingIdx >= 0) {
    seed.series[existingIdx] = { ...seed.series[existingIdx], ...seriesObj };
  } else {
    seed.series.push(seriesObj);
  }

  // 2. Ingest Lectures
  for (const item of manifest) {
    const trackStr = item.track.toString().padStart(2, "0");
    const lectureId = `lec_${vol.slug.replace(/-/g, "_")}_${trackStr}`;
    const mediaId = `med_${vol.slug.replace(/-/g, "_")}_${trackStr}`;

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
      thumbnail_url: vol.cover,
    };

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
      description: `${vol.title} — ${item.display_label} በሸይኽ ሙሐመድ ፈረጅ መገኖ።`,
      summary: `${vol.title} — ${item.display_label}። ትምህርት በሸይኽ ሙሐመድ ፈረጅ።`,
      locale: "am",
      direction: "ltr",
      status: "published",
      type: "audio",
      duration_seconds: item.duration_seconds,
      audio_url: item.audio_url,
      video_url: null,
      series: {
        id: vol.id,
        title: vol.title,
        position: item.track,
      },
      media: [mediaRef],
      tags: ["hadith", "sunnah", "tarbiyah", "100-hadith"],
      categories: ["hadith", "sunnah"],
      published_at: "2026-11-17T06:00:00Z",
      updated_at: new Date().toISOString(),
    };

    const existingLecIdx = seed.lectures.findIndex((l) => l.slug === item.slug || l.id === lectureId);
    if (existingLecIdx >= 0) {
      seed.lectures[existingLecIdx] = { ...seed.lectures[existingLecIdx], ...lectureObj };
      totalUpdatedLectures++;
    } else {
      seed.lectures.push(lectureObj);
      totalAddedLectures++;
    }
  }
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), "utf-8");

console.log("Miat Hadith Volumes 1, 2, 3 Ingestion Complete:");
console.log(`  Added Lectures:   ${totalAddedLectures}`);
console.log(`  Updated Lectures: ${totalUpdatedLectures}`);
console.log(`  Total Lectures:   ${seed.lectures.length}`);
console.log(`  Total Series:     ${seed.series.length}`);
console.log(`  Total Media:      ${seed.media.length}`);
