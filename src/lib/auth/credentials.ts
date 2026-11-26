import crypto from "node:crypto";

export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "sheikh_admin_2026!";

export function getConfiguredCredentials(env: NodeJS.ProcessEnv = process.env): { username: string; passwordHash?: string; password?: string } | null {
  const username = env.ADMIN_USERNAME?.trim();
  if (username && (env.ADMIN_PASSWORD_HASH || env.ADMIN_PASSWORD)) {
    return { username, passwordHash: env.ADMIN_PASSWORD_HASH, password: env.ADMIN_PASSWORD };
  }
  if (env.NODE_ENV === "production") return null;
  return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

const digest = (value: string) => crypto.createHash("sha256").update(value).digest();

export function verifyAdminCredentials(username: string, password: string, env: NodeJS.ProcessEnv = process.env): boolean {
  const credentials = getConfiguredCredentials(env);
  if (!credentials) return false;
  let matches: boolean;
  if (credentials.passwordHash) {
    const parts = credentials.passwordHash.split(":");
    if (parts.length !== 2 || !/^[a-f0-9]{32}$/i.test(parts[0]) || !/^[a-f0-9]{128}$/i.test(parts[1])) return false;
    const expected = Buffer.from(parts[1], "hex");
    matches = crypto.timingSafeEqual(crypto.scryptSync(password, parts[0], 64), expected);
  } else {
    matches = crypto.timingSafeEqual(digest(password), digest(credentials.password ?? ""));
  }
  return crypto.timingSafeEqual(digest(username.trim()), digest(credentials.username)) && matches;
}

export function isAdminConfigured(): boolean {
  return getConfiguredCredentials() !== null;
}
