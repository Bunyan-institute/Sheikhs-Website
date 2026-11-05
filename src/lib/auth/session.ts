import crypto from "crypto";
import { cookies } from "next/headers";
import { execute, queryOne } from "@/lib/db/sqlite-client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySessionSignature,
} from "./token";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest();

/**
 * Admin credentials come from the environment:
 *   ADMIN_USERNAME, and either ADMIN_PASSWORD_HASH ("salt:hash", see scripts/hash-password.mjs) or ADMIN_PASSWORD.
 * Production refuses to authenticate without them; development falls back to admin / sheikh_admin_2026! with a warning.
 */
function getConfiguredCredentials(): { username: string; passwordHash?: string; password?: string } | null {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const password = process.env.ADMIN_PASSWORD;
  if (username && (passwordHash || password)) return { username, passwordHash, password };
  if (process.env.NODE_ENV === "production") return null;
  const g = globalThis as unknown as { __warnedDevCreds?: boolean };
  if (!g.__warnedDevCreds) {
    g.__warnedDevCreds = true;
    console.warn("[auth] ADMIN_USERNAME/ADMIN_PASSWORD not set: using the development login (admin / sheikh_admin_2026!).");
  }
  return { username: "admin", password: "sheikh_admin_2026!" };
}

export function isAdminConfigured(): boolean {
  return getConfiguredCredentials() !== null;
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

function passwordMatches(input: string, creds: NonNullable<ReturnType<typeof getConfiguredCredentials>>): boolean {
  if (creds.passwordHash) {
    const [salt, hash] = creds.passwordHash.split(":");
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, "hex");
    const actual = crypto.scryptSync(input, salt, expected.length);
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  }
  return crypto.timingSafeEqual(sha256(input), sha256(creds.password ?? ""));
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const creds = getConfiguredCredentials();
  if (!creds) return false;
  const userOk = crypto.timingSafeEqual(sha256(user.trim()), sha256(creds.username.trim()));
  const passOk = passwordMatches(pass, creds);
  return userOk && passOk;
}

/** Creates a server-side session record and returns the signed cookie value. */
export async function createSession(username: string): Promise<string> {
  await ensureTablesExist();
  const sid = crypto.randomUUID();
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  await execute("DELETE FROM admin_sessions WHERE expires_at < ?;", [Date.now()]);
  await execute("INSERT INTO admin_sessions (id, username, created_at, expires_at) VALUES (?, ?, ?, ?);", [
    sid,
    username,
    new Date().toISOString(),
    exp,
  ]);
  return signSession({ sid, username, exp });
}

export async function destroySession(token: string | undefined): Promise<void> {
  const payload = await verifySessionSignature(token);
  if (!payload) return;
  await ensureTablesExist();
  await execute("DELETE FROM admin_sessions WHERE id = ?;", [payload.sid]);
}

/** Valid signature, unexpired, and not revoked (the session row must still exist). */
export async function verifySessionToken(token: string | undefined): Promise<{ username: string } | null> {
  const payload = await verifySessionSignature(token);
  if (!payload) return null;
  await ensureTablesExist();
  const row = await queryOne("SELECT id FROM admin_sessions WHERE id = ? AND expires_at > ?;", [payload.sid, Date.now()]);
  return row ? { username: payload.username } : null;
}

export async function getSessionUser(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
