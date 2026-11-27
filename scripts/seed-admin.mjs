#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";

const credentialFile = ".env.admin.local";
const rotate = process.argv.includes("--rotate");
const requestedUsername = process.env.ADMIN_USERNAME?.trim();
const requestedPassword = process.env.ADMIN_PASSWORD;
let credentials;
if (fs.existsSync(credentialFile) && !rotate && !requestedUsername && !requestedPassword) {
  credentials = Object.fromEntries(fs.readFileSync(credentialFile, "utf8").trim().split("\n").map((line) => {
    const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1)];
  }));
  if (!credentials.ADMIN_USERNAME || !credentials.ADMIN_PASSWORD || !credentials.ADMIN_PASSWORD_HASH || !credentials.ADMIN_SESSION_SECRET) throw new Error("Private credential file is incomplete; review it or explicitly use --rotate.");
} else {
  const password = requestedPassword || crypto.randomBytes(24).toString("base64url");
  const salt = crypto.randomBytes(16).toString("hex");
  credentials = {
    ADMIN_USERNAME: requestedUsername || "Sheiikh", ADMIN_PASSWORD: password,
    ADMIN_PASSWORD_HASH: `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`,
    ADMIN_SESSION_SECRET: crypto.randomBytes(48).toString("base64url"),
  };
  fs.writeFileSync(credentialFile, Object.entries(credentials).map(([key, value]) => `${key}=${value}`).join("\n") + "\n", { mode: 0o600 });
}
for (const filename of [".env.local", ".env.vercel"]) {
  let content = fs.existsSync(filename) ? fs.readFileSync(filename, "utf8") : "";
  for (const key of ["ADMIN_USERNAME", "ADMIN_PASSWORD_HASH", "ADMIN_SESSION_SECRET"]) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${credentials[key]}`;
    content = pattern.test(content) ? content.replace(pattern, line) : `${content}\n${line}`;
  }
  content = content.replace(/^ADMIN_PASSWORD=.*\n?/gm, "");
  fs.writeFileSync(filename, content, { mode: 0o600 });
  fs.chmodSync(filename, 0o600);
}
fs.chmodSync(credentialFile, 0o600);
fs.writeFileSync(".env.admin-login.local", `ADMIN_LOGIN_URL=https://www.sheikhmuhammedferej.info/admin/login\nADMIN_USERNAME=${credentials.ADMIN_USERNAME}\nADMIN_PASSWORD=${credentials.ADMIN_PASSWORD}\n`, { mode: 0o600 });
console.log(`Admin ${credentials.ADMIN_USERNAME} configured locally. Login details: .env.admin-login.local (private, ignored by Git).`);
console.log("For Vercel, set ADMIN_USERNAME, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET as encrypted production environment variables, then deploy.");
