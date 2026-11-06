#!/usr/bin/env node
// Fails when the four locale files do not have exactly the same keys.
import fs from "node:fs";
import path from "node:path";

const LOCALES = ["en", "ar", "am", "om"];
const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
const keys = Object.fromEntries(
  LOCALES.map((l) => [l, new Set(flatten(JSON.parse(fs.readFileSync(path.resolve("src/i18n/messages", `${l}.json`), "utf8"))))])
);
let bad = false;
for (const l of LOCALES.filter((x) => x !== "en")) {
  const missing = [...keys.en].filter((k) => !keys[l].has(k));
  const extra = [...keys[l]].filter((k) => !keys.en.has(k));
  if (missing.length || extra.length) {
    bad = true;
    console.error(`${l}: missing ${missing.length} ${missing.slice(0, 8).join(", ")} | extra ${extra.length} ${extra.slice(0, 8).join(", ")}`);
  }
}
console.log(bad ? "i18n parity: FAILED" : `i18n parity: ok (${keys.en.size} keys x ${LOCALES.length} locales)`);
process.exit(bad ? 1 : 0);
