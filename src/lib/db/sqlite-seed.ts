import { queryOne, batch } from "./sqlite-client";
import { ensureTablesExist } from "./sqlite-schema";
import { loadDatabase } from "./store";
import type { InStatement } from "@libsql/client";

let isSeeded = false;

/**
 * Checks whether SQLite tables are populated; if empty, migrates existing authentic
 * JSON store data into SQLite relational tables.
 */
export async function seedSqliteIfEmpty(): Promise<void> {
  if (isSeeded) {
    return;
  }
  await ensureTablesExist();

  try {
    const lectureCheck = await queryOne<{ count: number }>("SELECT count(*) as count FROM lectures;");
    if (lectureCheck && Number(lectureCheck.count) > 0) {
      isSeeded = true;
      return;
    }

    const data = loadDatabase();
    const statements: InStatement[] = [];

    // 1. Profile
    if (data.profile) {
      statements.push({
        sql: `INSERT OR REPLACE INTO scholar_profile (id, name, headline, biography, languages_json, location, photo_json, sections_json, socials_json, locale, direction, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
          data.profile.id || "primary",
          data.profile.name || "Sheikh Muhammed Ferej Megeno",
          data.profile.headline ?? null,
          data.profile.biography ?? null,
          JSON.stringify(data.profile.languages || ["am", "ar", "en", "om"]),
          data.profile.location ?? "Addis Ababa, Ethiopia",
          JSON.stringify(data.profile.photo ?? null),
          JSON.stringify(data.profile.sections || {}),
          JSON.stringify(data.profile.socials || {}),
          data.profile.locale || "am",
          data.profile.direction || "ltr",
          data.profile.updated_at || new Date().toISOString(),
        ],
      });
    }

    // 2. Journey Milestones
    if (Array.isArray(data.journey)) {
      data.journey.forEach((m, idx) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO journey_milestones (id, year, title, institution, description, type, position, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            `jrn_${idx}_${Date.now()}`,
            m.year,
            m.title,
            m.institution ?? null,
            m.description || "",
            m.type || "contribution",
            idx,
            new Date().toISOString(),
          ],
        });
      });
    }

    // 3. Qualifications
    if (Array.isArray(data.qualifications)) {
      data.qualifications.forEach((q, idx) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO qualifications (id, title, issuer, year, type, description, position, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            q.id || `qual_${idx}`,
            q.title,
            q.issuer,
            q.year,
            q.type || "academic",
            q.description || "",
            idx,
            new Date().toISOString(),
          ],
        });
      });
    }

    // 4. Series
    if (Array.isArray(data.series)) {
      data.series.forEach((s) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO series (id, title, slug, description, locale, direction, cover_json, lecture_count, published_at, updated_at, lectures_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            s.id,
            s.title,
            s.slug,
            s.description ?? null,
            s.locale || "am",
            s.direction || "ltr",
            JSON.stringify(s.cover ?? null),
            s.lecture_count || 0,
            s.published_at ?? null,
            s.updated_at || new Date().toISOString(),
            JSON.stringify(s.lectures || []),
          ],
        });
      });
    }

    // 5. Lectures
    if (Array.isArray(data.lectures)) {
      data.lectures.forEach((l) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO lectures (id, title, slug, summary, duration_seconds, published_at, updated_at, cover_json, media_json, series_json, categories_json, tags_json, locale, direction)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            l.id,
            l.title,
            l.slug,
            l.summary ?? null,
            l.duration_seconds ?? null,
            l.published_at ?? null,
            l.updated_at || new Date().toISOString(),
            JSON.stringify(l.cover ?? null),
            JSON.stringify(l.media || {}),
            JSON.stringify(l.series ?? null),
            JSON.stringify(l.categories || []),
            JSON.stringify(l.tags || []),
            l.locale || "am",
            l.direction || "ltr",
          ],
        });
      });
    }

    // 6. Articles
    if (Array.isArray(data.articles)) {
      data.articles.forEach((a) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO articles (id, title, slug, summary, body, reading_minutes, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            a.id,
            a.title,
            a.slug,
            a.summary ?? null,
            a.body ?? "",
            a.reading_minutes ?? 5,
            a.locale || "am",
            a.direction || "ltr",
            JSON.stringify(a.cover ?? null),
            JSON.stringify(a.categories || []),
            JSON.stringify(a.tags || []),
            a.published_at ?? null,
            a.updated_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 7. Fatwas
    if (Array.isArray(data.fatwas)) {
      data.fatwas.forEach((f) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO fatwas (id, title, slug, summary, question, answer, locale, direction, categories_json, tags_json, published_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            f.id,
            f.title,
            f.slug,
            f.summary ?? null,
            f.question ?? null,
            f.answer ?? null,
            f.locale || "am",
            f.direction || "ltr",
            JSON.stringify(f.categories || []),
            JSON.stringify(f.tags || []),
            f.published_at ?? null,
            f.updated_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 8. Courses
    if (Array.isArray(data.courses)) {
      data.courses.forEach((c) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO courses (id, title, slug, summary, description, enrolment_open, lesson_count, lessons_json, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            c.id,
            c.title,
            c.slug,
            c.summary ?? null,
            c.description ?? null,
            c.enrolment_open ? 1 : 0,
            c.lesson_count || (c.lessons ? c.lessons.length : 0),
            JSON.stringify(c.lessons || []),
            c.locale || "am",
            c.direction || "ltr",
            JSON.stringify(c.cover ?? null),
            JSON.stringify(c.categories || []),
            JSON.stringify(c.tags || []),
            c.published_at ?? null,
            c.updated_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 9. Course Exams
    if (data.course_exams && typeof data.course_exams === "object") {
      Object.entries(data.course_exams).forEach(([slug, exam]) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO course_exams (course_slug, course_id, passing_percentage, questions_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?);`,
          args: [
            slug,
            exam.course_id || slug,
            exam.passing_percentage || 70,
            JSON.stringify(exam.questions || []),
            new Date().toISOString(),
            new Date().toISOString(),
          ],
        });
      });
    }

    // 10. Course Enrollments
    if (Array.isArray(data.course_enrollments)) {
      data.course_enrollments.forEach((enr) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO course_enrollments (id, course_id, course_slug, course_title, student_name, student_email, student_phone, city, status, completed_lessons_json, exam_attempts_json, certificate_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            enr.id,
            enr.course_id,
            enr.course_slug,
            enr.course_title,
            enr.student_name,
            enr.student_email,
            enr.student_phone ?? null,
            enr.city ?? null,
            enr.status || "enrolled",
            JSON.stringify(enr.completed_lessons || []),
            JSON.stringify(enr.exam_attempts || []),
            enr.certificate_id ?? null,
            enr.created_at || new Date().toISOString(),
            new Date().toISOString(),
          ],
        });
      });
    }

    // 11. Certificates
    if (Array.isArray(data.certificates)) {
      data.certificates.forEach((cert) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO certificates (id, verification_token, course_id, course_slug, course_title, student_name, student_email, score_percentage, grade_title, issued_at, hijri_date, instructor_name, authority_seal, revoked, revoked_reason)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            cert.id,
            cert.verification_token,
            cert.course_id,
            cert.course_slug,
            cert.course_title,
            cert.student_name,
            cert.student_email,
            cert.score_percentage,
            cert.grade_title,
            cert.issued_at,
            cert.hijri_date ?? null,
            cert.instructor_name || "Sheikh Muhammed Ferej Megeno",
            cert.authority_seal || "AAOIFI Sharia Board & Al-Fajr Islamic Foundation",
            cert.revoked ? 1 : 0,
            cert.revoked_reason ?? null,
          ],
        });
      });
    }

    // 12. Library Items
    if (Array.isArray(data.books)) {
      data.books.forEach((b) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO library_items (id, title, slug, summary, description, author, publisher, year, isbn, kind, locale, direction, cover_json, file_json, external_url, categories_json, tags_json, published_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            b.id,
            b.title,
            b.slug,
            b.summary ?? null,
            b.description ?? null,
            b.author ?? "Sheikh Muhammed Ferej Megeno",
            b.publisher ?? null,
            b.year ?? null,
            b.isbn ?? null,
            b.kind || "document",
            b.locale || "am",
            b.direction || "ltr",
            JSON.stringify(b.cover ?? null),
            JSON.stringify(b.file ?? null),
            b.external_url ?? null,
            JSON.stringify(b.categories || []),
            JSON.stringify(b.tags || []),
            b.published_at ?? null,
            b.updated_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 13. Events
    if (Array.isArray(data.events)) {
      data.events.forEach((ev) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO events (id, title, slug, summary, description, starts_at, ends_at, timezone, venue_name, venue_address, online_url, registration_required, capacity, locale, direction, cover_json, categories_json, tags_json, published_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            ev.id,
            ev.title,
            ev.slug,
            ev.summary ?? null,
            ev.description ?? null,
            ev.starts_at,
            ev.ends_at ?? null,
            ev.timezone || "Africa/Addis_Ababa",
            ev.venue_name ?? null,
            ev.venue_address ?? null,
            ev.online_url ?? null,
            ev.registration_required ? 1 : 0,
            ev.capacity ?? null,
            ev.locale || "am",
            ev.direction || "ltr",
            JSON.stringify(ev.cover ?? null),
            JSON.stringify(ev.categories || []),
            JSON.stringify(ev.tags || []),
            ev.published_at ?? null,
            ev.updated_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 14. Event Registrations
    if (Array.isArray(data.event_registrations)) {
      data.event_registrations.forEach((reg) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO event_registrations (id, event_id, event_slug, event_title, name, email, phone, city, attendees_count, notes, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            reg.id,
            reg.event_id,
            reg.event_slug,
            reg.event_title,
            reg.name,
            reg.email,
            reg.phone ?? null,
            reg.city ?? null,
            reg.attendees_count || 1,
            reg.notes ?? null,
            reg.status || "confirmed",
            reg.created_at || new Date().toISOString(),
          ],
        });
      });
    }

    // 15. Media Assets
    if (Array.isArray(data.media)) {
      data.media.forEach((m) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO media_assets (id, url, kind, mime_type, width, height, duration_seconds, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            m.id,
            m.url,
            m.kind || "image",
            m.mime_type || "image/jpeg",
            m.width ?? null,
            m.height ?? null,
            m.duration_seconds ?? null,
            new Date().toISOString(),
          ],
        });
      });
    }

    // 16. Inquiries
    if (Array.isArray(data.inquiries)) {
      data.inquiries.forEach((inq) => {
        statements.push({
          sql: `INSERT OR REPLACE INTO inquiries (id, question, name, email, is_anonymous, locale, status, notes, answer, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          args: [
            inq.id,
            inq.question,
            inq.name ?? null,
            inq.email ?? null,
            inq.is_anonymous ? 1 : 0,
            inq.locale || "am",
            inq.status || "pending",
            inq.notes ?? null,
            inq.answer ?? null,
            inq.created_at || new Date().toISOString(),
          ],
        });
      });
    }

    // Execute in chunked batches of 50
    const chunkSize = 50;
    for (let i = 0; i < statements.length; i += chunkSize) {
      const chunk = statements.slice(i, i + chunkSize);
      await batch(chunk);
    }

    isSeeded = true;
  } catch (err) {
    console.error("Error seeding SQLite database:", err);
  }
}
