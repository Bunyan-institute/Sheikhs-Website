#!/usr/bin/env node
// Usage: node scripts/hash-password.mjs "my password"  ->  prints ADMIN_PASSWORD_HASH value
import crypto from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "<password>"');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`);
