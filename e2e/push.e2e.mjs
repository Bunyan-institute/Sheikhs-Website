// Push notification flow, end to end, without any real push service.
//
// Start the app with the test sink so deliveries go to this script instead of Google/Apple/Mozilla:
//   PUSH_TEST_SINK=http://127.0.0.1:4599/sink npm run dev         (needs VAPID_* keys in .env.local)
//   BASE_URL=http://localhost:3002 node e2e/push.e2e.mjs
import http from "node:http";
import crypto from "node:crypto";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3002";
const USER = process.env.ADMIN_USERNAME || "admin";
const PASS = process.env.ADMIN_PASSWORD || "sheikh_admin_2026!";
const SINK_PORT = Number(process.env.SINK_PORT || 4599);
const exe = process.env.CHROMIUM_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`;
const run = Date.now().toString(36);
// Remote databases are slower: E2E_SLOW multiplies timeouts and the "nothing more arrives" waits.
const SLOW = Number(process.env.E2E_SLOW || 1);
const ip = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

// ── the fake push service ──
const received = [];
let sinkStatus = 201;
const sink = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    try {
      received.push(JSON.parse(body));
    } catch {
      // ignore malformed
    }
    res.statusCode = sinkStatus;
    res.end();
  });
});
await new Promise((r) => sink.listen(SINK_PORT, "127.0.0.1", r));

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(true);
    console.log("  ✓", name);
  } catch (e) {
    results.push(false);
    console.log("  ✗", name, "\n     ", (process.env.DEBUG ? e.message : e.message.split("\n")[0]));
  }
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};
const eventually = async (fn, ms = 20000 * SLOW) => {
  const end = Date.now() + ms;
  let last;
  while (Date.now() < end) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw last;
};
const lastPayload = (tag) => [...received].reverse().find((r) => r.payload?.tag === tag)?.payload;
const post = (page, url, data) => page.request.post(BASE + url, { data, headers: { "x-forwarded-for": ip } });

// A fake browser subscription with real P-256 keys, so the server's validation and storage are exercised for real.
const ecdh = crypto.createECDH("prime256v1");
ecdh.generateKeys();
const fakeKeys = { p256dh: ecdh.getPublicKey().toString("base64url"), auth: crypto.randomBytes(16).toString("base64url") };

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addCookies([{ name: "admin_locale", value: "en", url: BASE }]);
await ctx.grantPermissions(["notifications"], { origin: BASE });
await ctx.addInitScript(({ keys, endpointBase }) => {
  // The browser's real push service needs the internet; these stubs keep the permission prompt and the
  // subscription local while everything else (our UI, API, database, sender) runs for real.
  const store = {
    get perm() { return localStorage.getItem("__perm") || "default"; },
    get sub() { try { return JSON.parse(localStorage.getItem("__sub") || "null"); } catch { return null; } },
  };
  Object.defineProperty(Notification, "permission", { get: () => store.perm, configurable: true });
  Notification.requestPermission = async () => { localStorage.setItem("__perm", "granted"); return "granted"; };
  const wrap = (s) => s && ({
    endpoint: s.endpoint,
    options: { applicationServerKey: new Uint8Array(s.key).buffer },
    toJSON: () => ({ endpoint: s.endpoint, keys }),
    unsubscribe: async () => { localStorage.removeItem("__sub"); return true; },
  });
  PushManager.prototype.getSubscription = async function () { return wrap(store.sub); };
  PushManager.prototype.subscribe = async function (opts) {
    const s = { endpoint: `${endpointBase}/${Math.random().toString(36).slice(2)}`, key: Array.from(new Uint8Array(opts.applicationServerKey)) };
    localStorage.setItem("__sub", JSON.stringify(s));
    return wrap(s);
  };
}, { keys: fakeKeys, endpointBase: `http://127.0.0.1:${SINK_PORT}/push` });
const page = await ctx.newPage();
page.setDefaultTimeout(45000 * Math.max(1, SLOW / 2));

console.log("\nPush notifications");
await step("the server is running with push enabled and a signed-in admin can open the settings", async () => {
  await page.goto(BASE + "/admin/login");
  await page.locator('input[type="text"]').first().fill(USER);
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(BASE + "/admin");
  const info = await (await page.request.get(BASE + "/api/admin/push/subscribe")).json();
  assert(info.enabled && info.publicKey, `push not enabled on the server: ${JSON.stringify(info)} (start it with PUSH_TEST_SINK and VAPID keys)`);
});

await step("the subscribe API rejects anonymous callers and invalid subscriptions", async () => {
  const anon = await (await import("playwright-core")).request.newContext({ baseURL: BASE });
  assert((await anon.post("/api/admin/push/subscribe", { data: { subscription: {} } })).status() === 401, "anonymous must get 401");
  assert((await anon.get("/api/admin/push/devices")).status() === 401, "devices need a session");
  await anon.dispose();
  for (const bad of [{}, { subscription: { endpoint: "http://evil.example/x", keys: fakeKeys } }, { subscription: { endpoint: `http://127.0.0.1:${SINK_PORT}/push/x`, keys: { p256dh: "!!", auth: "x" } } }]) {
    assert((await page.request.post(BASE + "/api/admin/push/subscribe", { data: bad })).status() === 400, `bad body should be 400: ${JSON.stringify(bad).slice(0, 60)}`);
  }
});

await step("turning notifications on in the app stores this device", async () => {
  await page.goto(BASE + "/admin");
  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Notifications" }).click();
  const dlg = page.getByRole("dialog");
  await dlg.locator('[data-notification-status="off"]').waitFor();
  await dlg.getByRole("button", { name: "Turn on notifications" }).click();
  await dlg.locator('[data-notification-status="on"]').waitFor();
  const { devices } = await (await page.request.get(BASE + "/api/admin/push/devices")).json();
  assert(devices.length === 1 && devices[0].endpoint.includes(`127.0.0.1:${SINK_PORT}`), `expected one device, got ${JSON.stringify(devices)}`);
});

await step('"Send a test" delivers a notification to this device', async () => {
  const dlg = page.getByRole("dialog");
  await dlg.getByRole("button", { name: "Send a test" }).click();
  await eventually(async () => assert(lastPayload("test")?.title === "Notifications are working", "test notification not received"));
  assert(lastPayload("test").url === "/admin", "test opens the dashboard");
  await page.keyboard.press("Escape");
});

await step("a visitor's question notifies the admin with the pending count and no question text", async () => {
  const before = received.length;
  const r = await post(page, "/api/inquiries", { body: `Private question text ${run}`, askerName: "Visitor" });
  assert(r.ok(), "question accepted");
  await eventually(async () => assert(lastPayload("inquiry") && received.length > before, "inquiry notification"));
  const p = lastPayload("inquiry");
  assert(p.title === "New question" && p.url === "/admin/inquiries", JSON.stringify(p));
  assert(typeof p.badge === "number" && p.badge >= 1, "badge carries the pending count");
  assert(!JSON.stringify(p).includes("Private question text"), "the question text must not appear on the lock screen");
});

await step("an event registration notifies with the event title", async () => {
  const events = await (await page.request.get(BASE + "/en/events")).text();
  const slug = events.match(/\/events\/([a-z0-9-]+)/)?.[1];
  assert(slug, "an event exists");
  const r = await post(page, "/api/events/register", { event_id: slug, name: "Push Guest", email: `push-${run}@example.com` });
  assert(r.ok(), "registered");
  await eventually(async () => {
    const p = lastPayload(`registration-${slug}`) ?? [...received].reverse().map((x) => x.payload).find((x) => x?.tag?.startsWith("registration-"));
    assert(p && p.title === "New event registration" && p.body && !p.body.includes("Push Guest"), "registration notification without the guest's name");
  });
});

// A course with an exam is needed to test enrollment and exam-passed notifications.
const F = (scope, text) => scope.locator(`xpath=.//label[normalize-space()="${text}"]/following-sibling::*[self::input or self::textarea or self::select][1]`);
const courseSlug = `e2e-push-course-${run}`;
const courseTitle = `Push Course ${run}`;
await step("set up a course with a one-question exam", async () => {
  await page.goto(BASE + "/admin/courses");
  await page.getByRole("button", { name: "Create New Course" }).first().click();
  let form = page.locator("form").last();
  await F(form, "Course Title *").fill(courseTitle);
  await F(form, "URL Slug *").fill(courseSlug);
  await page.getByRole("button", { name: "Save Course" }).click();
  await page.getByText(courseTitle).first().waitFor();
  const card = page.locator("div").filter({ hasText: courseTitle }).filter({ has: page.getByRole("button", { name: "Exam" }) }).filter({ visible: true }).last();
  await card.getByRole("button", { name: "Exam" }).click();
  const dlg = page.getByRole("dialog").last().or(page.locator(".fixed").filter({ hasText: `Exam — ${courseTitle}` })).last();
  await dlg.getByPlaceholder("Question text").fill("2 + 2 = ?");
  await dlg.getByPlaceholder("Option 1").fill("3");
  await dlg.getByPlaceholder("Option 2").fill("4");
  await dlg.getByLabel("Option 2 is correct").check();
  await dlg.getByRole("button", { name: "Save exam" }).click();
  await page.getByText("Exam saved").waitFor();
});

const studentEmail = `student-${run}@example.com`;
await step("enrolling notifies once; enrolling again does not", async () => {
  const r = await post(page, "/api/courses/enroll", { course_id: courseSlug, student_name: "Push Student", student_email: studentEmail });
  assert(r.ok(), "enrolled");
  await eventually(async () => assert(received.some((x) => x.payload?.title === "New course enrollment" && x.payload.body === courseTitle), "enrollment notification with course title"));
  const count = () => received.filter((x) => x.payload?.title === "New course enrollment").length;
  const before = count();
  await post(page, "/api/courses/enroll", { course_id: courseSlug, student_name: "Push Student", student_email: studentEmail });
  await new Promise((r) => setTimeout(r, 2500 * SLOW));
  assert(count() === before, "a repeat sign-up is not news");
});

await step("passing the exam notifies once; retaking does not", async () => {
  const exam = (answers) => post(page, "/api/courses/exam", { course_id: courseSlug, student_email: studentEmail, answers });
  const wrong = await (await exam({ q1: 0 })).json();
  assert(wrong.passed === false, "wrong answer fails");
  assert(!received.some((x) => x.payload?.title === "A student passed the exam"), "no notification for a fail");
  const right = await (await exam({ q1: 1 })).json();
  assert(right.passed, "right answer passes");
  await eventually(async () => assert(received.some((x) => x.payload?.title === "A student passed the exam" && x.payload.body === courseTitle), "exam notification"));
  const count = () => received.filter((x) => x.payload?.title === "A student passed the exam").length;
  const before = count();
  await exam({ q1: 1 });
  await new Promise((r) => setTimeout(r, 2500 * SLOW));
  assert(count() === before, "a retake is not news");
});

await step("the real service worker shows a pushed notification and only opens admin pages", async () => {
  await page.goto(BASE + "/admin");
  const cdp = await ctx.newCDPSession(page);
  let registrationId;
  cdp.on("ServiceWorker.workerRegistrationUpdated", (e) => {
    for (const r of e.registrations) if (r.scopeURL.replace(/\/$/, "").endsWith("/admin")) registrationId = r.registrationId;
  });
  await cdp.send("ServiceWorker.enable");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await eventually(async () => assert(registrationId, "service worker registration id"));
  const deliver = (payload) => cdp.send("ServiceWorker.deliverPushMessage", { origin: BASE, registrationId, data: JSON.stringify(payload) });
  const list = () => page.evaluate(async () => (await (await navigator.serviceWorker.getRegistration("/admin")).getNotifications()).map((n) => ({ title: n.title, tag: n.tag, url: n.data?.url })));
  await deliver({ title: "ሰላም", body: "ፈተና", url: "/admin/inquiries?x=1", tag: "t-good" });
  await eventually(async () => {
    const now = await list();
    assert(now.some((n) => n.tag === "t-good"), `first notification shown (saw ${JSON.stringify(now)}, permission ${await page.evaluate(() => Notification.permission)}, registration ${registrationId})`);
  });
  await deliver({ title: "Evil", body: "x", url: "https://evil.example/phish", tag: "t-evil" });
  const shown = await eventually(async () => {
    const l = await list();
    assert(l.some((n) => n.tag === "t-evil"), `second notification not shown yet: ${JSON.stringify(l)}`);
    return l;
  });
  assert(shown.find((n) => n.tag === "t-good").url === "/admin/inquiries?x=1", "same-site admin URL is kept");
  assert(shown.find((n) => n.tag === "t-evil").url === "/admin", "a foreign URL is replaced by /admin");
  assert(shown.find((n) => n.tag === "t-good").title === "ሰላም", "Amharic title shown");
});

await step("an expired device (HTTP 410) is removed automatically", async () => {
  sinkStatus = 410;
  await post(page, "/api/inquiries", { body: `Expired device check ${run}` });
  await eventually(async () => {
    const { devices } = await (await page.request.get(BASE + "/api/admin/push/devices")).json();
    assert(devices.length === 0, `device should be pruned, still ${devices.length}`);
  });
  sinkStatus = 201;
});

await step("clean up the test course", async () => {
  await page.goto(BASE + "/admin/courses");
  const card = page.locator("div").filter({ hasText: courseTitle }).filter({ has: page.getByRole("button", { name: "Delete" }) }).filter({ visible: true }).last();
  await card.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(800);
});

await browser.close();
sink.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
