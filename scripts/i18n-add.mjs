#!/usr/bin/env node
// Merge new translation keys into every locale file in one go, keeping key order and formatting.
//   node scripts/i18n-add.mjs keys.json
// keys.json: { "admin.common": { "myKey": { "en": "...", "ar": "...", "am": "...", "om": "..." } } }
import fs from "node:fs";
import path from "node:path";

const LOCALES = ["en", "ar", "am", "om"];
const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/i18n-add.mjs keys.json");
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(file, "utf8"));
for (const locale of LOCALES) {
  const p = path.resolve("src/i18n/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const [ns, keys] of Object.entries(spec)) {
    let node = data;
    for (const part of ns.split(".")) node = node[part] ??= {};
    for (const [key, texts] of Object.entries(keys)) {
      if (!texts[locale]) throw new Error(`Missing ${locale} text for ${ns}.${key}`);
      node[key] = texts[locale];
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}
console.log("updated", LOCALES.join(", "));
