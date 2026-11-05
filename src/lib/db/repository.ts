import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { execute, queryAll, queryOne, batch, dialect, tableColumns, type Statement, type DbValue } from "./client";
import { ensureTablesExist, createMissingTables } from "./sqlite-schema";
import { UserError } from "@/lib/user-error";
import type {
  InquiryRecord,
  JourneyMilestone,
  QualificationRecord,
  EventRegistrationRecord,
  CourseEnrollmentRecord,
  CourseExamConfig,
  IssuedCertificateRecord,
  PortalDatabase,
} from "./types";
import type {
  PublicLecture,
  PublicSeries,
  PublicArticle,
  PublicFatwa,
  PublicCourse,
  PublicBook,
  PublicEvent,
  PublicProfile,
  MediaRef,
} from "@/lib/api/types";

type Row = Record<string, unknown>;

// ── Helpers ──

const nowIso = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
const str = (v: unknown): string | null => (v === null || v === undefined ? null : String(v));
const num = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
const dir = (v: unknown): "ltr" | "rtl" => (v === "rtl" ? "rtl" : "ltr");

function json<T>(v: unknown, fallback: T): T {
  if (typeof v !== "string" || v === "") return fallback;
  try {
    const parsed = JSON.parse(v);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function revalidate() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Not inside a request/action context (seed, scripts)
  }
}

// ── Readiness: migrations + first-run seed ──

const SEEDED_KEY = "_seeded";
const SEEDING_KEY = "_seeding";
let readyPromise: Promise<void> | null = null;

/**
 * Resolves once the schema is migrated and a brand-new database has been seeded.
 * Every repository function awaits this, so SQLite is always the single source of truth.
 */
export function ready(): Promise<void> {
  if (!readyPromise) {
    readyPromise = initialize().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }
  return readyPromise;
}

async function initialize() {
  const t0 = Date.now();
  const lap = (m: string) => console.log(`[db-debug] ${m} +${Date.now() - t0}ms`);
  await ensureTablesExist();
  lap("tables ensured");
  await repairLegacyTables();
  lap("repair done");
  const marker = await queryOne("SELECT key FROM site_settings WHERE key = ?;", [SEEDED_KEY]);
  lap("marker checked");
  if (marker) return;

  // Several serverless instances can cold-start together: one claims the seeding, the others wait for it.
  const claimed =
    (await execute(
      "INSERT INTO site_settings (key, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT (key) DO NOTHING;",
      [SEEDING_KEY, "true", nowIso()]
    )).rowsAffected > 0;
  if (!claimed) {
    for (let i = 0; i < 80; i++) {
      if (await queryOne("SELECT key FROM site_settings WHERE key = ?;", [SEEDED_KEY])) return;
      await new Promise((r) => setTimeout(r, 500));
    }
    // The claiming instance never finished; seeding is idempotent, so carry on.
  }

  const counts = await queryOne<{ n: number }>(
    "SELECT (SELECT count(*) FROM lectures) + (SELECT count(*) FROM scholar_profile) AS n;"
  );
  if (Number(counts?.n ?? 0) === 0) {
    const seed = (await import("./seed/content-seed.json")).default as unknown as PortalDatabase;
    await writeAll(seed, false);
  }
  await execute(upsertSql("site_settings", ["key", "value_json", "updated_at"], "key"), [
    SEEDED_KEY,
    "true",
    nowIso(),
  ]);
}

/**
 * Databases created by earlier versions of the app can have different columns on the content
 * tables. Any such table is set aside as legacy_<name>, recreated with the current schema and
 * refilled from the bundled seed, so every environment converges on the same shape.
 */
async function repairLegacyTables() {
  if (dialect !== "sqlite") return; // Postgres databases are always created from the current schema.
  const expected: Record<string, string[]> = {
    scholar_profile: profileCols,
    series: seriesDef.cols,
    fatwas: fatwaDef.cols,
    courses: courseDef.cols,
    library_items: bookDef.cols,
    events: eventDef.cols,
  };
  const rebuilt = new Set<string>();
  for (const [table, cols] of Object.entries(expected)) {
    const actual = new Set(await tableColumns(table));
    if (cols.every((c) => actual.has(c))) continue;
    console.warn(`[db] Table ${table} uses an outdated schema; rebuilding it (old rows kept in legacy_${table}).`);
    await execute(`DROP TABLE IF EXISTS legacy_${table};`);
    await execute(`ALTER TABLE ${table} RENAME TO legacy_${table};`);
    rebuilt.add(table);
  }
  if (rebuilt.size === 0) return;
  const legacyIndexes = await queryAll<Row>(
    "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name LIKE 'legacy\\_%' ESCAPE '\\' AND name NOT LIKE 'sqlite_%';"
  );
  for (const idx of legacyIndexes) await execute(`DROP INDEX IF EXISTS ${String(idx.name)};`);
  await createMissingTables();
  const seed = (await import("./seed/content-seed.json")).default as unknown as PortalDatabase;
  await writeAll(seed, false, rebuilt);
}

// ── Generic entity table mapping ──

interface Entity<T extends { id: string }> {
  table: string;
  cols: string[];
  toArgs: (t: T) => DbValue[];
  fromRow: (r: Row) => T;
  order: string;
  /** Prefix for generated ids */
  prefix: string;
}

/** Portable upsert (works on SQLite and Postgres): insert, or update every non-key column on conflict. */
function upsertSql(table: string, cols: string[], key: string | string[] = "id"): string {
  const keys = Array.isArray(key) ? key : [key];
  const updates = cols.filter((c) => !keys.includes(c)).map((c) => `${c} = excluded.${c}`).join(", ");
  return `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders(cols.length)}) ON CONFLICT (${keys.join(", ")}) DO UPDATE SET ${updates};`;
}

interface TableRows {
  cols: string[];
  key: string | string[];
  rows: DbValue[][];
}

/**
 * Bulk upsert: one multi-row statement per chunk instead of one statement per row. Round trips dominate
 * on a remote database, so this keeps seeding and restores fast. Duplicate keys collapse (last wins).
 */
function multiUpsert(table: string, t: TableRows): Statement[] {
  const keys = Array.isArray(t.key) ? t.key : [t.key];
  const keyIdx = keys.map((k) => t.cols.indexOf(k));
  const unique = new Map<string, DbValue[]>();
  for (const row of t.rows) unique.set(keyIdx.map((i) => String(row[i])).join("\u0000"), row);
  const rows = [...unique.values()];
  const updates = t.cols.filter((c) => !keys.includes(c)).map((c) => `${c} = excluded.${c}`).join(", ");
  const perStatement = Math.max(1, Math.floor(8000 / t.cols.length));
  const out: Statement[] = [];
  for (let i = 0; i < rows.length; i += perStatement) {
    const slice = rows.slice(i, i + perStatement);
    const values = slice.map(() => `(${placeholders(t.cols.length)})`).join(", ");
    out.push({
      sql: `INSERT INTO ${table} (${t.cols.join(", ")}) VALUES ${values} ON CONFLICT (${keys.join(", ")}) DO UPDATE SET ${updates};`,
      args: slice.flat(),
    });
  }
  return out;
}

function placeholders(n: number) {
  return Array.from({ length: n }, () => "?").join(", ");
}

function upsertStatement<T extends { id: string }>(def: Entity<T>, item: T): Statement {
  return {
    sql: upsertSql(def.table, def.cols),
    args: def.toArgs(item),
  };
}

async function listAll<T extends { id: string }>(def: Entity<T>): Promise<T[]> {
  await ready();
  const rows = await queryAll<Row>(`SELECT * FROM ${def.table} ORDER BY ${def.order};`);
  return rows.map(def.fromRow);
}

async function findOne<T extends { id: string }>(def: Entity<T>, key: string): Promise<T | null> {
  await ready();
  const row = await queryOne<Row>(`SELECT * FROM ${def.table} WHERE id = ? OR slug = ? LIMIT 1;`, [key, key]);
  return row ? def.fromRow(row) : null;
}

/** Upserts by id; a slug already used by a different record is rejected, never overwritten. */
async function upsert<T extends { id: string; slug: string }>(def: Entity<T>, item: T): Promise<T> {
  await ready();
  const clash = await queryOne("SELECT id FROM " + def.table + " WHERE slug = ? AND id <> ?;", [item.slug, item.id]);
  if (clash) {
    throw new UserError(`The slug "${item.slug}" is already used by another item.`);
  }
  await batch([upsertStatement(def, item)]);
  revalidate();
  return item;
}

async function remove(table: string, id: string, keyCol = "id"): Promise<boolean> {
  await ready();
  const res = await execute(`DELETE FROM ${table} WHERE ${keyCol} = ?;`, [id]);
  revalidate();
  return res.rowsAffected > 0;
}

// ── Lectures ──

const lectureDef: Entity<PublicLecture> = {
  table: "lectures",
  prefix: "lec",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "summary", "duration_seconds", "published_at", "updated_at", "cover_json", "media_json", "series_json", "categories_json", "tags_json", "locale", "direction", "status"],
  toArgs: (l) => [
    l.id, l.title, l.slug, l.summary, l.duration_seconds, l.published_at, l.updated_at,
    JSON.stringify(l.cover), JSON.stringify(l.media), JSON.stringify(l.series),
    JSON.stringify(l.categories), JSON.stringify(l.tags), l.locale, l.direction,
    l.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "lecture",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: str(r.summary),
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    duration_seconds: num(r.duration_seconds),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
    cover: json(r.cover_json, null),
    media: { audio: null, video: null, transcript: null, ...json<Partial<PublicLecture["media"]>>(r.media_json, {}) },
    series: json(r.series_json, null),
    categories: json(r.categories_json, []),
    tags: json(r.tags_json, []),
  }),
};

export const getAllLectures = () => listAll(lectureDef);
export const getLectureByIdOrSlug = (key: string) => findOne(lectureDef, key);

export function saveLecture(data: Partial<PublicLecture> & { title: string; slug: string }) {
  return upsert(lectureDef, {
    object: "lecture",
    id: data.id || newId("lec"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    duration_seconds: data.duration_seconds ?? null,
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
    cover: data.cover ?? null,
    media: {
      audio: data.media?.audio ?? null,
      video: data.media?.video ?? null,
      transcript: data.media?.transcript ?? null,
    },
    series: data.series ?? null,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
  });
}

export const deleteLecture = (id: string) => remove("lectures", id);

// ── Series ──

const seriesDef: Entity<PublicSeries> = {
  table: "series",
  prefix: "ser",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "description", "locale", "direction", "cover_json", "lecture_count", "published_at", "updated_at", "lectures_json", "status"],
  toArgs: (s) => [
    s.id, s.title, s.slug, s.description, s.locale, s.direction, JSON.stringify(s.cover),
    s.lecture_count, s.published_at, s.updated_at, "[]",
    s.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "series",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    description: str(r.description),
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    cover: json(r.cover_json, null),
    lecture_count: Number(r.lecture_count ?? 0),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
  }),
};

/** Series carry their lectures (ordered by position) so counts can never drift from the data. */
async function withLectures(list: PublicSeries[]): Promise<PublicSeries[]> {
  const lectures = await getAllLectures();
  return list.map((s) => {
    const own = lectures
      .filter((l) => l.series?.id === s.id)
      .sort((a, b) => (a.series?.position ?? 0) - (b.series?.position ?? 0));
    return { ...s, lecture_count: own.length, lectures: own };
  });
}

/** Updates (or, with a null title, detaches) the denormalised series reference stored on a series' lectures. */
async function relabelSeriesLectures(seriesId: string, title: string | null) {
  const rows = await queryAll<Row>("SELECT id, series_json FROM lectures;");
  const updates: Statement[] = [];
  for (const r of rows) {
    const ref = json<PublicLecture["series"]>(r.series_json, null);
    if (ref?.id !== seriesId) continue;
    updates.push({
      sql: "UPDATE lectures SET series_json = ? WHERE id = ?;",
      args: [JSON.stringify(title === null ? null : { ...ref, title }), String(r.id)],
    });
  }
  if (updates.length) await batch(updates);
}

export async function getAllSeries() {
  return withLectures(await listAll(seriesDef));
}

export async function getSeriesByIdOrSlug(key: string) {
  const s = await findOne(seriesDef, key);
  return s ? (await withLectures([s]))[0] : null;
}

export async function saveSeries(data: Partial<PublicSeries> & { title: string; slug: string }) {
  const saved = await upsert(seriesDef, {
    object: "series",
    id: data.id || newId("ser"),
    title: data.title,
    slug: data.slug,
    description: data.description ?? null,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    cover: data.cover ?? null,
    lecture_count: 0,
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
  // Keep the denormalised series title on its lectures in step with renames.
  await relabelSeriesLectures(saved.id, saved.title);
  return (await getSeriesByIdOrSlug(saved.id)) ?? saved;
}

export async function deleteSeries(id: string) {
  await ready();
  await relabelSeriesLectures(id, null);
  return remove("series", id);
}

// ── Articles ──

const articleDef: Entity<PublicArticle> = {
  table: "articles",
  prefix: "art",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "summary", "body", "reading_minutes", "locale", "direction", "cover_json", "categories_json", "tags_json", "published_at", "updated_at", "status"],
  toArgs: (a) => [
    a.id, a.title, a.slug, a.summary, a.body ?? "", a.reading_minutes ?? 5, a.locale, a.direction,
    JSON.stringify(a.cover), JSON.stringify(a.categories), JSON.stringify(a.tags), a.published_at, a.updated_at,
    a.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "article",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: str(r.summary),
    body: str(r.body),
    reading_minutes: num(r.reading_minutes),
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    cover: json(r.cover_json, null),
    categories: json(r.categories_json, []),
    tags: json(r.tags_json, []),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
  }),
};

export const getAllArticles = () => listAll(articleDef);
export const getArticleByIdOrSlug = (key: string) => findOne(articleDef, key);

export function saveArticle(data: Partial<PublicArticle> & { title: string; slug: string }) {
  return upsert(articleDef, {
    object: "article",
    id: data.id || newId("art"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    body: data.body ?? "",
    reading_minutes: data.reading_minutes ?? 5,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    cover: data.cover ?? null,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
}

export const deleteArticle = (id: string) => remove("articles", id);

// ── Fatwas ──

const fatwaDef: Entity<PublicFatwa> = {
  table: "fatwas",
  prefix: "fat",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "summary", "question", "answer", "locale", "direction", "categories_json", "tags_json", "published_at", "updated_at", "status"],
  toArgs: (f) => [
    f.id, f.title, f.slug, f.summary, f.question, f.answer ?? null, f.locale, f.direction,
    JSON.stringify(f.categories), JSON.stringify(f.tags), f.published_at, f.updated_at,
    f.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "fatwa",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: str(r.summary),
    question: str(r.question),
    answer: str(r.answer),
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    categories: json(r.categories_json, []),
    tags: json(r.tags_json, []),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
  }),
};

export const getAllFatwas = () => listAll(fatwaDef);
export const getFatwaByIdOrSlug = (key: string) => findOne(fatwaDef, key);

export function saveFatwa(data: Partial<PublicFatwa> & { title: string; slug: string }) {
  return upsert(fatwaDef, {
    object: "fatwa",
    id: data.id || newId("fat"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    question: data.question ?? null,
    answer: data.answer ?? null,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
}

export const deleteFatwa = (id: string) => remove("fatwas", id);

// ── Courses ──

const courseDef: Entity<PublicCourse> = {
  table: "courses",
  prefix: "cou",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "summary", "description", "enrolment_open", "lesson_count", "lessons_json", "locale", "direction", "cover_json", "categories_json", "tags_json", "published_at", "updated_at", "status"],
  toArgs: (c) => [
    c.id, c.title, c.slug, c.summary, c.description, c.enrolment_open ? 1 : 0, c.lesson_count,
    JSON.stringify(c.lessons ?? []), c.locale, c.direction, JSON.stringify(c.cover),
    JSON.stringify(c.categories), JSON.stringify(c.tags), c.published_at, c.updated_at,
    c.status ?? "published",
  ],
  fromRow: (r) => {
    const lessons = json<NonNullable<PublicCourse["lessons"]>>(r.lessons_json, []);
    return {
      object: "course",
      id: String(r.id),
      title: String(r.title),
      slug: String(r.slug),
      summary: str(r.summary),
      description: str(r.description),
      enrolment_open: Number(r.enrolment_open) === 1,
      lesson_count: lessons.length || Number(r.lesson_count ?? 0),
      lessons,
      locale: String(r.locale ?? "am"),
      direction: dir(r.direction),
      cover: json(r.cover_json, null),
      categories: json(r.categories_json, []),
      tags: json(r.tags_json, []),
      published_at: str(r.published_at),
      status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
    };
  },
};

export const getAllCourses = () => listAll(courseDef);
export const getCourseByIdOrSlug = (key: string) => findOne(courseDef, key);

export function saveCourse(data: Partial<PublicCourse> & { title: string; slug: string }) {
  const lessons = data.lessons ?? [];
  return upsert(courseDef, {
    object: "course",
    id: data.id || newId("cou"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    description: data.description ?? null,
    enrolment_open: data.enrolment_open ?? true,
    lesson_count: lessons.length || data.lesson_count || 0,
    lessons,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    cover: data.cover ?? null,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
}

export const deleteCourse = (id: string) => remove("courses", id);

/** Keeps exams and enrollments attached to a course when its slug changes. */
export async function renameCourseSlug(oldSlug: string, newSlug: string): Promise<void> {
  if (oldSlug === newSlug) return;
  await ready();
  await batch([
    { sql: "UPDATE course_exams SET course_slug = ? WHERE course_slug = ?;", args: [newSlug, oldSlug] },
    { sql: "UPDATE course_enrollments SET course_slug = ? WHERE course_slug = ?;", args: [newSlug, oldSlug] },
    { sql: "UPDATE certificates SET course_slug = ? WHERE course_slug = ?;", args: [newSlug, oldSlug] },
  ]);
}

// ── Library ──

const bookDef: Entity<PublicBook> = {
  table: "library_items",
  prefix: "bk",
  order: "published_at DESC NULLS LAST",
  cols: ["id", "title", "slug", "summary", "description", "author", "publisher", "year", "isbn", "kind", "locale", "direction", "cover_json", "file_json", "external_url", "categories_json", "tags_json", "published_at", "updated_at", "status"],
  toArgs: (b) => [
    b.id, b.title, b.slug, b.summary, b.description ?? null, b.author, b.publisher, b.year, b.isbn, b.kind,
    b.locale, b.direction, JSON.stringify(b.cover), JSON.stringify(b.file), b.external_url,
    JSON.stringify(b.categories), JSON.stringify(b.tags), b.published_at, b.updated_at,
    b.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "book",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: str(r.summary),
    description: str(r.description),
    author: str(r.author),
    publisher: str(r.publisher),
    year: num(r.year),
    isbn: str(r.isbn),
    kind: (r.kind as PublicBook["kind"]) ?? "document",
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    cover: json(r.cover_json, null),
    file: json(r.file_json, null),
    external_url: str(r.external_url),
    categories: json(r.categories_json, []),
    tags: json(r.tags_json, []),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
  }),
};

export const getAllBooks = () => listAll(bookDef);
export const getBookByIdOrSlug = (key: string) => findOne(bookDef, key);

export function saveBook(data: Partial<PublicBook> & { title: string; slug: string }) {
  return upsert(bookDef, {
    object: "book",
    id: data.id || newId("bk"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    description: data.description ?? null,
    author: data.author ?? null,
    publisher: data.publisher ?? null,
    year: data.year ?? null,
    isbn: data.isbn ?? null,
    kind: data.kind ?? "document",
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    cover: data.cover ?? null,
    file: data.file ?? null,
    external_url: data.external_url ?? null,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
}

export const deleteBook = (id: string) => remove("library_items", id);

// ── Events ──

const eventDef: Entity<PublicEvent> = {
  table: "events",
  prefix: "evt",
  order: "starts_at DESC",
  cols: ["id", "title", "slug", "summary", "description", "starts_at", "ends_at", "timezone", "venue_name", "venue_address", "online_url", "registration_required", "capacity", "locale", "direction", "cover_json", "categories_json", "tags_json", "published_at", "updated_at", "status"],
  toArgs: (e) => [
    e.id, e.title, e.slug, e.summary, e.description ?? null, e.starts_at, e.ends_at, e.timezone,
    e.venue_name, e.venue_address, e.online_url, e.registration_required ? 1 : 0, e.capacity,
    e.locale, e.direction, JSON.stringify(e.cover), JSON.stringify(e.categories), JSON.stringify(e.tags),
    e.published_at, e.updated_at,
    e.status ?? "published",
  ],
  fromRow: (r) => ({
    object: "event",
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: str(r.summary),
    description: str(r.description),
    starts_at: String(r.starts_at),
    ends_at: str(r.ends_at),
    timezone: String(r.timezone ?? "Africa/Addis_Ababa"),
    venue_name: str(r.venue_name),
    venue_address: str(r.venue_address),
    online_url: str(r.online_url),
    registration_required: Number(r.registration_required) === 1,
    capacity: num(r.capacity),
    locale: String(r.locale ?? "am"),
    direction: dir(r.direction),
    cover: json(r.cover_json, null),
    categories: json(r.categories_json, []),
    tags: json(r.tags_json, []),
    published_at: str(r.published_at),
    status: r.status === "draft" ? "draft" : "published",
    updated_at: String(r.updated_at),
  }),
};

export const getAllEvents = () => listAll(eventDef);
export const getEventByIdOrSlug = (key: string) => findOne(eventDef, key);

export function saveEvent(data: Partial<PublicEvent> & { title: string; slug: string; starts_at: string }) {
  return upsert(eventDef, {
    object: "event",
    id: data.id || newId("evt"),
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? null,
    description: data.description ?? null,
    starts_at: data.starts_at,
    ends_at: data.ends_at ?? null,
    timezone: data.timezone ?? "Africa/Addis_Ababa",
    venue_name: data.venue_name ?? null,
    venue_address: data.venue_address ?? null,
    online_url: data.online_url ?? null,
    registration_required: Boolean(data.registration_required),
    capacity: data.capacity ?? null,
    locale: data.locale ?? "am",
    direction: data.direction ?? "ltr",
    cover: data.cover ?? null,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    published_at: data.published_at ?? nowIso(),
    updated_at: nowIso(),
    status: data.status ?? "published",
  });
}

export const deleteEvent = (id: string) => remove("events", id);

// ── Media ──

const mediaCols = ["id", "url", "kind", "mime_type", "width", "height", "duration_seconds", "created_at", "title", "description", "thumbnail_url"];

function mediaFromRow(r: Row): MediaRef {
  return {
    object: "media",
    id: String(r.id),
    kind: (r.kind as MediaRef["kind"]) ?? "image",
    url: String(r.url),
    mime_type: String(r.mime_type ?? ""),
    width: num(r.width),
    height: num(r.height),
    duration_seconds: num(r.duration_seconds),
    title: str(r.title),
    description: str(r.description),
    thumbnail_url: str(r.thumbnail_url),
  };
}

const mediaArgs = (m: MediaRef): DbValue[] => [
  m.id, m.url, m.kind, m.mime_type, m.width, m.height, m.duration_seconds, nowIso(),
  m.title ?? null, m.description ?? null, m.thumbnail_url ?? null,
];

export async function getAllMedia(): Promise<MediaRef[]> {
  await ready();
  const rows = await queryAll<Row>("SELECT * FROM media_assets ORDER BY created_at DESC;");
  return rows.map(mediaFromRow);
}

export async function saveMediaItem(item: MediaRef): Promise<MediaRef> {
  await ready();
  await execute(
    upsertSql("media_assets", mediaCols),
    mediaArgs(item)
  );
  revalidate();
  return item;
}

export const deleteMediaItem = (id: string) => remove("media_assets", id);

// ── Inquiries ──

const inquiryFromRow = (r: Row): InquiryRecord => ({
  id: String(r.id),
  question: String(r.question),
  name: str(r.name) ?? undefined,
  email: str(r.email) ?? undefined,
  is_anonymous: Number(r.is_anonymous) === 1,
  locale: String(r.locale ?? "am"),
  created_at: String(r.created_at),
  status: (r.status as InquiryRecord["status"]) ?? "pending",
  notes: str(r.notes) ?? undefined,
  answer: str(r.answer) ?? undefined,
});

const inquiryCols = ["id", "question", "name", "email", "is_anonymous", "locale", "status", "notes", "answer", "created_at"];
const inquiryArgs = (i: InquiryRecord): DbValue[] => [
  i.id, i.question, i.name ?? null, i.email ?? null, i.is_anonymous ? 1 : 0, i.locale, i.status,
  i.notes ?? null, i.answer ?? null, i.created_at,
];

export async function getAllInquiries(): Promise<InquiryRecord[]> {
  await ready();
  return (await queryAll<Row>("SELECT * FROM inquiries ORDER BY created_at DESC;")).map(inquiryFromRow);
}

export async function createInquiry(payload: {
  question: string;
  name?: string;
  email?: string;
  is_anonymous?: boolean;
  locale?: string;
}): Promise<InquiryRecord> {
  await ready();
  const inquiry: InquiryRecord = {
    id: newId("inq"),
    question: payload.question,
    name: payload.name,
    email: payload.email,
    is_anonymous: Boolean(payload.is_anonymous),
    locale: payload.locale ?? "am",
    created_at: nowIso(),
    status: "pending",
  };
  await execute(
    `INSERT INTO inquiries (${inquiryCols.join(", ")}) VALUES (${placeholders(inquiryCols.length)});`,
    inquiryArgs(inquiry)
  );
  return inquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryRecord["status"],
  notes?: string
): Promise<InquiryRecord | null> {
  await ready();
  const res = await execute("UPDATE inquiries SET status = ?, notes = COALESCE(?, notes) WHERE id = ?;", [
    status,
    notes ?? null,
    id,
  ]);
  if (res.rowsAffected === 0) return null;
  const row = await queryOne<Row>("SELECT * FROM inquiries WHERE id = ?;", [id]);
  return row ? inquiryFromRow(row) : null;
}

export const deleteInquiry = (id: string) => remove("inquiries", id);

// ── Profile, Journey & Qualifications ──

const DEFAULT_PROFILE: PublicProfile = {
  object: "profile",
  id: "primary",
  name: "Sheikh Muhammed Ferej Megeno",
  headline: null,
  biography: null,
  languages: ["am", "ar", "en", "om"],
  locale: "en",
  direction: "ltr",
  photo: null,
  location: null,
  sections: { lectures: true, articles: true, fatwas: true, courses: true, library: true, events: true, questions: true },
  socials: {
    telegram: "https://t.me/ustazmuhammadferej",
    youtube: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    facebook: "https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/?_rdc=1&_rdr#",
    tiktok: "https://www.tiktok.com/@ustazmuhammadferej0",
    play_store: "https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej",
  },
  updated_at: "1970-01-01T00:00:00.000Z",
};

export async function getProfile(): Promise<PublicProfile> {
  await ready();
  const r = await queryOne<Row>("SELECT * FROM scholar_profile LIMIT 1;");
  if (!r) return DEFAULT_PROFILE;
  return {
    object: "profile",
    id: String(r.id),
    name: String(r.name),
    headline: str(r.headline),
    biography: str(r.biography),
    languages: json(r.languages_json, DEFAULT_PROFILE.languages),
    locale: String(r.locale ?? "en"),
    direction: dir(r.direction),
    photo: json(r.photo_json, null),
    location: str(r.location),
    sections: { ...DEFAULT_PROFILE.sections, ...json<Partial<PublicProfile["sections"]>>(r.sections_json, {}) },
    socials: { ...DEFAULT_PROFILE.socials, ...json<Record<string, string>>(r.socials_json, {}) },
    updated_at: String(r.updated_at),
  };
}

const profileCols = ["id", "name", "headline", "biography", "languages_json", "location", "photo_json", "sections_json", "socials_json", "locale", "direction", "updated_at"];
const profileArgs = (p: PublicProfile): DbValue[] => [
  p.id || "primary", p.name, p.headline, p.biography, JSON.stringify(p.languages), p.location ?? null,
  JSON.stringify(p.photo), JSON.stringify(p.sections), JSON.stringify(p.socials), p.locale, p.direction, p.updated_at,
];

export async function updateProfile(partial: Partial<PublicProfile>): Promise<PublicProfile> {
  const profile: PublicProfile = { ...(await getProfile()), ...partial, updated_at: nowIso() };
  await execute(upsertSql("scholar_profile", profileCols), profileArgs(profile));
  revalidate();
  return profile;
}

export async function getJourney(): Promise<JourneyMilestone[]> {
  await ready();
  const rows = await queryAll<Row>("SELECT * FROM journey_milestones ORDER BY position ASC;");
  return rows.map((r) => ({
    year: String(r.year),
    title: String(r.title),
    institution: str(r.institution) ?? undefined,
    description: String(r.description ?? ""),
    type: (r.type as JourneyMilestone["type"]) ?? "contribution",
  }));
}

const journeyCols = ["id", "year", "title", "institution", "description", "type", "position", "created_at"];
const journeyRows = (list: JourneyMilestone[]): DbValue[][] =>
  list.map((m, i) => [`jrn_${String(i).padStart(3, "0")}`, m.year, m.title, m.institution ?? null, m.description || "", m.type || "contribution", i, nowIso()]);

export async function updateJourney(list: JourneyMilestone[]): Promise<JourneyMilestone[]> {
  await ready();
  await batch([{ sql: "DELETE FROM journey_milestones;", args: [] }, ...multiUpsert("journey_milestones", { cols: journeyCols, key: "id", rows: journeyRows(list) })]);
  revalidate();
  return list;
}

export async function getQualifications(): Promise<QualificationRecord[]> {
  await ready();
  const rows = await queryAll<Row>("SELECT * FROM qualifications ORDER BY position ASC;");
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    issuer: String(r.issuer),
    year: String(r.year),
    type: (r.type as QualificationRecord["type"]) ?? "academic",
    description: String(r.description ?? ""),
  }));
}

const qualificationCols = ["id", "title", "issuer", "year", "type", "description", "position", "created_at"];
const qualificationRows = (list: QualificationRecord[]): DbValue[][] =>
  list.map((q, i) => [q.id || `qual_${String(i).padStart(3, "0")}`, q.title, q.issuer, q.year, q.type || "academic", q.description || "", i, nowIso()]);

export async function updateQualifications(list: QualificationRecord[]): Promise<QualificationRecord[]> {
  await ready();
  await batch([{ sql: "DELETE FROM qualifications;", args: [] }, ...multiUpsert("qualifications", { cols: qualificationCols, key: "id", rows: qualificationRows(list) })]);
  revalidate();
  return list;
}

// ── Site settings (admin-managed key/value) ──

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  await ready();
  const row = await queryOne<Row>("SELECT value_json FROM site_settings WHERE key = ?;", [key]);
  return row ? json(row.value_json, fallback) : fallback;
}

export async function setSetting<T>(key: string, value: T): Promise<T> {
  await ready();
  await execute(upsertSql("site_settings", ["key", "value_json", "updated_at"], "key"), [
    key,
    JSON.stringify(value),
    nowIso(),
  ]);
  revalidate();
  return value;
}

// ── Event registrations ──

const registrationCols = ["id", "event_id", "event_slug", "event_title", "name", "email", "phone", "city", "attendees_count", "notes", "status", "created_at"];
const registrationFromRow = (r: Row): EventRegistrationRecord => ({
  id: String(r.id),
  event_id: String(r.event_id),
  event_slug: String(r.event_slug),
  event_title: String(r.event_title),
  name: String(r.name),
  email: String(r.email),
  phone: str(r.phone) ?? undefined,
  city: str(r.city) ?? undefined,
  attendees_count: Number(r.attendees_count ?? 1),
  created_at: String(r.created_at),
  status: (r.status as EventRegistrationRecord["status"]) ?? "confirmed",
  notes: str(r.notes) ?? undefined,
});
const registrationArgs = (r: EventRegistrationRecord): DbValue[] => [
  r.id, r.event_id, r.event_slug, r.event_title, r.name, r.email, r.phone ?? null, r.city ?? null,
  r.attendees_count, r.notes ?? null, r.status, r.created_at,
];

export async function getAllEventRegistrations(): Promise<EventRegistrationRecord[]> {
  await ready();
  return (await queryAll<Row>("SELECT * FROM event_registrations ORDER BY created_at DESC;")).map(registrationFromRow);
}

export async function getRegistrationsByEventId(eventIdOrSlug: string): Promise<EventRegistrationRecord[]> {
  await ready();
  const rows = await queryAll<Row>(
    "SELECT * FROM event_registrations WHERE event_id = ? OR event_slug = ? ORDER BY created_at DESC;",
    [eventIdOrSlug, eventIdOrSlug]
  );
  return rows.map(registrationFromRow);
}

export async function createEventRegistration(payload: {
  event_id: string;
  event_slug: string;
  event_title: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  attendees_count?: number;
  notes?: string;
}): Promise<EventRegistrationRecord> {
  await ready();
  const reg: EventRegistrationRecord = {
    id: newId("evtr"),
    event_id: payload.event_id,
    event_slug: payload.event_slug,
    event_title: payload.event_title,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim(),
    city: payload.city?.trim(),
    attendees_count: Math.max(1, payload.attendees_count || 1),
    notes: payload.notes?.trim(),
    created_at: nowIso(),
    status: "confirmed",
  };
  await execute(
    `INSERT INTO event_registrations (${registrationCols.join(", ")}) VALUES (${placeholders(registrationCols.length)});`,
    registrationArgs(reg)
  );
  return reg;
}

export async function updateEventRegistrationStatus(
  id: string,
  status: EventRegistrationRecord["status"]
): Promise<EventRegistrationRecord | null> {
  await ready();
  const res = await execute("UPDATE event_registrations SET status = ? WHERE id = ?;", [status, id]);
  if (res.rowsAffected === 0) return null;
  const row = await queryOne<Row>("SELECT * FROM event_registrations WHERE id = ?;", [id]);
  return row ? registrationFromRow(row) : null;
}

export const deleteEventRegistration = (id: string) => remove("event_registrations", id);

// ── Course enrollments & progress ──

const enrollmentCols = ["id", "course_id", "course_slug", "course_title", "student_name", "student_email", "student_phone", "city", "status", "completed_lessons_json", "exam_attempts_json", "certificate_id", "created_at", "updated_at"];
const enrollmentFromRow = (r: Row): CourseEnrollmentRecord => ({
  id: String(r.id),
  course_id: String(r.course_id),
  course_slug: String(r.course_slug),
  course_title: String(r.course_title),
  student_name: String(r.student_name),
  student_email: String(r.student_email),
  student_phone: str(r.student_phone) ?? undefined,
  city: str(r.city) ?? undefined,
  created_at: String(r.created_at),
  completed_lessons: json(r.completed_lessons_json, []),
  exam_attempts: json(r.exam_attempts_json, []),
  certificate_id: str(r.certificate_id),
  status: (r.status as CourseEnrollmentRecord["status"]) ?? "enrolled",
});
const enrollmentArgs = (e: CourseEnrollmentRecord): DbValue[] => [
  e.id, e.course_id, e.course_slug, e.course_title, e.student_name, e.student_email, e.student_phone ?? null,
  e.city ?? null, e.status, JSON.stringify(e.completed_lessons), JSON.stringify(e.exam_attempts),
  e.certificate_id ?? null, e.created_at, nowIso(),
];

async function saveEnrollment(e: CourseEnrollmentRecord) {
  await execute(
    upsertSql("course_enrollments", enrollmentCols),
    enrollmentArgs(e)
  );
}

export async function getAllCourseEnrollments(): Promise<CourseEnrollmentRecord[]> {
  await ready();
  return (await queryAll<Row>("SELECT * FROM course_enrollments ORDER BY created_at DESC;")).map(enrollmentFromRow);
}

export async function getEnrollmentByEmail(courseIdOrSlug: string, email: string): Promise<CourseEnrollmentRecord | null> {
  await ready();
  const row = await queryOne<Row>(
    "SELECT * FROM course_enrollments WHERE (course_id = ? OR course_slug = ?) AND lower(student_email) = ? LIMIT 1;",
    [courseIdOrSlug, courseIdOrSlug, email.trim().toLowerCase()]
  );
  return row ? enrollmentFromRow(row) : null;
}

export async function createCourseEnrollment(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  city?: string;
}): Promise<CourseEnrollmentRecord> {
  const existing = await getEnrollmentByEmail(payload.course_slug, payload.student_email);
  if (existing) return existing;
  const enrollment: CourseEnrollmentRecord = {
    id: newId("enr"),
    course_id: payload.course_id,
    course_slug: payload.course_slug,
    course_title: payload.course_title,
    student_name: payload.student_name.trim(),
    student_email: payload.student_email.trim().toLowerCase(),
    student_phone: payload.student_phone?.trim(),
    city: payload.city?.trim(),
    created_at: nowIso(),
    completed_lessons: [],
    exam_attempts: [],
    status: "enrolled",
    certificate_id: null,
  };
  await saveEnrollment(enrollment);
  return enrollment;
}

export async function toggleLessonProgress(enrollmentId: string, lessonId: string): Promise<CourseEnrollmentRecord | null> {
  await ready();
  const row = await queryOne<Row>("SELECT * FROM course_enrollments WHERE id = ?;", [enrollmentId]);
  if (!row) return null;
  const enr = enrollmentFromRow(row);
  enr.completed_lessons = enr.completed_lessons.includes(lessonId)
    ? enr.completed_lessons.filter((l) => l !== lessonId)
    : [...enr.completed_lessons, lessonId];
  if (enr.completed_lessons.length > 0 && enr.status === "enrolled") enr.status = "in_progress";
  await saveEnrollment(enr);
  return enr;
}

export async function updateEnrollmentStatus(id: string, status: CourseEnrollmentRecord["status"]) {
  await ready();
  const res = await execute("UPDATE course_enrollments SET status = ?, updated_at = ? WHERE id = ?;", [status, nowIso(), id]);
  return res.rowsAffected > 0;
}

export const deleteCourseEnrollment = (id: string) => remove("course_enrollments", id);

// ── Course exams & grading ──

export async function getCourseExam(courseIdOrSlug: string): Promise<CourseExamConfig | null> {
  await ready();
  const row = await queryOne<Row>("SELECT * FROM course_exams WHERE course_slug = ? OR course_id = ? LIMIT 1;", [
    courseIdOrSlug,
    courseIdOrSlug,
  ]);
  if (!row) return null;
  return {
    course_id: String(row.course_id),
    passing_percentage: Number(row.passing_percentage ?? 70),
    questions: json(row.questions_json, []),
  };
}

export async function saveCourseExam(courseSlug: string, exam: CourseExamConfig): Promise<CourseExamConfig> {
  await ready();
  await execute(
    `INSERT INTO course_exams (course_slug, course_id, passing_percentage, questions_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(course_slug) DO UPDATE SET course_id = excluded.course_id,
       passing_percentage = excluded.passing_percentage, questions_json = excluded.questions_json,
       updated_at = excluded.updated_at;`,
    [courseSlug, exam.course_id || courseSlug, exam.passing_percentage || 70, JSON.stringify(exam.questions ?? []), nowIso(), nowIso()]
  );
  return exam;
}

export const deleteCourseExam = (courseSlug: string) => remove("course_exams", courseSlug, "course_slug");

function computeHijriDate(): string {
  try {
    return (
      new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(new Date()) +
      " AH"
    );
  } catch {
    return "1448 AH";
  }
}

function generateCertificateVerificationToken(studentName: string, courseId: string, issueDate: string): string {
  const secret = process.env.CERTIFICATE_SECRET || (process.env.NODE_ENV === "production" ? "" : "development-only-certificate-secret");
  if (!secret) throw new Error("CERTIFICATE_SECRET must be set in production.");
  const data = `${studentName.trim().toLowerCase()}|${courseId.trim().toLowerCase()}|${issueDate}`;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function generateCertificateCode(courseSlug: string): string {
  const lower = courseSlug.toLowerCase();
  const acronyms: [string, string][] = [["riyad", "RDS"], ["saliheen", "RDS"], ["tafsir", "TFS"], ["hadith", "HDT"], ["fiqh", "FQH"], ["aqeedah", "AQD"], ["quran", "QRN"]];
  const acronym = acronyms.find(([k]) => lower.includes(k))?.[1] ?? "GEN";
  return `MFM-${new Date().getFullYear()}-${acronym}-${crypto.randomInt(1000, 10000)}`;
}

export async function submitCourseExam(payload: {
  course_id: string;
  student_email: string;
  student_name?: string;
  answers: Record<string, number>;
}): Promise<{
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  certificate?: IssuedCertificateRecord;
  enrollment?: CourseEnrollmentRecord;
}> {
  const course = await getCourseByIdOrSlug(payload.course_id);
  const exam = (await getCourseExam(course?.slug ?? payload.course_id)) ?? (course ? await getCourseExam(course.id) : null);
  if (!exam || exam.questions.length === 0) {
    throw new Error("Exam configuration not found for this course.");
  }

  const correctCount = exam.questions.filter((q) => payload.answers[q.id] === q.correct_option_index).length;
  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= (exam.passing_percentage || 70);

  let enrollment = await getEnrollmentByEmail(payload.course_id, payload.student_email);
  if (!enrollment && payload.student_name) {
    enrollment = await createCourseEnrollment({
      course_id: course?.id ?? payload.course_id,
      course_slug: course?.slug ?? payload.course_id,
      course_title: course?.title ?? payload.course_id,
      student_name: payload.student_name,
      student_email: payload.student_email,
    });
  }

  let certificate: IssuedCertificateRecord | undefined;
  if (passed) {
    const gradeTitle =
      score === 100
        ? "Mumtaz with Highest Distinction (ممتاز مع مرتبة الشرف الأولى)"
        : score >= 90
          ? "Mumtaz with Distinction (ممتاز)"
          : "Jayyid Jiddan (Very Good / جيد جداً)";
    certificate = await issueCertificate({
      course_id: course?.id ?? payload.course_id,
      course_slug: course?.slug ?? payload.course_id,
      course_title: course?.title ?? payload.course_id,
      student_name: enrollment?.student_name ?? payload.student_name ?? "Enrolled Student",
      student_email: payload.student_email,
      score_percentage: score,
      grade_title: gradeTitle,
    });
    if (enrollment) {
      enrollment.certificate_id = certificate.id;
      enrollment.status = "completed";
    }
  }

  if (enrollment) {
    enrollment.exam_attempts.push({ attempt_date: nowIso(), score, passed });
    await saveEnrollment(enrollment);
  }

  return { score, passed, correct_count: correctCount, total_questions: exam.questions.length, certificate, enrollment: enrollment ?? undefined };
}

// ── Certificates & verification ──

const certificateCols = ["id", "verification_token", "course_id", "course_slug", "course_title", "student_name", "student_email", "score_percentage", "grade_title", "issued_at", "hijri_date", "instructor_name", "authority_seal", "revoked", "revoked_reason"];
const certificateFromRow = (r: Row): IssuedCertificateRecord => ({
  id: String(r.id),
  verification_token: String(r.verification_token),
  course_id: String(r.course_id),
  course_slug: String(r.course_slug),
  course_title: String(r.course_title),
  student_name: String(r.student_name),
  student_email: String(r.student_email),
  issued_at: String(r.issued_at),
  hijri_date: str(r.hijri_date) ?? undefined,
  score_percentage: Number(r.score_percentage),
  grade_title: String(r.grade_title),
  instructor_name: String(r.instructor_name ?? ""),
  authority_seal: String(r.authority_seal ?? ""),
  revoked: Number(r.revoked) === 1,
  revoked_reason: str(r.revoked_reason),
});
const certificateArgs = (c: IssuedCertificateRecord): DbValue[] => [
  c.id, c.verification_token, c.course_id, c.course_slug, c.course_title, c.student_name, c.student_email,
  c.score_percentage, c.grade_title, c.issued_at, c.hijri_date ?? null, c.instructor_name, c.authority_seal,
  c.revoked ? 1 : 0, c.revoked_reason ?? null,
];

export async function getAllCertificates(): Promise<IssuedCertificateRecord[]> {
  await ready();
  return (await queryAll<Row>("SELECT * FROM certificates ORDER BY issued_at DESC;")).map(certificateFromRow);
}

export async function getCertificateByCode(code: string): Promise<IssuedCertificateRecord | null> {
  await ready();
  const row = await queryOne<Row>("SELECT * FROM certificates WHERE upper(id) = ? LIMIT 1;", [code.trim().toUpperCase()]);
  return row ? certificateFromRow(row) : null;
}

export async function issueCertificate(payload: {
  course_id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  score_percentage: number;
  grade_title?: string;
}): Promise<IssuedCertificateRecord> {
  await ready();
  const email = payload.student_email.trim().toLowerCase();
  const existing = await queryOne<Row>(
    "SELECT * FROM certificates WHERE course_slug = ? AND lower(student_email) = ? AND revoked = 0 LIMIT 1;",
    [payload.course_slug, email]
  );
  if (existing) return certificateFromRow(existing);

  const issuedAt = nowIso();
  const cert: IssuedCertificateRecord = {
    id: generateCertificateCode(payload.course_slug),
    verification_token: generateCertificateVerificationToken(payload.student_name, payload.course_id, issuedAt),
    course_id: payload.course_id,
    course_slug: payload.course_slug,
    course_title: payload.course_title,
    student_name: payload.student_name.trim(),
    student_email: email,
    issued_at: issuedAt,
    hijri_date: computeHijriDate(),
    score_percentage: payload.score_percentage,
    grade_title: payload.grade_title || (payload.score_percentage >= 90 ? "Mumtaz (Distinction)" : "Jayyid Jiddan (Very Good)"),
    instructor_name: "Sheikh Muhammed Ferej Megeno",
    authority_seal: "Al-Fajr Islamic Foundation & AAOIFI Sharia Council Accreditation",
    revoked: false,
    revoked_reason: null,
  };
  await execute(
    `INSERT INTO certificates (${certificateCols.join(", ")}) VALUES (${placeholders(certificateCols.length)});`,
    certificateArgs(cert)
  );
  return cert;
}

export async function revokeCertificate(id: string, reason?: string): Promise<IssuedCertificateRecord | null> {
  await ready();
  const res = await execute("UPDATE certificates SET revoked = 1, revoked_reason = ? WHERE upper(id) = ?;", [
    reason?.trim() || "Revoked by Scholarly Accreditation Board.",
    id.trim().toUpperCase(),
  ]);
  return res.rowsAffected > 0 ? getCertificateByCode(id) : null;
}

export const deleteCertificate = (id: string) => remove("certificates", id);

// ── Metrics ──

export async function getSystemMetrics() {
  await ready();
  const lectureMedia = (await queryAll<Row>("SELECT media_json FROM lectures;")).map((m) =>
    json<Partial<PublicLecture["media"]>>(m.media_json, {})
  );
  const r = await queryOne<Row>(`SELECT
      (SELECT count(*) FROM lectures) AS lectures,
      (SELECT count(*) FROM series) AS series,
      (SELECT count(*) FROM articles) AS articles,
      (SELECT count(*) FROM fatwas) AS fatwas,
      (SELECT count(*) FROM courses) AS courses,
      (SELECT count(*) FROM library_items) AS books,
      (SELECT count(*) FROM events) AS events,
      (SELECT count(*) FROM media_assets) AS media,
      (SELECT count(*) FROM inquiries) AS inquiries,
      (SELECT count(*) FROM inquiries WHERE status = 'pending') AS pending,
      (SELECT count(*) FROM course_enrollments) AS enrollments,
      (SELECT count(*) FROM certificates) AS certificates,
      (SELECT count(*) FROM event_registrations) AS registrations,
      (SELECT max(version) FROM schema_version) AS version;`);
  return {
    lecturesCount: Number(r?.lectures ?? 0),
    videoLectures: lectureMedia.filter((m) => m.video).length,
    audioLessons: lectureMedia.filter((m) => m.audio).length,
    seriesCount: Number(r?.series ?? 0),
    articlesCount: Number(r?.articles ?? 0),
    fatwasCount: Number(r?.fatwas ?? 0),
    coursesCount: Number(r?.courses ?? 0),
    booksCount: Number(r?.books ?? 0),
    eventsCount: Number(r?.events ?? 0),
    mediaCount: Number(r?.media ?? 0),
    inquiriesTotal: Number(r?.inquiries ?? 0),
    pendingInquiries: Number(r?.pending ?? 0),
    enrollmentsCount: Number(r?.enrollments ?? 0),
    certificatesCount: Number(r?.certificates ?? 0),
    eventRegistrationsCount: Number(r?.registrations ?? 0),
    lastUpdated: nowIso(),
    version: Number(r?.version ?? 0),
  };
}

// ── Backup: export / import / reset (operate on SQLite) ──

const ALL_TABLES = [
  "scholar_profile", "journey_milestones", "qualifications", "series", "lectures", "articles", "fatwas",
  "courses", "course_exams", "course_enrollments", "certificates", "library_items", "events",
  "event_registrations", "media_assets", "inquiries",
];

/** Writes a full portal snapshot into SQLite in one transaction, optionally replacing everything. */
async function writeAll(data: PortalDatabase, replace: boolean, only?: Set<string>) {
  const want = (table: string) => !only || only.has(table);
  const stamp = <T extends { updated_at: string }>(x: T): T => ({ ...x, updated_at: x.updated_at || nowIso() });
  const statements: Statement[] = [];
  if (replace) ALL_TABLES.forEach((t) => statements.push({ sql: `DELETE FROM ${t};`, args: [] }));

  const add = (table: string, cols: string[], rows: DbValue[][], key: string | string[] = "id") => {
    if (want(table) && rows.length) statements.push(...multiUpsert(table, { cols, key, rows }));
  };

  if (data.profile) {
    add("scholar_profile", profileCols, [profileArgs({ ...DEFAULT_PROFILE, ...data.profile, updated_at: data.profile.updated_at || nowIso() })]);
  }
  add("journey_milestones", journeyCols, journeyRows(data.journey ?? []));
  add("qualifications", qualificationCols, qualificationRows(data.qualifications ?? []));

  const entities: [Entity<{ id: string }>, { id: string }[] | undefined][] = [
    [seriesDef as unknown as Entity<{ id: string }>, data.series],
    [lectureDef as unknown as Entity<{ id: string }>, data.lectures],
    [articleDef as unknown as Entity<{ id: string }>, data.articles],
    [fatwaDef as unknown as Entity<{ id: string }>, data.fatwas],
    [courseDef as unknown as Entity<{ id: string }>, data.courses],
    [bookDef as unknown as Entity<{ id: string }>, data.books],
    [eventDef as unknown as Entity<{ id: string }>, data.events],
  ];
  for (const [def, items] of entities) {
    add(def.table, def.cols, (items ?? []).map((item) => def.toArgs(stamp(item as { id: string; updated_at: string }))));
  }

  add("media_assets", mediaCols, (data.media ?? []).map(mediaArgs));
  add("inquiries", inquiryCols, (data.inquiries ?? []).map(inquiryArgs));
  add("event_registrations", registrationCols, (data.event_registrations ?? []).map(registrationArgs));
  add("course_enrollments", enrollmentCols, (data.course_enrollments ?? []).map(enrollmentArgs));
  add("certificates", certificateCols, (data.certificates ?? []).map(certificateArgs));
  add(
    "course_exams",
    ["course_slug", "course_id", "passing_percentage", "questions_json", "created_at", "updated_at"],
    Object.entries(data.course_exams ?? {}).map(([slug, exam]) => [slug, exam.course_id || slug, exam.passing_percentage || 70, JSON.stringify(exam.questions ?? []), nowIso(), nowIso()]),
    "course_slug"
  );

  await batch(statements);
}

export async function exportDatabase(): Promise<PortalDatabase> {
  await ready();
  const [profile, journey, qualifications, lectures, series, articles, fatwas, courses, books, events, media, inquiries, regs, enrollments, certificates] =
    await Promise.all([
      getProfile(), getJourney(), getQualifications(), getAllLectures(), listAll(seriesDef), getAllArticles(),
      getAllFatwas(), getAllCourses(), getAllBooks(), getAllEvents(), getAllMedia(), getAllInquiries(),
      getAllEventRegistrations(), getAllCourseEnrollments(), getAllCertificates(),
    ]);
  const exams = await queryAll<Row>("SELECT * FROM course_exams;");
  return {
    version: 2,
    updated_at: nowIso(),
    profile, journey, qualifications, lectures, series, articles, fatwas, courses, books, events, media, inquiries,
    event_registrations: regs,
    course_enrollments: enrollments,
    course_exams: Object.fromEntries(
      exams.map((e) => [String(e.course_slug), { course_id: String(e.course_id), passing_percentage: Number(e.passing_percentage), questions: json(e.questions_json, []) }])
    ),
    certificates,
  };
}

export async function exportDatabaseJson(): Promise<string> {
  return JSON.stringify(await exportDatabase(), null, 2);
}

export async function importDatabaseJson(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString) as PortalDatabase;
  if (!parsed || !Array.isArray(parsed.lectures) || !Array.isArray(parsed.articles)) {
    throw new Error("Invalid database schema format.");
  }
  await ready();
  await writeAll(parsed, true);
  revalidate();
}

/** Restores the bundled seed content, replacing everything. */
export async function resetDatabase(): Promise<void> {
  await ready();
  const seed = (await import("./seed/content-seed.json")).default as unknown as PortalDatabase;
  await writeAll(seed, true);
  revalidate();
}
