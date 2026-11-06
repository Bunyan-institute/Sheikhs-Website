import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { deletePushSubscriptionById, listPushSubscriptions } from "@/lib/db/push-repository";

export const runtime = "nodejs";

/** Short, human description of a browser from its user-agent string. */
function describe(ua: string | null): string {
  if (!ua) return "Unknown device";
  const os = /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Device";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  return `${browser} · ${os}`;
}

export async function GET() {
  if (!(await getSessionUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const devices = (await listPushSubscriptions()).map((s) => ({
    id: s.id,
    endpoint: s.endpoint,
    label: describe(s.user_agent),
    created_at: s.created_at,
    last_used_at: s.last_used_at,
  }));
  return NextResponse.json({ devices });
}

export async function DELETE(req: Request) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  return NextResponse.json({ success: await deletePushSubscriptionById(id) });
}
