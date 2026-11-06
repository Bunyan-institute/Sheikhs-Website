// Pure-logic tests, no server needed: npm run test:unit (Node >= 22.6, uses --experimental-strip-types)
import test from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/lib/slugify.ts";

test("slugify: Latin titles and accents", () => {
  assert.equal(slugify("Explanation of Riyad us-Saliheen"), "explanation-of-riyad-us-saliheen");
  assert.equal(slugify("  Café  Déjà Vu!! "), "cafe-deja-vu");
});

test("slugify: Afaan Oromoo apostrophes are dropped, not split", () => {
  assert.equal(slugify("Ka'umsa Dhaabaa"), "kaumsa-dhaabaa");
});

test("slugify: Amharic titles produce a readable non-empty ASCII slug", () => {
  const slug = slugify("የሪያዱ ሷሊሂን ትምህርት");
  assert.match(slug, /^[a-z0-9-]+$/);
  assert.ok(slug.length > 5, `slug too short: ${slug}`);
  assert.equal(slugify("ኢትዮጵያ"), "ityopya");
  assert.equal(slugify("ሰላም"), "salam");
});

test("slugify: Arabic titles are romanised and diacritics ignored", () => {
  assert.match(slugify("رياض الصالحين"), /^[a-z0-9-]+$/);
  assert.equal(slugify("مُحَمَّد"), slugify("محمد"));
});

test("slugify: empty or symbol-only input falls back to a prefixed id", () => {
  assert.match(slugify("!!!"), /^item-[a-z0-9]{1,4}$/);
  assert.match(slugify("", { fallbackPrefix: "lec" }), /^lec-[a-z0-9]{1,4}$/);
});

test("slugify: respects the maximum length without a trailing dash", () => {
  const slug = slugify("a ".repeat(100), { maxLength: 11 });
  assert.ok(slug.length <= 11);
  assert.ok(!slug.endsWith("-"));
});
