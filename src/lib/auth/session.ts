import crypto from "crypto";
import { cookies } from "next/headers";
import { execute, queryOne } from "@/lib/db/client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySessionSignature,
} from "./token";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

export { DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, hashPassword, verifyAdminCredentials, isAdminConfigured } from "./credentials";

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
