#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SEED_FILE = path.join(rootDir, 'src/lib/db/seed/content-seed.json');
const REPO_FILE = path.join(rootDir, 'src/lib/db/repository.ts');

const SERIES_DEFS = [
  {
    id: 'nawaqid-al-islam',
    title: 'نواقض الإسلام (ኢስላምን የሚያፈርሱ ነገሮች)',
    titleAm: 'ኢስላምን የሚያፈርሱ ነገሮች (ነዋቂድ አል-ኢስላም)',
    titleAr: 'نواقض الإسلام',
    slug: 'nawaqid-al-islam',
    description: 'የሸይኽ ሙሐመድ ኢብኑ ዐብዲልወሀብ ኪታብ ማብራሪያ በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — ሙስሊምን ከእስልምና የሚያስወጡ አስርቱ አበይት አፍራሽ ነገሮች ዝርዝር ትንታኔ።',
    category: 'aqeedah',
    orderIndex: 5,
    manifest: 'data/nawaqid-al-islam-manifest.json'
  },
  {
    id: 'tashil-al-aqeedah',
    title: 'تسهيل العقيدة الإسلامية (ተስሂሉ አል-አቂዳ)',
    titleAm: 'የኢስላማዊ እምነት ማቅለያ (ተስሂሉ አል-አቂዳ)',
    titleAr: 'تسهيل العقيدة الإسلامية',
    slug: 'tashil-al-aqeedah',
    description: 'የኢስላማዊ አቂዳ ማቅለያ ትምህርቶች በሸይኽ ሙሐመድ ፈረጅ ረሒመሁላህ — ተውሂድ፣ የሰለፎች ጎዳና፣ ሚዛናዊነትና የአህሉሱናህ መለያዎች።',
    category: 'aqeedah',
    orderIndex: 6,
    manifest: 'data/tashil-al-aqeedah-manifest.json'
  },
  {
    id: 'ramadan-lessons',
    title: 'ስለ ረመዳን እና ተዛማጅ ትምህርቶች (دروس رمضان)',
    titleAm: 'የረመዳን ትምህርቶች — አቀባበል፣ ጾም፣ ተራዊህና ዘካቱል ፊጥር',
    titleAr: 'دروس ومواعظ شهر رمضان',
    slug: 'ramadan-lessons',
    description: 'የተከበረውን የረመዳን ወር አቀባበል፣ የተራዊህና የተሀጁድ ሰላት፣ ለይለቱል ቀድር፣ የመጨረሻዎቹ አስር ቀናት እና ዘካቱል ፊጥርን የተመለከቱ ትምህርቶች።',
    category: 'fiqh',
    orderIndex: 7,
    manifest: 'data/ramadan-lessons-manifest.json'
  },
  {
    id: 'akhlaq-al-muslim',
    title: 'خلق المسلم (የሙስሊም ስነ-ምግባር)',
    titleAm: 'የሙስሊም ስነ-ምግባር ከአላህ፣ ከመልእክተኛውና ከቁርኣን ጋር',
    titleAr: 'خلق المسلم',
    slug: 'akhlaq-al-muslim',
    description: 'የአንድ ሙስሊም ስነምግባር ከአላህ፣ ከመልእክተኛው ሰለላሁ ዐለይሂ ወሰለም፣ ከቅዱስ ቁርኣን እና ከሰው ልጆች ጋር ሊኖረው የሚገባውን እስላማዊ ስነምግባር የሚያብራራ።',
    category: 'akhlaq',
    orderIndex: 8,
    manifest: 'data/akhlaq-al-muslim-manifest.json'
  }
];

async function main() {
  const seedRaw = await readFile(SEED_FILE, 'utf-8');
  const seed = JSON.parse(seedRaw);

  let totalAdded = 0;
  let totalUpdated = 0;

  for (const sDef of SERIES_DEFS) {
    let sObj = seed.series.find(s => s.id === sDef.id);
    if (!sObj) {
      sObj = {
        id: sDef.id,
        title: sDef.title,
        titleAm: sDef.titleAm,
        titleAr: sDef.titleAr,
        slug: sDef.slug,
        description: sDef.description,
        category: sDef.category,
        orderIndex: sDef.orderIndex,
        createdAt: '2026-11-17T00:00:00.000Z',
        updatedAt: '2026-11-17T00:00:00.000Z'
      };
      seed.series.push(sObj);
    }

    const manifestPath = path.join(rootDir, sDef.manifest);
    try {
      const mRaw = await readFile(manifestPath, 'utf-8');
      const items = JSON.parse(mRaw);

      for (const it of items) {
        const lectureId = `${sDef.slug}-${String(it.lesson_num).padStart(2, '0')}`;
        const mediaId = `media-${lectureId}`;

        const mediaIdx = seed.media.findIndex(m => m.id === mediaId || m.url === it.url);
        const mediaObj = {
          id: mediaId,
          type: 'audio',
          url: it.url,
          path: `public${it.url}`,
          mimeType: 'audio/mpeg',
          fileSize: it.file_size,
          duration: it.duration,
          createdAt: '2026-11-17T00:00:00.000Z',
          updatedAt: '2026-11-17T00:00:00.000Z'
        };
        if (mediaIdx >= 0) {
          seed.media[mediaIdx] = { ...seed.media[mediaIdx], ...mediaObj };
        } else {
          seed.media.push(mediaObj);
        }

        const lectureIdx = seed.lectures.findIndex(l => l.id === lectureId || l.slug === it.slug);
        const lectureObj = {
          id: lectureId,
          title: it.title,
          titleAm: it.title,
          titleAr: null,
          slug: it.slug,
          description: `${sDef.titleAm} — ክፍል ${it.lesson_num}`,
          category: sDef.category,
          seriesId: sDef.id,
          orderInSeries: it.lesson_num,
          mediaRefId: mediaId,
          notes: null,
          slidesRefId: null,
          transcriptionId: null,
          createdAt: '2026-11-17T00:00:00.000Z',
          updatedAt: '2026-11-17T00:00:00.000Z'
        };

        if (lectureIdx >= 0) {
          seed.lectures[lectureIdx] = { ...seed.lectures[lectureIdx], ...lectureObj };
          totalUpdated++;
        } else {
          seed.lectures.push(lectureObj);
          totalAdded++;
        }
      }
    } catch (e) {
      console.warn(`Manifest ${sDef.manifest} not found or skipped: ${e.message}`);
    }
  }

  // Standalone Lectures
  try {
    const sManifest = path.join(rootDir, 'data/standalone-lectures-manifest.json');
    const smRaw = await readFile(sManifest, 'utf-8');
    const sItems = JSON.parse(smRaw);

    for (const it of sItems) {
      const lectureId = `lecture-standalone-${String(it.lesson_num).padStart(2, '0')}`;
      const mediaId = `media-${lectureId}`;

      const mediaIdx = seed.media.findIndex(m => m.id === mediaId || m.url === it.url);
      const mediaObj = {
        id: mediaId,
        type: 'audio',
        url: it.url,
        path: `public${it.url}`,
        mimeType: 'audio/mpeg',
        fileSize: it.file_size,
        duration: it.duration,
        createdAt: '2026-11-17T00:00:00.000Z',
        updatedAt: '2026-11-17T00:00:00.000Z'
      };
      if (mediaIdx >= 0) {
        seed.media[mediaIdx] = { ...seed.media[mediaIdx], ...mediaObj };
      } else {
        seed.media.push(mediaObj);
      }

      const lectureIdx = seed.lectures.findIndex(l => l.id === lectureId || l.slug === it.slug);
      const lectureObj = {
        id: lectureId,
        title: it.title,
        titleAm: it.title,
        titleAr: null,
        slug: it.slug,
        description: `የሸይኽ ሙሐመድ ፈረጅ ሙሀደራ — ${it.title}`,
        category: 'general',
        seriesId: null,
        orderInSeries: it.lesson_num,
        mediaRefId: mediaId,
        notes: null,
        slidesRefId: null,
        transcriptionId: null,
        createdAt: '2026-11-17T00:00:00.000Z',
        updatedAt: '2026-11-17T00:00:00.000Z'
      };

      if (lectureIdx >= 0) {
        seed.lectures[lectureIdx] = { ...seed.lectures[lectureIdx], ...lectureObj };
        totalUpdated++;
      } else {
        seed.lectures.push(lectureObj);
        totalAdded++;
      }
    }
  } catch (e) {
    console.warn(`Standalone lectures manifest not processed yet: ${e.message}`);
  }

  await writeFile(SEED_FILE, JSON.stringify(seed, null, 2) + '\n', 'utf-8');

  // Bump SEED_VERSION_KEY in repository.ts
  const newVersionKey = `_seed_version_20261117_final_all_audio_${Date.now()}`;
  let repoCode = await readFile(REPO_FILE, 'utf-8');
  repoCode = repoCode.replace(/const SEED_VERSION_KEY = ['"][^'"]+['"];/, `const SEED_VERSION_KEY = "${newVersionKey}";`);
  await writeFile(REPO_FILE, repoCode, 'utf-8');

  console.log(`Root Series Ingestion Complete:`);
  console.log(`  Added:   ${totalAdded}`);
  console.log(`  Updated: ${totalUpdated}`);
  console.log(`  Total Lectures: ${seed.lectures.length}`);
  console.log(`  Total Series:   ${seed.series.length}`);
  console.log(`  Total Media:    ${seed.media.length}`);
  console.log(`  Version Key:    ${newVersionKey}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
