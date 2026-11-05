import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createSession,
  isAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";
import { clearRateLimit, clientIp, rateLimit } from "@/lib/rate-limit";

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const limitKey = `login:${clientIp(request)}`;
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Admin login is not configured on this server." }, { status: 503 });
    }

    const body = await request.json().catch(() => null);
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    if (verifyAdminCredentials(username, password)) {
      await clearRateLimit(limitKey);
      const token = await createSession(username.trim());
      const response = NextResponse.json({ success: true, username: username.trim() });
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
      return response;
    }

    const attempt = await rateLimit(limitKey, MAX_FAILED_ATTEMPTS, WINDOW_MS);
    if (!attempt.allowed) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(attempt.retryAfterSeconds) } }
      );
    }
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
