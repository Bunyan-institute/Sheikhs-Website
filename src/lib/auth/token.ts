/**
 * Edge-safe session token helpers (WebCrypto only) shared by middleware and the Node server code.
 * Token format: base64url(JSON payload) "." base64url(HMAC-SHA256 signature)
 */

export const SESSION_COOKIE_NAME = "sheikh_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  sid: string;
  username: string;
  exp: number;
}

const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/**
 * Secret used to sign sessions. Mandatory in production. Development uses a fixed, publicly-known
 * value (middleware and route handlers run in different runtimes, so a per-process random would not match).
 */
export function getSessionSecret(): string {
  const fromEnv = process.env.ADMIN_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set (16+ characters) in production.");
  }
  return "development-only-insecure-session-secret";
}

async function hmacKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(getSessionSecret()), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = b64urlEncode(encoder.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey("sign"), encoder.encode(body));
  return `${body}.${b64urlEncode(new Uint8Array(sig))}`;
}

/** Verifies signature (constant-time via subtle.verify) and expiry. Does not check revocation. */
export async function verifySessionSignature(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const [body, sig, extra] = token.split(".");
    if (!body || !sig || extra !== undefined) return null;
    const ok = await crypto.subtle.verify("HMAC", await hmacKey("verify"), b64urlDecode(sig) as BufferSource, encoder.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body))) as SessionPayload;
    if (!payload.sid || !payload.username || typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
