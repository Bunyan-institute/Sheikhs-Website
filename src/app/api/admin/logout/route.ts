import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, destroySession } from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  await destroySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
