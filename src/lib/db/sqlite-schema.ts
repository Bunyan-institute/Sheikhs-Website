import { execute, queryAll, queryOne, batch } from "./sqlite-client";

const MIGRATION_1: string[] = [
  // 1. Scholar Identity & Profile
  `CREATE TABLE IF NOT EXISTS scholar_profile (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    name TEXT NOT NULL,
    headline TEXT,
    biography TEXT,
    languages_json TEXT,
    location TEXT,
    photo_json TEXT,
    sections_json TEXT,
    socials_json TEXT,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    updated_at TEXT NOT NULL
  );`,

  // 2. Dawah Journey Milestones
  `CREATE TABLE IF NOT EXISTS journey_milestones (
    id TEXT PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    institution TEXT,
    description TEXT,
    type TEXT DEFAULT 'contribution',
    position INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );`,

  // 3. Qualifications & Ijazahs
  `CREATE TABLE IF NOT EXISTS qualifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT DEFAULT 'academic',
    description TEXT,
    position INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );`,

  // 4. Lecture Series
  `CREATE TABLE IF NOT EXISTS series (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    cover_json TEXT,
    lecture_count INTEGER DEFAULT 0,
    published_at TEXT,
    updated_at TEXT NOT NULL,
    lectures_json TEXT
  );`,

  // 5. Recorded Halaqat Lectures
  `CREATE TABLE IF NOT EXISTS lectures (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    duration_seconds INTEGER,
    published_at TEXT,
    updated_at TEXT NOT NULL,
    cover_json TEXT,
    media_json TEXT,
    series_json TEXT,
    categories_json TEXT,
    tags_json TEXT,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr'
  );`,

  // 6. Scholarly Articles & Research
  `CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body TEXT,
    reading_minutes INTEGER DEFAULT 5,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    cover_json TEXT,
    categories_json TEXT,
    tags_json TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 7. Issued Fiqh & AAOIFI Fatwas
  `CREATE TABLE IF NOT EXISTS fatwas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    question TEXT,
    answer TEXT,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    categories_json TEXT,
    tags_json TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 8. Academic Courses & Curriculum
  `CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    enrolment_open INTEGER DEFAULT 1,
    lesson_count INTEGER DEFAULT 0,
    lessons_json TEXT,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    cover_json TEXT,
    categories_json TEXT,
    tags_json TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 9. Course Exam Configurations
  `CREATE TABLE IF NOT EXISTS course_exams (
    course_slug TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    passing_percentage INTEGER DEFAULT 70,
    questions_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  // 10. Student Course Enrollments
  `CREATE TABLE IF NOT EXISTS course_enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    course_slug TEXT NOT NULL,
    course_title TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    city TEXT,
    status TEXT DEFAULT 'enrolled',
    completed_lessons_json TEXT,
    exam_attempts_json TEXT,
    certificate_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  // 11. Issued Certificates Registry
  `CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    verification_token TEXT NOT NULL,
    course_id TEXT NOT NULL,
    course_slug TEXT NOT NULL,
    course_title TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    score_percentage REAL NOT NULL,
    grade_title TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    hijri_date TEXT,
    instructor_name TEXT DEFAULT 'Sheikh Muhammed Ferej Megeno',
    authority_seal TEXT,
    revoked INTEGER DEFAULT 0,
    revoked_reason TEXT
  );`,

  // 12. Kitabs & Library Documents
  `CREATE TABLE IF NOT EXISTS library_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    author TEXT,
    publisher TEXT,
    year INTEGER,
    isbn TEXT,
    kind TEXT DEFAULT 'document',
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    cover_json TEXT,
    file_json TEXT,
    external_url TEXT,
    categories_json TEXT,
    tags_json TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 13. Events & Khutbahs
  `CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    starts_at TEXT NOT NULL,
    ends_at TEXT,
    timezone TEXT DEFAULT 'Africa/Addis_Ababa',
    venue_name TEXT,
    venue_address TEXT,
    online_url TEXT,
    registration_required INTEGER DEFAULT 0,
    capacity INTEGER,
    locale TEXT DEFAULT 'am',
    direction TEXT DEFAULT 'ltr',
    cover_json TEXT,
    categories_json TEXT,
    tags_json TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 14. Event Registrations
  `CREATE TABLE IF NOT EXISTS event_registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    event_slug TEXT NOT NULL,
    event_title TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    attendees_count INTEGER DEFAULT 1,
    notes TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TEXT NOT NULL
  );`,

  // 15. Media Asset Gallery
  `CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    kind TEXT DEFAULT 'image',
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    duration_seconds REAL,
    created_at TEXT NOT NULL
  );`,

  // 16. Inquiries & Community Questions
  `CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    name TEXT,
    email TEXT,
    is_anonymous INTEGER DEFAULT 0,
    locale TEXT DEFAULT 'am',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    answer TEXT,
    created_at TEXT NOT NULL
  );`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_lectures_slug ON lectures(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_fatwas_slug ON fatwas(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_library_slug ON library_items(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);`,
  `CREATE INDEX IF NOT EXISTS idx_enrollments_email ON course_enrollments(student_email);`,
  `CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_email);`,
];

const MIGRATION_2: string[] = [
  // Admin-managed site-wide settings (socials, links, featured content, hadith band, ...)
  `CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
];

type Migration = string[] | (() => Promise<void>);

async function addColumnsIfMissing(table: string, columns: Record<string, string>) {
  const existing = new Set((await queryAll<{ name: string }>(`PRAGMA table_info(${table});`)).map((c) => c.name));
  for (const [name, type] of Object.entries(columns)) {
    if (!existing.has(name)) await execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${type};`);
  }
}

// Gallery / external-media entries need a title, blurb and thumbnail to be managed from admin.
// Older databases may already have some of these columns, so each is added only when missing.
const MIGRATION_3 = () =>
  addColumnsIfMissing("media_assets", { title: "TEXT", description: "TEXT", thumbnail_url: "TEXT" });

// Server-side admin sessions so logout / revocation is real (the cookie alone is not enough).
const MIGRATION_4: string[] = [
  `CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );`,
];

// Files uploaded from the admin (stored on disk under UPLOAD_DIR, tracked here).
const MIGRATION_5: string[] = [
  `CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    created_at TEXT NOT NULL
  );`,
];

// Draft/published workflow for admin-managed content.
const MIGRATION_6 = async () => {
  for (const table of ["lectures", "series", "articles", "fatwas", "courses", "library_items", "events"]) {
    await addColumnsIfMissing(table, { status: "TEXT NOT NULL DEFAULT 'published'" });
  }
};

const MIGRATIONS: Migration[] = [MIGRATION_1, MIGRATION_2, MIGRATION_3, MIGRATION_4, MIGRATION_5, MIGRATION_6];

/** Re-runs the base CREATE ... IF NOT EXISTS statements (used after a legacy table is set aside). */
export async function createMissingTables(): Promise<void> {
  await batch(MIGRATION_1.map((sql) => ({ sql, args: [] })));
}

let migrated: Promise<void> | null = null;

/**
 * Applies pending schema migrations once per process. The applied version is tracked
 * in schema_version so new columns/tables can be shipped as additional migrations.
 */
export function ensureTablesExist(): Promise<void> {
  if (!migrated) {
    migrated = runMigrations().catch((err) => {
      migrated = null;
      throw err;
    });
  }
  return migrated;
}

async function runMigrations(): Promise<void> {
  await execute("CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);");
  const row = await queryOne<{ version: number }>("SELECT max(version) AS version FROM schema_version;");
  const current = Number(row?.version ?? 0);
  for (let v = current; v < MIGRATIONS.length; v++) {
    const migration = MIGRATIONS[v];
    if (typeof migration === "function") {
      await migration();
      await execute("INSERT INTO schema_version (version) VALUES (?);", [v + 1]);
    } else {
      await batch([
        ...migration.map((sql) => ({ sql, args: [] })),
        { sql: "INSERT INTO schema_version (version) VALUES (?);", args: [v + 1] },
      ]);
    }
  }
}
