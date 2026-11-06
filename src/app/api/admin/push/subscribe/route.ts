import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";
import { deletePushSubscriptionByEndpoint, upsertPushSubscription } from "@/lib/db/push-repository";
import { isPushEnabled, vapidConfig } from "@/lib/push";
import { locales } from "@/i18n/config";

export const runtime = "nodejs";

const B64URL = /^[A-Za-z0-9_-]+={0,2}$/;

async function requireAdmin() {
  return getSessionUser();
}

/** The public key the browser needs to subscribe, read at request time so no rebuild is needed after setting it. */
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ enabled: isPushEnabled(), publicKey: vapidConfig()?.publicKey ?? null });
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const sub = body?.subscription;
  const endpoint: unknown = sub?.endpoint;
  const p256dh: unknown = sub?.keys?.p256dh;
  const auth: unknown = sub?.keys?.auth;

  let urlOk = false;
  try {
    const u = new URL(String(endpoint));
    // Real push services are https. A local http endpoint is accepted only when the dev test sink is on.
    urlOk = u.protocol === "https:" || (u.protocol === "http:" && ["127.0.0.1", "localhost"].includes(u.hostname) && Boolean(process.env.PUSH_TEST_SINK) && process.env.NODE_ENV !== "production");
  } catch {
    urlOk = false;
  }
  if (!urlOk || typeof endpoint !== "string" || endpoint.length > 1000 || typeof p256dh !== "string" || typeof auth !== "string" || !B64URL.test(p256dh) || !B64URL.test(auth) || p256dh.length > 200 || auth.length > 100) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  }

  const rawLocale = (await cookies()).get("admin_locale")?.value;
  const locale = locales.includes(rawLocale as (typeof locales)[number]) ? rawLocale! : "am";
  await upsertPushSubscription({ endpoint, p256dh, auth, username: user.username, locale, userAgent: req.headers.get("user-agent") });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (typeof body?.endpoint !== "string") return NextResponse.json({ error: "endpoint is required" }, { status: 400 });
  return NextResponse.json({ success: await deletePushSubscriptionByEndpoint(body.endpoint) });
}
