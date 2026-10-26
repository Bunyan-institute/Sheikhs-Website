import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getAllLectures } from "@/lib/db/repository";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lectures = getAllLectures();
  return NextResponse.json({ lectures });
}
