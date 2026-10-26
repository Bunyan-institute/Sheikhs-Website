import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sheikh_admin_session";
const DEFAULT_SECRET = "sheikh_ferej_portal_hmac_secret_key_2026_safe";

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "sheikh_admin_2026!",
  };
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const creds = getAdminCredentials();
  return user.trim() === creds.username.trim() && pass === creds.password;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Buffer.from(signature).toString("base64url");
}

async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const expectedSig = await hmacSign(data, secret);
  return expectedSig === signature;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    username,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString("base64url");
  const signature = await hmacSign(base64Payload, getSecretKey());
  return `${base64Payload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<{ username: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    const isValid = await hmacVerify(base64Payload, signature, getSecretKey());
    if (!isValid) return null;

    const payloadStr = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie || !cookie.value) return null;
  return verifySessionToken(cookie.value);
}

export { SESSION_COOKIE_NAME };
