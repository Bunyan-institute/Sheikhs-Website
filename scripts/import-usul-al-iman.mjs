#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SEED_FILE = path.join(rootDir, 'src/lib/db/seed/content-seed.json');
const MANIFEST_FILE = path.join(rootDir, 'data/usul-al-iman-manifest.json');
const REPO_FILE = path.join(rootDir, 'src/lib/db/repository.ts');

async function main() {
  const seedRaw = await readFile(SEED_FILE, 'utf-8');
  const seed = JSON.parse(seedRaw);

  const manifestRaw = await readFile(MANIFEST_FILE, 'utf-8');
  const manifest = JSON.parse(manifestRaw);

  const seriesId = 'usul-al-iman';
  const seriesSlug = 'usul-al-iman';
  
  let series = seed.series.find(s => s.id === seriesId);
  if (!series) {
    series = {
      id: seriesId,
      title: 'أصول الإيمان (ኡሱሉል ኢማን)',
      titleAm: 'ኡሱሉል ኢማን (መሰረተ እምነት)',
      titleAr: 'أصول الإيمان',
      slug: seriesSlug,
      description: 'የኡሱሉል ኢማን ኪታብ ማብራሪያ ተከታታይ ትምህርቶች በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — መሰረተ እምነት፣ የተውሂድ ክፍሎች፣ ኢባዳ፣ የሽርክ አደጋዎች፣ በመላኢካዎች፣ በመጽሐፍት፣ በመልክተኞች፣ በመጨረሻው ቀንና በቀደር ማመን።',
      category: 'aqeedah',
      orderIndex: 4,
      createdAt: '2026-11-17T00:00:00.000Z',
      updatedAt: '2026-11-17T00:00:00.000Z'
    };
    seed.series.push(series);
  }

  let addedLectures = 0;
  let updatedLectures = 0;

  for (const item of manifest) {
    const lectureId = `usul-al-iman-${String(item.lesson_num).padStart(2, '0')}`;
    const lectureSlug = item.slug;
    const mediaId = `media-usul-al-iman-${String(item.lesson_num).padStart(2, '0')}`;

    const existingMediaIdx = seed.media.findIndex(m => m.id === mediaId || m.url === item.url);
    const mediaObj = {
      id: mediaId,
      type: 'audio',
      url: item.url,
      path: `public${item.url}`,
      mimeType: 'audio/mpeg',
      fileSize: item.file_size,
      duration: item.duration,
      createdAt: '2026-11-17T00:00:00.000Z',
      updatedAt: '2026-11-17T00:00:00.000Z'
    };

    if (existingMediaIdx >= 0) {
      seed.media[existingMediaIdx] = { ...seed.media[existingMediaIdx], ...mediaObj };
    } else {
      seed.media.push(mediaObj);
    }

    const existingLectureIdx = seed.lectures.findIndex(l => l.id === lectureId || l.slug === lectureSlug);
    const lectureObj = {
      id: lectureId,
      title: item.title,
      titleAm: item.title,
      titleAr: null,
      slug: lectureSlug,
      description: `የኡሱሉል ኢማን ትምህርት ቁጥር ${item.lesson_num}${item.topic ? ` — ${item.topic}` : ''}`,
      category: 'aqeedah',
      seriesId: seriesId,
      orderInSeries: item.lesson_num,
      mediaRefId: mediaId,
      notes: null,
      slidesRefId: null,
      transcriptionId: null,
      createdAt: '2026-11-17T00:00:00.000Z',
      updatedAt: '2026-11-17T00:00:00.000Z'
    };

    if (existingLectureIdx >= 0) {
      seed.lectures[existingLectureIdx] = { ...seed.lectures[existingLectureIdx], ...lectureObj };
      updatedLectures++;
    } else {
      seed.lectures.push(lectureObj);
      addedLectures++;
    }
  }

  await writeFile(SEED_FILE, JSON.stringify(seed, null, 2) + '\n', 'utf-8');

  // Bump SEED_VERSION_KEY in repository.ts
  const newVersionKey = `_seed_version_20261117_batch4_usul_iman_${Date.now()}`;
  let repoCode = await readFile(REPO_FILE, 'utf-8');
  repoCode = repoCode.replace(/const SEED_VERSION_KEY = ['"][^'"]+['"];/, `const SEED_VERSION_KEY = "${newVersionKey}";`);
  await writeFile(REPO_FILE, repoCode, 'utf-8');

  console.log(`Usul al-Iman Ingestion Complete:`);
  console.log(`  Added Lectures:   ${addedLectures}`);
  console.log(`  Updated Lectures: ${updatedLectures}`);
  console.log(`  Total Lectures:   ${seed.lectures.length}`);
  console.log(`  Total Series:     ${seed.series.length}`);
  console.log(`  Total Media:      ${seed.media.length}`);
  console.log(`  Version Key:      ${newVersionKey}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
