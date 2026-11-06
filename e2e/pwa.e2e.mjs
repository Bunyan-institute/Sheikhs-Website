// PWA checks against a PRODUCTION server (the service worker only registers in production).
//   BASE_URL=http://localhost:3060 ADMIN_USERNAME=owner ADMIN_PASSWORD=... node e2e/pwa.e2e.mjs
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3060";
const USER = process.env.ADMIN_USERNAME || "admin";
const PASS = process.env.ADMIN_PASSWORD || "sheikh_admin_2026!";
const exe = process.env.CHROMIUM_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`;

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(true);
    console.log("  ✓", name);
  } catch (e) {
    results.push(false);
    console.log("  ✗", name, "\n     ", e.message.split("\n")[0]);
  }
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
await ctx.addCookies([{ name: "admin_locale", value: "en", url: BASE }]);
const page = await ctx.newPage();
page.setDefaultTimeout(30000);
const cdp = await ctx.newCDPSession(page);

console.log("\nPWA");
await step("login page links the manifest and is installable-ready", async () => {
  await page.goto(BASE + "/admin/login");
  assert((await page.locator('link[rel="manifest"]').getAttribute("href")) === "/admin.webmanifest", "manifest link");
  assert((await page.locator('meta[name="theme-color"]').getAttribute("content")) === "#0D3E2F", "theme color");
});

await step("service worker registers and activates with scope /admin", async () => {
  const scope = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return reg.scope;
  });
  assert(scope === BASE + "/admin", `unexpected scope ${scope}`);
});

await step("browser parses the manifest and reports no installability errors", async () => {
  await cdp.send("Page.enable");
  const { url, errors, data } = await cdp.send("Page.getAppManifest");
  assert(url.endsWith("/admin.webmanifest"), "manifest url");
  assert(!errors.length, `manifest errors: ${errors.map((e) => e.message).join("; ")}`);
  const m = JSON.parse(data);
  assert(m.display === "standalone" && m.start_url === "/admin?source=pwa" && m.scope === "/admin", "manifest fields");
  assert(m.icons.some((i) => i.purpose === "maskable" && i.sizes === "512x512"), "maskable icon");
  const { installabilityErrors } = await cdp.send("Page.getInstallabilityErrors");
  // Test browsers run in a private context, which can never install; every other reason is a real problem.
  const real = installabilityErrors.filter((e) => e.errorId !== "in-incognito");
  assert(real.length === 0, `installability: ${real.map((e) => e.errorId).join(", ")}`);
});

await step("all manifest icons load", async () => {
  for (const f of ["icon-192", "icon-512", "maskable-192", "maskable-512", "apple-touch-icon"]) {
    const r = await page.request.get(`${BASE}/icons/${f}.png`);
    assert(r.status() === 200 && r.headers()["content-type"] === "image/png", `${f} missing`);
  }
});

await step("sign in inside the installed-style window", async () => {
  await page.locator('input[type="text"]').first().fill(USER);
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(BASE + "/admin");
  await page.locator("main h1").first().waitFor();
});

await step("mobile layout: no horizontal scroll, menu opens", async () => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `page overflows horizontally by ${overflow}px`);
  const menu = page.locator("header button").first();
  await menu.click();
  await page.getByRole("link", { name: /articles/i }).first().waitFor();
});

await step("the worker controls the admin and does not cache pages, API or uploads", async () => {
  await page.reload();
  const controlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));
  assert(controlled, "page should be controlled by the service worker");
  await page.evaluate(() => fetch("/api/admin/lectures"));
  const cached = await page.evaluate(async () => {
    const out = [];
    for (const name of await caches.keys()) {
      for (const req of await (await caches.open(name)).keys()) out.push(new URL(req.url).pathname);
    }
    return out;
  });
  assert(!cached.some((p) => p.startsWith("/api") || p.startsWith("/uploads") || p === "/admin" || p.startsWith("/admin/")), `private paths cached: ${cached.filter((p) => p.startsWith("/admin") || p.startsWith("/api")).join(", ")}`);
  assert(cached.includes("/admin-offline.html"), "offline page should be precached");
});

await step("offline: navigating inside the admin shows the offline page, then recovers", async () => {
  await ctx.setOffline(true);
  await page.goto(BASE + "/admin/articles").catch(() => {});
  await page.getByRole("heading", { name: "You are offline" }).waitFor();
  await ctx.setOffline(false);
  await page.getByRole("button", { name: "Try again" }).click();
  await page.waitForURL(/\/admin\/articles/);
  await page.getByRole("button", { name: /Write New Article/ }).waitFor();
});

await step("public site stays outside the admin PWA service worker scope", async () => {
  await page.goto(BASE + "/");
  const controlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));
  assert(!controlled, "public pages must stay outside the admin service worker scope");
});

await step("manifest: launches into the admin, reuses the open window, offers create shortcuts", async () => {
  const m = await (await page.request.get(BASE + "/admin.webmanifest")).json();
  assert(m.launch_handler?.client_mode?.includes("navigate-existing"), "launch_handler");
  const urls = m.shortcuts.map((x) => x.url);
  for (const u of ["/admin/lectures?new=1", "/admin/articles?new=1", "/admin/inquiries", "/admin/media?new=1"]) assert(urls.includes(u), `shortcut ${u}`);
  assert(m.shortcuts.every((x) => x.url.startsWith("/admin")), "every shortcut stays inside the admin");
  assert(m.theme_color === "#0D3E2F" && m.lang === "am", "brand colour and Amharic app language");
  assert((await page.request.get(BASE + "/icons/badge-72.png")).status() === 200, "notification badge icon");
});

await step("the service worker handles push, notification taps and key changes", async () => {
  const sw = await (await page.request.get(BASE + "/admin-sw.js")).text();
  for (const needle of ['addEventListener("push"', 'addEventListener("notificationclick"', 'addEventListener("pushsubscriptionchange"', "showNotification", "safeAdminUrl"]) {
    assert(sw.includes(needle), `service worker should contain ${needle}`);
  }
  assert(!/cache\.put\([^)]*\/api/.test(sw), "API responses are never cached");
});

await step("a launch from the app pointed at a public page is sent to the admin (server side)", async () => {
  const r = await page.request.get(BASE + "/en?source=pwa", { maxRedirects: 0 });
  assert(r.status() === 307 && r.headers().location.endsWith("/admin"), `got ${r.status()} ${r.headers().location}`);
});

console.log("\nInstalled (standalone) behaviour");
const sctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
await sctx.addCookies([{ name: "admin_locale", value: "en", url: BASE }]);
await sctx.addInitScript(() => {
  // Pretend the page runs as an installed app.
  const real = window.matchMedia.bind(window);
  window.matchMedia = (q) =>
    q.includes("display-mode: standalone")
      ? { matches: true, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }
      : real(q);
});
const sp = await sctx.newPage();
sp.setDefaultTimeout(30000);
await step("the installed app never shows public pages: they redirect to the admin", async () => {
  for (const path of ["/en", "/en/about", "/am/articles", "/"]) {
    await sp.goto(BASE + path);
    await sp.waitForURL(/\/admin/);
  }
});
await step("inside the installed app there is no link to the public site", async () => {
  await sp.goto(BASE + "/admin/login");
  await sp.locator('input[type="text"]').first().fill(USER);
  await sp.locator('input[type="password"]').fill(PASS);
  await sp.locator('button[type="submit"]').click();
  await sp.waitForURL(BASE + "/admin");
  await sp.getByRole("button", { name: "More" }).click();
  await sp.getByRole("menuitem", { name: "Notifications" }).waitFor();
  assert((await sp.getByRole("menuitem", { name: "Live Site" }).count()) === 0, "no Live Site item in the installed app");
  await sp.keyboard.press("Escape");
  for (const path of ["/admin/lectures", "/admin/articles", "/admin/media"]) {
    await sp.goto(BASE + path);
    await sp.locator("main").first().waitFor();
    // The server renders these links; the browser hides them as soon as it knows it runs as an installed app.
    let external = [];
    for (let i = 0; i < 25; i++) {
      external = await sp.locator('a[target="_blank"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")).filter((h) => h && h.startsWith("/") && !h.startsWith("/admin") && !/^\/(uploads|images|audio|documents)\//.test(h)));
      if (external.length === 0) break;
      await sp.waitForTimeout(200);
    }
    assert(external.length === 0, `${path} links to the public site: ${external.join(", ")}`);
  }
});
await sctx.close();

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
