import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { notifyAdmins } from "@/lib/push";

export const runtime = "nodejs";

/** Sends a test notification to the device that asked (or to all devices when no endpoint is given). */
export async function POST(req: Request) {
  if (!(await getSessionUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const result = await notifyAdmins({
    kind: "test",
    url: "/admin",
    tag: "test",
    onlyEndpoint: typeof body?.endpoint === "string" ? body.endpoint : undefined,
  });
  return NextResponse.json({ success: true, ...result });
}
