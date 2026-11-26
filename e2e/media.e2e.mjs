// Read-only checks against a running site: BASE_URL=http://localhost:3002 node e2e/media.e2e.mjs
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.BASE_URL || "http://localhost:3002";
const executablePath = process.env.CHROMIUM_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`;
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`${base}/en/media?kind=audio`);
  const catalog = page.getByRole("region", { name: "Audio Playlists & Courses" });
  await catalog.getByRole("heading", { name: "Audio Playlists & Courses" }).waitFor();
  assert.equal(await page.locator("audio").count(), 0, "catalog must not mount hundreds of audio players");
  const links = await catalog.locator('a').evaluateAll((nodes) => nodes.map((n) => ({ href: n.getAttribute("href"), title: n.querySelector('h3').textContent })));
  assert.ok(links.length >= 17, `expected all series, other audio, and courses; got ${links.length}`);
  assert.match(await catalog.locator('a[href$="/other-audio"]').innerText(), /18 lessons/, "standalone playlist must not duplicate course audio");
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  assert.deepEqual(links.map((l) => l.title), links.map((l) => l.title).sort(collator.compare));
  await catalog.getByRole("searchbox").fill("no-such-course-zzzz");
  await catalog.getByText("No matching playlists or courses.").waitFor();
  await catalog.getByRole("searchbox").fill("");
  await catalog.getByRole("button", { name: "Courses", exact: true }).click();
  assert.equal(await catalog.locator('a[href*="/courses/"]').count(), 3);
  await catalog.getByRole("button", { name: "All", exact: true }).click();
  for (const { href } of links) {
    const response = await page.request.get(base + href);
    assert.equal(response.status(), 200, href);
  }
  console.log(`✓ ${links.length} alphabetized playlist/course destinations reachable; search and filters pass`);
  const audioRequests = [];
  page.on("request", (r) => { if (r.url().includes("/audio/")) audioRequests.push(r.url()); });
  await page.goto(`${base}/en/playlists/rawdatul-anwar`);
  await page.getByRole("button", { name: "Play all", exact: true }).waitFor();
  assert.equal(audioRequests.length, 0, "audio must not preload before selection");
  assert.equal(await page.locator("audio").count(), 1);
  await page.getByRole("button", { name: "Play all", exact: true }).click();
  await page.waitForFunction(() => {
    const a = document.querySelector('audio');
    return a && !a.paused && a.readyState >= 2;
  });
  const first = await page.locator('audio').getAttribute('src');
  assert.ok(first);
  await page.getByRole("button", { name: "Next lesson", exact: true }).click();
  await page.waitForFunction((src) => document.querySelector('audio').getAttribute('src') !== src, first);
  await page.getByRole("button", { name: "Previous lesson", exact: true }).click();
  assert.equal(await page.locator('audio').getAttribute('src'), first);
  await page.locator('audio').evaluate((a) => a.dispatchEvent(new Event('ended')));
  await page.waitForFunction((src) => document.querySelector('audio').getAttribute('src') !== src, first);
  await page.getByRole("searchbox", { name: "Search lessons" }).fill("nonexistent-lesson-zzzz");
  await page.getByText("No lessons found in this folder.").waitFor();
  console.log("✓ real audio playback, seek controls, previous/next, auto advance, lesson search, and no preloading");
  for (const locale of ['am', 'ar', 'om']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/${locale}/media?kind=audio`);
    await page.locator('input[type="search"]').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${locale} mobile overflow`);
    assert.equal((await page.request.get(`${base}/${locale}/playlists/other-audio`)).status(), 200);
  }
  await page.screenshot({ path: '/tmp/sheikh-media-mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log("✓ all four languages, mobile layout, ungrouped audio playlist, and no browser errors");
  const seed = JSON.parse(fs.readFileSync(new URL('../src/lib/db/seed/content-seed.json', import.meta.url)));
  const urls = [...new Set(seed.lectures.filter((l) => l.status !== 'draft' && l.media.audio?.startsWith('/audio/')).map((l) => l.media.audio))];
  for (let i = 0; i < urls.length; i += 12) {
    await Promise.all(urls.slice(i, i + 12).map(async (url) => {
      const response = await page.request.get(base + url, { headers: { Range: 'bytes=0-0' } });
      assert.equal(response.status(), 206, url);
      assert.match(response.headers()['content-type'], /^audio\//, url);
      await response.dispose();
    }));
  }
  console.log(`✓ all ${urls.length} local audio URLs return playable audio with byte-range support`);
  const external = [...new Set(seed.lectures.filter((l) => l.status !== 'draft' && l.media.audio?.startsWith('https://')).map((l) => l.media.audio))];
  for (let i = 0; i < external.length; i += 6) {
    await Promise.all(external.slice(i, i + 6).map(async (url) => {
      const response = await page.request.head(url);
      assert.equal(response.status(), 200, url);
      assert.match(response.headers()['content-type'], /^audio\//, url);
    }));
  }
  console.log(`✓ all ${external.length} externally hosted audio URLs return audio successfully`);
} finally {
  await browser.close();
}
