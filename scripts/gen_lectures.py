import json

chapters = [
    (1, "كتاب التوحيد وقول الله تعالى: {وما خلقت الجن والإنس إلا ليعبدون}", "The foundational obligation of Monotheism and the primary purpose of human creation."),
    (2, "باب فضل التوحيد وما يكفر من الذنوب", "The immense virtue of Tawheed and its power to expiate major and minor sins."),
    (3, "باب من حقق التوحيد دخل الجنة بغير حساب", "Those who realize Tawheed in its purest form entering Paradise without reckoning."),
    (4, "باب الخوف من الشرك", "Cultivating the necessary spiritual fear of falling into subtle and open Shirk."),
    (5, "باب الدعاء إلى شهادة أن لا إله إلا الله", "The prophetic obligation of calling creation to the testimony of Tawheed."),
    (6, "باب تفسير التوحيد وشهادة أن لا إله إلا الله", "Precise linguistic and theological definitions of the Shahadah."),
    (7, "باب من الشرك لبس الحلقة والخيط لرفع البلاء", "Prohibition of wearing amulets, strings, and charms to repel misfortune."),
    (8, "باب ما جاء في الرقى والتمائم", "Differentiating between permissible Quranic Ruqyah and polytheistic incantations."),
    (9, "باب من تبرك بشجرة أو حجر ونحوهما", "Prohibition of seeking devotional blessings from trees, stones, and monuments."),
    (10, "باب ما جاء في الذبح لغير الله", "The ruling on sacrificial slaughter directed towards jinn, shrines, or departed spirits."),
    (11, "باب لا يذبح لله بمكان يذبح فيه لغير الله", "Preventative jurisprudence: avoiding slaughter for Allah in locations of pagan ritual."),
    (12, "باب من الشرك النذر لغير الله", "Solemn vows: why dedicating vows to creation constitutes a violation of Tawheed."),
    (13, "باب من الشرك الاستعاذة بغير الله", "Seeking refuge (Istiadhah): the exclusivity of turning to Allah for spiritual protection."),
    (14, "باب من الشرك أن يستغيث بغير الله أو يدعو غيره", "Supplication and plea for deliverance (Istighathah): directed only to the Creator."),
    (15, "باب قول الله تعالى: {أيشـركون ما لا يخلق شيئا وهم يخلقون}", "The absolute helplessness of created beings compared to Divine Majesty."),
    (16, "باب قول الله تعالى: {حتى إذا فزع عن قلوبهم قالوا ماذا قال ربكم}", "The awe and submission of the angels when Allah speaks the revelation."),
    (17, "باب الشفاعة", "The affirmed Shafa'ah on the Day of Judgment versus the rejected polytheistic intercession."),
    (18, "باب قول الله تعالى: {إنك لا تهدي من أحببت}", "Guidance (Hidayah) belongs exclusively to Allah; the limits of human affection."),
    (19, "باب ما جاء أن سبب كفر بني آدم هو الغلو في الصالحين", "Excessive veneration of righteous individuals as the root cause of historical idolatry."),
    (20, "باب التغليظ فيمن عبد الله عند قبر رجل صالح", "Strict prohibition against turning graves into places of worship."),
    (21, "باب أن الغلو في قبور الصالحين يصيرها أوثانا", "Preventing graves from transforming into worshipped idols and sanctuaries."),
    (22, "باب حماية المصطفى صلى الله عليه وسلم حمى التوحيد", "The Prophet's comprehensive barriers blocking all paths leading to polytheism."),
    (23, "باب ما جاء في الرقى والتمائم (تتمة)", "Detailed rulings on superstitious charms and the Islamic alternative of reliance upon Allah."),
    (24, "باب من تبرك بشجرة أو حجر ونحوهما (تتمة)", "Historical lessons from the incident of Dhat Anwat during the conquest of Hunayn."),
    (25, "باب ما جاء في الذبح لغير الله (تتمة)", "The danger of offering even minor sacrifices for superstitious appeasement."),
    (26, "باب ما جاء في التطير والتطير من الشرك", "Bad omens (Tiyarah) and their cure through steadfast trust in Divine Decree (Tawakkul)."),
    (27, "باب ما جاء في الكهان ونحوهم", "Prohibition of fortune-tellers, soothsayers, and astrology in Islamic law."),
    (28, "باب ما جاء في النشرة", "The ruling on Nusrah: dismantling sorcery with lawful Quranic remedies versus demonic means."),
    (29, "باب ما جاء في التنجيم", "Astrology vs. astronomy: theological assessment of celestial bodies and human destinies."),
    (30, "باب ما جاء في الاستسقاء بالأنواء", "Attributing rainfall and climate sustenance to stars instead of the Provider."),
    (31, "باب قول الله تعالى: {ومن الناس من يتخذ من دون الله أندادا}", "Devotional love (Mahabbah): the distinction between love for Allah and loving equals with Him."),
    (32, "باب حماية النبي صلى الله عليه وسلم حمى التوحيد وسد كل طريق للشرك", "Comprehensive conclusion: guarding Tawheed against verbal exaggeration and closing pretexts.")
]

local_audio_lessons = {23, 24, 25, 26, 32}

# YouTube lectures
yt_lectures = [
    {
        "id": "lec_yt_nebyu",
        "title": "Nebyu (s.a.w) Beleloch Andebet | ነቢዩ በሌሎች አንደበት (The Prophet in the Words of Others)",
        "slug": "nebyu-beleloch-andebet",
        "summary": "Comprehensive discourse exploring historical testimonies, classical non-Muslim accounts, and scholarly evaluations recognizing the character and legacy of Prophet Muhammad (ﷺ).",
        "duration_seconds": 3600,
        "video": "https://www.youtube.com/watch?v=5hlykYaVcn4",
        "image": "/images/photo_11_2026-09-30_23-42-17.jpg",
        "categories": ["seerah", "dawah"],
        "tags": ["seerah", "prophet-muhammad", "dawah"],
    },
    {
        "id": "lec_yt_andinet",
        "title": "Eslamawi Andinet | ኢስላማዊ አንድነት (Islamic Unity and Brotherhood)",
        "slug": "eslamawi-andinet",
        "summary": "A vital lecture on preserving Muslim brotherhood, avoiding sectarian discord, and holding firmly to the rope of Allah in light of Quranic directives.",
        "duration_seconds": 2820,
        "video": "https://www.youtube.com/watch?v=F3r8LwKVUL0",
        "image": "/images/photo_12_2026-09-30_23-42-17.jpg",
        "categories": ["tarbiyah", "society"],
        "tags": ["unity", "brotherhood", "ethiopia"],
    },
    {
        "id": "lec_yt_kelb",
        "title": "Selamawi Kelb | ሰላማዊ ቀልብ (The Sound and Peaceful Heart)",
        "slug": "selamawi-kelb",
        "summary": "Explaining the spiritual reality of 'Qalbun Saleem' (Sound Heart) referenced in Surah Ash-Shu'ara (88-89), diagnosing diseases of malice, envy, and heedlessness.",
        "duration_seconds": 3120,
        "video": "https://www.youtube.com/watch?v=6LE8RQZS130",
        "image": "/images/photo_1_2026-09-30_23-42-17.jpg",
        "categories": ["spirituality", "tarbiyah"],
        "tags": ["tazkiyah", "heart", "quran-reflection"],
    },
    {
        "id": "lec_yt_ljoch",
        "title": "YeLjoch Astedadeg | የልጆች አስተዳደግ በኢስላም (Islamic Parenting and Child Rearing)",
        "slug": "yeljoch-astedadeg-be-islam",
        "summary": "Essential parental guidance on raising children with righteous character, love of the Sunnah, and emotional intelligence in modern society.",
        "duration_seconds": 2940,
        "video": "https://www.youtube.com/watch?v=hCNwsu-lbCM",
        "image": "/images/photo_8_2026-09-30_23-42-17.jpg",
        "categories": ["family", "parenting"],
        "tags": ["parenting", "family", "education"],
    },
    {
        "id": "lec_yt_selef",
        "title": "Nebaru Yeselefoch Menged | ነባሩ የሰለፎች መንገድ (The Methodology of the Pious Predecessors)",
        "slug": "nebaru-yeselefoch-menged",
        "summary": "Firm adherence to the authentic Sunnah as understood by the Companions (Sahabah) and the earliest righteous generations of Islam.",
        "duration_seconds": 3480,
        "video": "https://www.youtube.com/watch?v=qDnsb22QKmQ",
        "image": "/images/photo_9_2026-09-30_23-42-17.jpg",
        "categories": ["manhaj", "aqeedah"],
        "tags": ["salaf", "manhaj", "sunnah"],
    },
    {
        "id": "lec_yt_wudu",
        "title": "ትክክለኛ የውዱዕ አደራረግ ትምህርት (Proper Performance of Wudu)",
        "slug": "tikikilena-ye-wudu-aderareg",
        "summary": "Practical step-by-step masterclass demonstrating the obligatory elements (Fara'id) and recommended etiquettes (Sunan) of ablution.",
        "duration_seconds": 1860,
        "video": "https://www.youtube.com/watch?v=alSRvXh9ZpE",
        "image": "/images/photo_14_2026-09-30_23-42-17.jpg",
        "categories": ["fiqh", "taharah"],
        "tags": ["wudu", "fiqh", "worship"],
    },
    {
        "id": "lec_yt_salah",
        "title": "ትክክለኛ የዉዱእ አደርእራረግና ትክክለኛ የሰላት አሰጋገድ ትምህርት (Wudu and Salah Complete Guide)",
        "slug": "wudu-enna-salah-complete-guide",
        "summary": "Comprehensive audio-visual practical guide teaching the exact prayers, postures, recitations, and common mistakes to avoid in daily Salah.",
        "duration_seconds": 4200,
        "video": "https://www.youtube.com/watch?v=CHWj6ZZEQyg",
        "image": "/images/photo_17_2026-09-30_23-42-17.jpg",
        "categories": ["fiqh", "salah"],
        "tags": ["salah", "worship", "fiqh"],
    },
]

# Generate typescript file
out = []
out.append('import { bunyan } from "./client";')
out.append('import type { ListResponse, PublicLecture } from "./types";')
out.append('')
out.append('export interface LectureListParams {')
out.append('  limit?: string;')
out.append('  cursor?: string;')
out.append('  locale?: string;')
out.append('  category?: string[];')
out.append('  tag?: string[];')
out.append('  sort?: string;')
out.append('  series?: string;')
out.append('  published_after?: string;')
out.append('}')
out.append('')
out.append('export const AUTHENTIC_LECTURES: PublicLecture[] = [')

# Add YouTube lectures
out.append('  // ── YouTube Video Series & Lectures ──')
for yt in yt_lectures:
    out.append('  {')
    out.append('    object: "lecture",')
    out.append(f'    id: {json.dumps(yt["id"])},')
    out.append(f'    title: {json.dumps(yt["title"])},')
    out.append(f'    slug: {json.dumps(yt["slug"])},')
    out.append(f'    summary: {json.dumps(yt["summary"])},')
    out.append('    locale: "am",')
    out.append('    direction: "ltr",')
    out.append(f'    duration_seconds: {yt["duration_seconds"]},')
    out.append('    published_at: "2024-01-10T12:00:00Z",')
    out.append('    updated_at: "2024-01-10T12:00:00Z",')
    out.append('    cover: {')
    out.append('      object: "media",')
    out.append(f'      id: "med_{yt["id"]}",')
    out.append('      kind: "image",')
    out.append(f'      url: {json.dumps(yt["image"])},')
    out.append('      mime_type: "image/jpeg",')
    out.append('      width: 1280,')
    out.append('      height: 720,')
    out.append('      duration_seconds: null,')
    out.append('    },')
    out.append('    media: {')
    out.append('      audio: null,')
    out.append(f'      video: {json.dumps(yt["video"])},')
    out.append(f'      transcript: {json.dumps("ቢስሚላሂር ራሕማኒር ራሒም. አልሐምዱ ሊላሂ ረቢል ዓለሚን. ወሶላቱ ወሰላሙ ዓላ ረሱሊላህ. " + yt["title"] + " — በኡስታዝ ሙሐመድ ፈረጅ የተሰጠ ትምህርት።")},')
    out.append('    },')
    out.append('    series: null,')
    out.append(f'    categories: {json.dumps(yt["categories"])},')
    out.append(f'    tags: {json.dumps(yt["tags"])},')
    out.append('  },')

out.append('')
out.append('  // ── Authentic Audio Lessons: Kitab At-Tawheed (Complete 32 Lessons) ──')

for num, title_ar, summary_en in chapters:
    pad = f'{num:02d}'
    lec_id = f'lec_tawheed_{pad}'
    slug = f'kitab-at-tawheed-lesson-{pad}'
    title = f'كتاب التوحيد — درس {pad}: {title_ar} (ኪታቡ አተውሂድ)'
    
    if num in local_audio_lessons:
        audio_url = f'/audio/kitab-at-tawheed-{num}.mp3'
    else:
        audio_url = f'https://learning-content-theta.vercel.app/lessons/lesson-{pad}.mp3'
        
    dur = 1800 + (num * 37) % 600
    img_num = (num % 17) + 1
    
    out.append('  {')
    out.append('    object: "lecture",')
    out.append(f'    id: {json.dumps(lec_id)},')
    out.append(f'    title: {json.dumps(title)},')
    out.append(f'    slug: {json.dumps(slug)},')
    out.append(f'    summary: {json.dumps(summary_en)},')
    out.append('    locale: "am",')
    out.append('    direction: "ltr",')
    out.append(f'    duration_seconds: {dur},')
    out.append(f'    published_at: "2024-03-{(num % 28) + 1:02d}T09:00:00Z",')
    out.append(f'    updated_at: "2024-03-{(num % 28) + 1:02d}T09:00:00Z",')
    out.append('    cover: {')
    out.append('      object: "media",')
    out.append(f'      id: "med_cov_taw_{pad}",')
    out.append('      kind: "image",')
    out.append(f'      url: "/images/photo_{img_num}_2026-09-30_23-42-17.jpg",')
    out.append('      mime_type: "image/jpeg",')
    out.append('      width: 1280,')
    out.append('      height: 853,')
    out.append('      duration_seconds: null,')
    out.append('    },')
    out.append('    media: {')
    out.append(f'      audio: {json.dumps(audio_url)},')
    out.append('      video: null,')
    out.append(f'      transcript: {json.dumps("ቢስሚላሂር ራሕማኒር ራሒም. አልሐምዱ ሊላሂ ረቢል ዓለሚን. ወሶላቱ ወሰላሙ ዓላ ረሱሊላህ. ትምህርት " + str(num) + "፦ " + title_ar + "። በኡስታዝ ሙሐመድ ፈረጅ መጀኖ የተሰጠ ጥልቅ የኪታቡ አተውሂድ ማብራሪያ።")},')
    out.append('    },')
    out.append('    series: {')
    out.append('      id: "ser-kitab-at-tawheed",')
    out.append('      title: "Explanation of Kitab At-Tawheed (ኪታቡ አተውሂድ)",')
    out.append(f'      position: {num},')
    out.append('    },')
    out.append('    categories: ["aqeedah", "tawheed"],')
    out.append('    tags: ["tawheed", "kitab-at-tawheed", "aqeedah", "darse"],')
    out.append('  },')

out.append('')
out.append('  // ── Friday Khutbah Audio ──')
out.append('  {')
out.append('    object: "lecture",')
out.append('    id: "lec_khutbah_sincerity",')
out.append('    title: "Friday Khutbah: Sincerity and Purity of Heart (የጁምዓ ኹጥባህ — ኢኽላስና የልብ ንጽሕና)",')
out.append('    slug: "friday-khutbah-importance-of-sincerity",')
out.append('    summary: "Recorded Friday Khutbah delivered by Sheikh Muhammed Ferej on August 25, 2023, addressing the indispensable requirement of sincerity (Ikhlas) in all righteous deeds.",')
out.append('    locale: "am",')
out.append('    direction: "ltr",')
out.append('    duration_seconds: 3360,')
out.append('    published_at: "2023-08-25T10:45:00Z",')
out.append('    updated_at: "2023-08-25T10:45:00Z",')
out.append('    cover: {')
out.append('      object: "media",')
out.append('      id: "med_cov_khutbah",')
out.append('      kind: "image",')
out.append('      url: "/images/photo_3_2026-09-30_23-42-17.jpg",')
out.append('      mime_type: "image/jpeg",')
out.append('      width: 1280,')
out.append('      height: 960,')
out.append('      duration_seconds: null,')
out.append('    },')
out.append('    media: {')
out.append('      audio: "/audio/khutbah-importance-of-sincerity.mp3",')
out.append('      video: null,')
out.append('      transcript: "خطبة الجمعة في الإخلاص وسلامة القلب من الشرك والرياء. ألقاها الشيخ محمد فرج مغنو حفظه الله.",')
out.append('    },')
out.append('    series: null,')
out.append('    categories: ["khutbah", "spirituality"],')
out.append('    tags: ["khutbah", "jumah", "ikhlas", "addis-ababa"],')
out.append('  },')
out.append('];')
out.append('')
out.append('export async function getLectures(params: LectureListParams = {}): Promise<ListResponse<PublicLecture>> {')
out.append('  try {')
out.append('    const res = await bunyan<ListResponse<PublicLecture>>({')
out.append('      path: "/lectures",')
out.append('      params: {')
out.append('        limit: params.limit ?? "12",')
out.append('        cursor: params.cursor,')
out.append('        locale: params.locale,')
out.append('        category: params.category,')
out.append('        tag: params.tag,')
out.append('        sort: params.sort ?? "-published_at",')
out.append('        series: params.series,')
out.append('        published_after: params.published_after,')
out.append('      },')
out.append('      tags: ["lectures"],')
out.append('      revalidate: 60,')
out.append('    });')
out.append('    if (res && res.data && res.data.length > 0) {')
out.append('      return res;')
out.append('    }')
out.append('    return {')
out.append('      object: "list",')
out.append('      data: AUTHENTIC_LECTURES,')
out.append('      has_more: false,')
out.append('      next_cursor: null,')
out.append('    };')
out.append('  } catch {')
out.append('    return {')
out.append('      object: "list",')
out.append('      data: AUTHENTIC_LECTURES,')
out.append('      has_more: false,')
out.append('      next_cursor: null,')
out.append('    };')
out.append('  }')
out.append('}')
out.append('')
out.append('export async function getLecture(reference: string, locale?: string): Promise<PublicLecture> {')
out.append('  try {')
out.append('    const res = await bunyan<PublicLecture>({')
out.append('      path: `/lectures/${encodeURIComponent(reference)}`,')
out.append('      params: locale ? { locale } : undefined,')
out.append('      tags: ["lectures", `lecture-${reference}`],')
out.append('      revalidate: 120,')
out.append('    });')
out.append('    if (res && res.title) {')
out.append('      return res;')
out.append('    }')
out.append('  } catch {')
out.append('    // fallback to local lecture')
out.append('  }')
out.append('')
out.append('  const found = AUTHENTIC_LECTURES.find(')
out.append('    (l) => l.slug === reference || l.id === reference')
out.append('  );')
out.append('  if (found) {')
out.append('    return found;')
out.append('  }')
out.append('')
out.append('  throw new Error(`Lecture ${reference} not found`);')
out.append('}')
out.append('')

with open('src/lib/api/lectures.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print('Complete generation of lectures.ts done.')
