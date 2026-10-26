import fs from "fs";
import path from "path";
import type { PortalDatabase } from "./types";
import { getInitialSeedDatabase } from "./initial-seed";

// In-memory cache for fast read access across requests
let memoryCache: PortalDatabase | null = null;

function getStoreFilePath(): string {
  // Use project data dir by default; fallback to /tmp if run in constrained serverless environment
  const primaryDir = path.join(process.cwd(), "data");
  const primaryFile = path.join(primaryDir, "content-store.json");

  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(primaryDir, ".test-write");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return primaryFile;
  } catch {
    const tmpFile = path.join("/tmp", "sheikh-ferej-content-store.json");
    return tmpFile;
  }
}

export function loadDatabase(): PortalDatabase {
  if (memoryCache) {
    return memoryCache;
  }

  const filePath = getStoreFilePath();

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as PortalDatabase;
      if (parsed && parsed.version && Array.isArray(parsed.lectures)) {
        // Ensure new learning/certificate collections exist if loading older store format
        const seedFallback = getInitialSeedDatabase();
        parsed.event_registrations = parsed.event_registrations || seedFallback.event_registrations || [];
        parsed.course_enrollments = parsed.course_enrollments || seedFallback.course_enrollments || [];
        parsed.course_exams = parsed.course_exams || seedFallback.course_exams || {};
        parsed.certificates = parsed.certificates || seedFallback.certificates || [];
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read persistent store from disk, initializing seed data:", err);
  }

  // First run: seed and persist
  const seed = getInitialSeedDatabase();
  try {
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write initial seed store to disk, keeping in memory:", err);
  }

  memoryCache = seed;
  return seed;
}

export function saveDatabase(db: PortalDatabase): PortalDatabase {
  db.updated_at = new Date().toISOString();
  memoryCache = db;

  const filePath = getStoreFilePath();
  try {
    const tempFile = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.error("Failed to write database to disk:", err);
  }

  return db;
}

export function resetDatabase(): PortalDatabase {
  const seed = getInitialSeedDatabase();
  return saveDatabase(seed);
}

export function exportDatabaseJson(): string {
  const db = loadDatabase();
  return JSON.stringify(db, null, 2);
}

export function importDatabaseJson(jsonString: string): PortalDatabase {
  const parsed = JSON.parse(jsonString) as PortalDatabase;
  if (!parsed || !Array.isArray(parsed.lectures) || !Array.isArray(parsed.articles)) {
    throw new Error("Invalid database schema format.");
  }
  return saveDatabase(parsed);
}
