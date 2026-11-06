import crypto from "crypto";
import { execute, queryAll } from "./client";
import { ready } from "./repository";

export interface PushSubscriptionRecord {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  username: string;
  locale: string | null;
  user_agent: string | null;
  created_at: string;
  last_used_at: string | null;
}

const toRecord = (r: Record<string, unknown>): PushSubscriptionRecord => ({
  id: String(r.id),
  endpoint: String(r.endpoint),
  p256dh: String(r.p256dh),
  auth: String(r.auth),
  username: String(r.username),
  locale: r.locale == null ? null : String(r.locale),
  user_agent: r.user_agent == null ? null : String(r.user_agent),
  created_at: String(r.created_at),
  last_used_at: r.last_used_at == null ? null : String(r.last_used_at),
});

/** One row per device: subscribing again from the same browser updates the keys instead of adding a duplicate. */
export async function upsertPushSubscription(input: {
  endpoint: string;
  p256dh: string;
  auth: string;
  username: string;
  locale?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  await ready();
  await execute(
    `INSERT INTO push_subscriptions (id, endpoint, p256dh, auth, username, locale, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth,
       username = excluded.username, locale = excluded.locale, user_agent = excluded.user_agent;`,
    [`psh_${crypto.randomBytes(6).toString("hex")}`, input.endpoint, input.p256dh, input.auth, input.username, input.locale ?? null, (input.userAgent ?? "").slice(0, 300) || null, new Date().toISOString()]
  );
}

export async function listPushSubscriptions(): Promise<PushSubscriptionRecord[]> {
  await ready();
  return (await queryAll<Record<string, unknown>>("SELECT * FROM push_subscriptions ORDER BY created_at DESC;")).map(toRecord);
}

export async function deletePushSubscriptionByEndpoint(endpoint: string): Promise<boolean> {
  await ready();
  return (await execute("DELETE FROM push_subscriptions WHERE endpoint = ?;", [endpoint])).rowsAffected > 0;
}

export async function deletePushSubscriptionById(id: string): Promise<boolean> {
  await ready();
  return (await execute("DELETE FROM push_subscriptions WHERE id = ?;", [id])).rowsAffected > 0;
}

export async function touchPushSubscription(endpoint: string): Promise<void> {
  await ready();
  await execute("UPDATE push_subscriptions SET last_used_at = ? WHERE endpoint = ?;", [new Date().toISOString(), endpoint]);
}

export async function countPendingInquiries(): Promise<number> {
  await ready();
  const rows = await queryAll<{ n: number | string }>("SELECT count(*) AS n FROM inquiries WHERE status = 'pending';");
  return Number(rows[0]?.n ?? 0);
}
