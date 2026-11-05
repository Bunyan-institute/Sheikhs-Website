import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getAllLectures, getAllSeries } from "@/lib/db/repository";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [lectures, series] = await Promise.all([getAllLectures(), getAllSeries()]);
  return NextResponse.json({ lectures, series: series.map((s) => ({ id: s.id, title: s.title })) });
}
