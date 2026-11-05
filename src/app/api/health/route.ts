import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db/sqlite-client";

export const dynamic = "force-dynamic";

/** Liveness/readiness probe: confirms the process is up and the database answers. */
export async function GET() {
  try {
    await queryOne("SELECT 1 AS ok;");
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "database unavailable" }, { status: 503 });
  }
}
