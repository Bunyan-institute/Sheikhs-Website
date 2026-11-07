import {
  setVapidDetails,
  sendNotification,
  WebPushError,
} from "web-push";
import {
  deletePushSubscriptionByEndpoint,
  listPushSubscriptions,
  touchPushSubscription,
  type PushSubscriptionRecord,
} from "@/lib/db/push-repository";
import { pushMessage, type PushKind } from "@/lib/push-messages";

export function vapidConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey, subject: process.env.VAPID_SUBJECT || "https://muhammedferej.pro.et" };
}

/** Local test hook (never in production): deliveries are POSTed here instead of to a real push service. */
const testSink = () => (process.env.NODE_ENV !== "production" ? process.env.PUSH_TEST_SINK : undefined);

export const isPushEnabled = () => Boolean(vapidConfig() || testSink());

export interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
  badge?: number;
}

type Sender = (sub: Pick<PushSubscriptionRecord, "endpoint" | "p256dh" | "auth">, payload: string) => Promise<{ status: number }>;

let customSender: Sender | null = null;
/** Lets tests replace the network call. */
export function setPushSender(sender: Sender | null) {
  customSender = sender;
}

const defaultSender: Sender = async (sub, payload) => {
  const sink = testSink();
  if (sink) {
    const res = await fetch(sink, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint, payload: JSON.parse(payload) }),
      signal: AbortSignal.timeout(4000),
    });
    return { status: res.status };
  }
  const cfg = vapidConfig();
  if (!cfg) throw new Error("VAPID keys are not configured");
  setVapidDetails(cfg.subject, cfg.publicKey, cfg.privateKey);
  try {
    const res = await sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload, {
      TTL: 60 * 60 * 24,
      urgency: "high",
      timeout: 8000,
    });
    return { status: res.statusCode };
  } catch (err) {
    if (err instanceof WebPushError) return { status: err.statusCode };
    throw err;
  }
};

export interface NotifyInput {
  kind: PushKind;
  /** Short non-personal detail shown as the body (an event or course title). */
  detail?: string;
  url: string;
  tag: string;
  badge?: number;
  /** Send only to this device (used by the "send a test" button). */
  onlyEndpoint?: string;
}

export interface NotifyResult {
  sent: number;
  removed: number;
  failed: number;
}

let warnedMissing = false;

/**
 * Tells every subscribed admin device about something new. It never throws: a push problem must never break the
 * visitor's request. Devices whose subscription has expired (HTTP 404/410) are removed. Sends and database writes
 * are sequential (the Supabase pooler does not like concurrent queries on one connection).
 */
export async function notifyAdmins(input: NotifyInput): Promise<NotifyResult> {
  const result: NotifyResult = { sent: 0, removed: 0, failed: 0 };
  try {
    if (!isPushEnabled()) {
      if (!warnedMissing) {
        warnedMissing = true;
        console.warn("[push] VAPID keys are not set; push notifications are disabled.");
      }
      return result;
    }
    const send = customSender ?? defaultSender;
    const subs = (await listPushSubscriptions()).filter((s) => !input.onlyEndpoint || s.endpoint === input.onlyEndpoint);
    for (const sub of subs) {
      const msg = pushMessage(input.kind, sub.locale, input.detail);
      const payload = JSON.stringify({ title: msg.title, body: msg.body, url: input.url, tag: input.tag, badge: input.badge } satisfies PushPayload);
      try {
        const { status } = await send(sub, payload);
        if (status === 404 || status === 410) {
          await deletePushSubscriptionByEndpoint(sub.endpoint);
          result.removed++;
        } else if (status >= 200 && status < 300) {
          await touchPushSubscription(sub.endpoint);
          result.sent++;
        } else {
          result.failed++;
        }
      } catch (err) {
        result.failed++;
        console.warn("[push] delivery failed:", err instanceof Error ? err.message : err);
      }
    }
  } catch (err) {
    console.error("[push] notifyAdmins failed:", err);
  }
  return result;
}
