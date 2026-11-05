/**
 * Fixed-window rate limiter backed by the database, so limits hold across restarts and across
 * serverless instances. Falls back to in-process counters if the database is unavailable.
 */
import { execute } from "@/lib/db/client";
import { ensureTablesExist } from "@/lib/db/sqlite-schema";

interface Bucket {
  count: number;
  resetAt: number;
}

const memory = new Map<string, Bucket>();

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function memoryLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  if (memory.size > 5000) for (const [k, b] of memory) if (b.resetAt <= now) memory.delete(k);
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateResult> {
  const now = Date.now();
  try {
    await ensureTablesExist();
    const res = await execute(
      `INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN rate_limits.reset_at <= ? THEN 1 ELSE rate_limits.count + 1 END,
         reset_at = CASE WHEN rate_limits.reset_at <= ? THEN ? ELSE rate_limits.reset_at END
       RETURNING count, reset_at;`,
      [key, now + windowMs, now, now, now + windowMs]
    );
    const row = res.rows[0];
    if (Math.random() < 0.01) await execute("DELETE FROM rate_limits WHERE reset_at < ?;", [now]).catch(() => {});
    const count = Number(row.count);
    return { allowed: count <= limit, retryAfterSeconds: Math.max(1, Math.ceil((Number(row.reset_at) - now) / 1000)) };
  } catch (err) {
    console.warn("Rate limiter fell back to memory:", err instanceof Error ? err.message : err);
    return memoryLimit(key, limit, windowMs);
  }
}

export async function clearRateLimit(key: string): Promise<void> {
  memory.delete(key);
  try {
    await execute("DELETE FROM rate_limits WHERE key = ?;", [key]);
  } catch {
    // best effort
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

/** Trims and caps user-supplied text. */
export function clean(value: unknown, max = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, max);
  return v || undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 254 && EMAIL_RE.test(v.trim());
