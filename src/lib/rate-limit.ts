/** Small in-memory fixed-window limiter. Suitable for the single-instance deployment this app targets. */

interface Bucket {
  count: number;
  resetAt: number;
}

const g = globalThis as unknown as { __rateBuckets?: Map<string, Bucket> };
const buckets = (g.__rateBuckets ??= new Map<string, Bucket>());

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
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
