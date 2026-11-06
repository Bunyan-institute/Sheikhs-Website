// End-to-end check of the admin workflow against a running dev/prod server.
//   BASE_URL=http://localhost:3002 ADMIN_USERNAME=admin ADMIN_PASSWORD=admin node e2e/admin.e2e.mjs
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3002";
const USER = process.env.ADMIN_USERNAME || "admin";
const PASS = process.env.ADMIN_PASSWORD || "sheikh_admin_2026!";
const exe = process.env.CHROMIUM_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`;
const run = Date.now().toString(36);

const results = [];
async function step(name, fn) {
  try {
    await fn();
    results.push([true, name]);
    console.log("  ✓", name);
  } catch (err) {
    results.push([false, name, err.message.split("\n")[0]]);
    console.log("  ✗", name, "\n     ", (process.env.DEBUG ? err.message : err.message.split("\n")[0]));
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
// The admin forms use bare <label> siblings, so find the control next to the label text.
const F = (scope, text) =>
  scope.locator(`xpath=.//label[normalize-space()="${text}"]/following-sibling::*[self::input or self::textarea or self::select][1]`);
const fakeIp = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const post = (url, data) => page.request.post(BASE + url, { data, headers: { "x-forwarded-for": fakeIp } });
const html = async (url) => (await page.request.get(BASE + url)).text();
// Retries an assertion until it holds (saves and revalidation take longer against a remote database).
const eventually = async (fn, ms = 40000 * Math.max(1, SLOW / 2)) => {
  const end = Date.now() + ms;
  let last;
  while (Date.now() < end) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw last;
};
const status = async (page, url) => (await page.request.get(BASE + url)).status();

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
// The admin opens in Amharic by default; the suite drives English labels.
await ctx.addCookies([{ name: "admin_locale", value: "en", url: BASE }]);
const page = await ctx.newPage();
// Remote databases are slower than a local file: E2E_SLOW multiplies the fixed pauses after saves.
const SLOW = Number(process.env.E2E_SLOW || 1);
const realWait = page.waitForTimeout.bind(page);
page.waitForTimeout = (ms) => realWait(ms * SLOW);
page.setDefaultTimeout(45000 * Math.max(1, SLOW / 2));
page.setDefaultNavigationTimeout(60000);
page.on("dialog", (d) => d.dismiss()); // native dialogs must never appear

const login = async () => {
  await page.goto(BASE + "/admin/login");
  await page.locator('input[type="text"]').first().fill(USER);
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(BASE + "/admin");
};

console.log("\nAuth");
await step("wrong password is rejected", async () => {
  await page.goto(BASE + "/admin/login");
  await page.locator('input[type="text"]').first().fill(USER);
  await page.locator('input[type="password"]').fill("definitely-wrong");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(800);
  assert(page.url().includes("/admin/login"), "should stay on login");
});
await step("unauthenticated /admin redirects to login", async () => {
  await page.goto(BASE + "/admin/articles");
  assert(page.url().includes("/admin/login"), `got ${page.url()}`);
});
await step("login succeeds", login);

console.log("\nArticles: draft → publish → upload → delete");
const slug = `e2e-article-${run}`;
const title = `E2E Article ${run}`;
await step("create article as draft with uploaded cover", async () => {
  await page.goto(BASE + "/admin/articles");
  await page.getByRole("button", { name: "Write New Article" }).click();
  const form = page.locator("form").last();
  await F(form, "Article Title *").fill(title);
  await F(form, "URL Slug *").fill(slug);
  await F(form, "Executive Summary").fill("Created by the e2e test.");
  await F(form, "Categories (comma separated)").fill("e2e-topic");
  await F(form, "Full Article Text / Markdown *").fill("<p>Body from e2e.</p>");
  // upload a cover through the Upload button's hidden file input
  const img = path.resolve("public/images/sheikh-portrait.jpg");
  await form.locator('input[type="file"]').setInputFiles(img);
  await page.getByText("File uploaded").waitFor();
  const coverValue = await form.locator('input[type="text"]').nth(3).inputValue().catch(() => "");
  const uploaded = (await form.locator("input").evaluateAll((els) => els.map((e) => e.value))).find((v) => v.startsWith("/uploads/"));
  assert(uploaded, `cover URL not filled (saw "${coverValue}")`);
  globalThis.__coverUrl = uploaded;
  await form.getByRole("checkbox").uncheck();
  await form.getByRole("button", { name: "Save Article" }).click();
  await page.getByText(title).first().waitFor();
});
await step("uploaded cover is served as an image", async () => {
  const r = await page.request.get(BASE + globalThis.__coverUrl);
  assert(r.status() === 200 && r.headers()["content-type"] === "image/jpeg", `status ${r.status()} ${r.headers()["content-type"]}`);
});
await step("draft is hidden from the public site", async () => {
  const detail = await (await page.request.get(`${BASE}/articles/${slug}`)).text();
  assert(!detail.includes("Body from e2e"), "draft body must not be served");
  const html = await (await page.request.get(BASE + "/articles")).text();
  assert(!html.includes(slug), "draft should not be listed");
});
await step("publishing makes it public", async () => {
  await page.goto(BASE + "/admin/articles");
  const card = page.locator("tr, article, div").filter({ hasText: title }).filter({ has: page.getByRole("button", { name: /edit/i }) }).last();
  await card.getByRole("button", { name: /edit/i }).first().click();
  const form = page.locator("form").last();
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Save Article" }).click();
  await page.waitForTimeout(1200);
  await eventually(async () => {
    const detail = await (await page.request.get(`${BASE}/articles/${slug}`)).text();
    assert(detail.includes("Body from e2e"), "published body should be served");
  });
  await eventually(async () => assert((await (await page.request.get(BASE + "/articles")).text()).includes(slug), "published article should be listed"));
});
await step("duplicate slug is rejected (not overwritten)", async () => {
  await page.goto(BASE + "/admin/articles");
  await page.getByRole("button", { name: "Write New Article" }).click();
  const form = page.locator("form").last();
  await F(form, "Article Title *").fill("Duplicate " + run);
  await F(form, "URL Slug *").fill(slug);
  await F(form, "Full Article Text / Markdown *").fill("x");
  await form.getByRole("button", { name: "Save Article" }).click();
  await page.getByText(/already used/i).waitFor();
  await page.keyboard.press("Escape");
});
await step("delete uses the in-app confirm dialog and removes it", async () => {
  await page.goto(BASE + "/admin/articles");
  const card = page.locator("tr, article, div").filter({ hasText: title }).filter({ has: page.getByRole("button", { name: /delete/i }) }).last();
  await card.getByRole("button", { name: /delete/i }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(1000);
  const detail = await (await page.request.get(`${BASE}/articles/${slug}`)).text();
  assert(!detail.includes("Body from e2e"), "deleted article must not be served");
});

console.log("\nCourses: lessons, exam, enrolment, certificate");
const courseSlug = `e2e-course-${run}`;
const courseTitle = `E2E Course ${run}`;
const email = `e2e-${run}@example.com`;
await step("create course with two lessons", async () => {
  await page.goto(BASE + "/admin/courses");
  await page.getByRole("button", { name: "Create New Course" }).click();
  const form = page.locator("form").last();
  await F(form, "Course Title *").fill(courseTitle);
  await F(form, "URL Slug *").fill(courseSlug);
  await form.getByRole("button", { name: "Add lesson" }).click();
  await form.getByRole("button", { name: "Add lesson" }).click();
  await form.getByLabel("Lesson 1 title").fill("Intro");
  await form.getByLabel("Lesson 2 title").fill("Basics");
  await form.getByRole("button", { name: "Save Course" }).click();
  await page.getByText(courseTitle).first().waitFor();
  const html = await (await page.request.get(`${BASE}/courses/${courseSlug}`)).text();
  assert(html.includes("Intro") && html.includes("Basics"), "lessons should render publicly");
});
await step("editing the course keeps its lessons", async () => {
  await page.goto(BASE + "/admin/courses");
  const card = page.locator("div").filter({ hasText: courseTitle }).filter({ has: page.getByRole("button", { name: "Edit" }) }).last();
  await card.getByRole("button", { name: "Edit" }).click();
  const form = page.locator("form").last();
  assert((await form.getByLabel("Lesson 2 title").inputValue()) === "Basics", "lessons should load into the editor");
  await form.getByRole("button", { name: "Save Course" }).click();
  await page.waitForTimeout(800);
  const html = await (await page.request.get(`${BASE}/courses/${courseSlug}`)).text();
  assert(html.includes("Basics"), "lessons survived re-save");
});
await step("add an exam through the editor", async () => {
  await page.goto(BASE + "/admin/courses");
  const card = page.locator("div").filter({ hasText: courseTitle }).filter({ has: page.getByRole("button", { name: "Exam" }) }).last();
  await card.getByRole("button", { name: "Exam" }).click();
  const dlg = page.locator(".fixed").filter({ hasText: `Exam — ${courseTitle}` });
  await dlg.getByPlaceholder("Question text").fill("2 + 2 = ?");
  await dlg.getByPlaceholder("Option 1").fill("3");
  await dlg.getByPlaceholder("Option 2").fill("4");
  await dlg.getByLabel("Option 2 is correct").check();
  await dlg.getByRole("button", { name: "Save exam" }).click();
  await page.getByText("Exam saved").waitFor();
});
await step("public course page hides the answer key", async () => {
  const html = await (await page.request.get(`${BASE}/courses/${courseSlug}`)).text();
  assert(html.includes("2 + 2"), "exam question should be present");
  assert(!/correct_option_index\\?":[0-9]/.test(html), "answer key must not be sent to the browser");
});
await step("exam requires enrolment; enrolling then passing issues a certificate", async () => {
  const noEnrol = await post("/api/courses/exam", { course_id: courseSlug, student_email: email, answers: { q1: 1 } });
  assert(noEnrol.status() === 403, `expected 403 got ${noEnrol.status()}`);
  const enrol = await post("/api/courses/enroll", { course_id: courseSlug, student_name: "E2E Student", student_email: email });
  assert(enrol.ok(), "enrol failed");
  const wrong = await (await post("/api/courses/exam", { course_id: courseSlug, student_email: email, answers: { q1: 0 } })).json();
  assert(wrong.passed === false, "wrong answer should fail");
  const right = await (await post("/api/courses/exam", { course_id: courseSlug, student_email: email, answers: { q1: 1 } })).json();
  assert(right.passed && right.certificate?.id, "right answer should pass with a certificate");
  globalThis.__cert = right.certificate.id;
  const v = await (await page.request.get(`${BASE}/api/verify/${globalThis.__cert}`)).json();
  assert(v.verified === true && !JSON.stringify(v).includes(email), "verification must not leak the student email");
});
await step("admin can change enrolment status and delete it", async () => {
  await page.goto(BASE + "/admin/enrollments");
  const row = page.locator("tr").filter({ hasText: email });
  await row.getByLabel("Status for E2E Student").selectOption("in_progress");
  await page.getByText("Status updated").waitFor();
  await row.getByRole("button", { name: /Delete enrollment/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.getByText("Enrollment deleted").waitFor();
});
await step("admin can delete the certificate", async () => {
  await page.goto(BASE + "/admin/certificates");
  await page.getByRole("button", { name: `Delete certificate ${globalThis.__cert}` }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(800);
  assert((await status(page, `/api/verify/${globalThis.__cert}`)) === 404, "deleted certificate should not verify");
});
await step("delete the course", async () => {
  await page.goto(BASE + "/admin/courses");
  const card = page.locator("div").filter({ hasText: courseTitle }).filter({ has: page.getByRole("button", { name: "Delete" }) }).last();
  await card.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(800);
  const html = await (await page.request.get(`${BASE}/courses/${courseSlug}`)).text();
  assert(!html.includes(courseTitle), "course should be gone");
});

console.log("\nProfile & site settings");
await step("hiding a section removes it from public navigation, restoring brings it back", async () => {
  const navHas = async () => (await html("/")).includes('href="/fatwas"');
  const setFatwas = async (on) => {
    await page.goto(BASE + "/admin/profile");
    const box = page.getByLabel("fatwas", { exact: true });
    await (on ? box.check() : box.uncheck());
    await page.getByRole("button", { name: /save/i }).first().click();
    await page.waitForTimeout(1500);
  };
  try {
    await setFatwas(true);
    await eventually(async () => assert(await navHas(), "fatwas link should be visible when the section is on"));
    await setFatwas(false);
    await eventually(async () => assert(!(await navHas()), "fatwas link (header and footer) should be hidden when the section is off"));
  } finally {
    await setFatwas(true);
  }
  await eventually(async () => assert(await navHas(), "fatwas link should be back"));
});

const confirmDelete = async () => {
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(900);
};
const cardFor = (text, buttonName) =>
  page.locator("tr, article, div").filter({ hasText: text }).filter({ has: page.getByRole("button", { name: buttonName }) }).filter({ visible: true }).last();

console.log("\nMedia gallery");
const mediaTitle = `E2E Video ${run}`;
await step("add a gallery item with a title; it appears on /media and filters by kind", async () => {
  await page.goto(BASE + "/admin/media");
  await page.getByRole("button", { name: "Upload Asset" }).click();
  const form = page.locator("form").last();
  await form.getByRole("button", { name: "video", exact: true }).click();
  await form.getByPlaceholder("https://... or /images/...").fill("https://example.com/e2e-video.mp4");
  await F(form, "Asset Name").fill(mediaTitle);
  await form.getByRole("button", { name: "Save Media" }).click();
  await page.waitForTimeout(1200);
  assert((await html("/media")).includes(mediaTitle), "listed on /media");
  assert((await html("/media?kind=videos")).includes(mediaTitle), "listed under the video filter");
  assert(!(await html("/media?kind=audio")).includes(mediaTitle), "not listed under audio");
});
await step("edit then delete the gallery item", async () => {
  await page.goto(BASE + "/admin/media");
  await page.getByRole("button", { name: new RegExp(`Edit ${mediaTitle}`) }).click();
  const form = page.locator("form").last();
  assert((await F(form, "Asset Name").inputValue()) === mediaTitle, "edit form prefilled");
  await page.keyboard.press("Escape");
  await page.reload();
  await page.getByRole("button", { name: new RegExp(`Edit ${mediaTitle}`) }).waitFor();
  await cardFor(mediaTitle, /delete|trash/i).locator("button").last().click();
  await confirmDelete();
  assert(!(await html("/media")).includes(mediaTitle), "gallery item removed");
});

console.log("\nEvents");
const evSlug = `e2e-event-${run}`;
const evTitle = `E2E Gathering ${run}`;
await step("schedule an event; it becomes the home page's next gathering", async () => {
  await page.goto(BASE + "/admin/events");
  await page.getByRole("button", { name: "Schedule Event" }).click();
  const form = page.locator("form").last();
  await F(form, "Event Title *").fill(evTitle);
  await F(form, "Slug *").fill(evSlug);
  const soon = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16);
  await F(form, "Date & Time *").fill(soon);
  await form.getByRole("button", { name: "Save Event" }).click();
  await page.waitForTimeout(1200);
  const home = await html("/");
  assert(home.includes(evTitle), "home page should show the new event");
  assert((await html(`/events/${evSlug}`)).includes(evTitle), "event detail page");
});
await step("public registration is stored and visible to admin; unknown events are rejected", async () => {
  const bad = await post("/api/events/register", { event_id: "nope", name: "X", email: "x@example.com" });
  assert(bad.status() === 404, `expected 404 got ${bad.status()}`);
  const ok = await post("/api/events/register", { event_id: evSlug, name: "E2E Guest", email: `guest-${run}@example.com`, attendees_count: 2 });
  assert(ok.ok(), "registration should succeed");
  await page.goto(BASE + "/admin/events");
  assert((await page.content()).includes("E2E Guest"), "registration visible in admin");
});
await step("delete the event", async () => {
  await page.goto(BASE + "/admin/events");
  await cardFor(evTitle, /delete/i).getByRole("button", { name: /delete/i }).first().click();
  await confirmDelete();
  assert(!(await html("/")).includes(evTitle), "event gone from home");
});

console.log("\nLibrary + lectures + series (uploads)");
const bookTitle = `E2E Book ${run}`;
const bookSlug = `e2e-book-${run}`;
await step("library item with an uploaded PDF", async () => {
  await page.goto(BASE + "/admin/library");
  await page.getByRole("button", { name: "Upload New Document" }).click();
  const form = page.locator("form").last();
  await F(form, "Book / Document Title *").fill(bookTitle);
  await F(form, "Slug *").fill(bookSlug);
  await form.locator('input[type="file"]').first().setInputFiles(path.resolve("public/documents/" + fs.readdirSync("public/documents").find((f) => f.endsWith(".pdf"))));
  await page.getByText("File uploaded").waitFor();
  const fileUrl = (await form.locator("input").evaluateAll((els) => els.map((e) => e.value))).find((v) => v.startsWith("/uploads/") && v.endsWith(".pdf"));
  assert(fileUrl, "PDF URL filled in");
  await form.getByRole("button", { name: "Save Document" }).click();
  await page.waitForTimeout(1200);
  assert((await html(`/library/${bookSlug}`)).includes(bookTitle), "book detail page");
  assert((await html("/media?kind=documents")).includes(bookTitle), "book listed under documents");
  const r = await page.request.get(BASE + fileUrl);
  assert(r.status() === 200 && r.headers()["content-type"] === "application/pdf", "PDF served");
});
await step("delete the library item", async () => {
  await page.goto(BASE + "/admin/library");
  await cardFor(bookTitle, /delete/i).getByRole("button", { name: /delete/i }).first().click();
  await confirmDelete();
  assert(!(await html("/media?kind=documents")).includes(bookTitle), "book gone");
});

const serTitle = `E2E Series ${run}`;
const serSlug = `e2e-series-${run}`;
const lecTitle = `E2E Lecture ${run}`;
const lecSlug = `e2e-lecture-${run}`;
await step("create a series and a lecture with uploaded audio inside it", async () => {
  await page.goto(BASE + "/admin/series");
  await page.getByRole("button", { name: "Add New Series" }).click();
  let form = page.locator("form").last();
  await F(form, "Series Title *").fill(serTitle);
  await F(form, "URL Slug *").fill(serSlug);
  await form.getByRole("button", { name: "Save Series" }).click();
  await page.waitForTimeout(1000);

  await page.goto(BASE + "/admin/lectures");
  await page.getByRole("button", { name: "Add New Lecture" }).first().click();
  form = page.locator("form").last();
  await form.getByLabel("Lecture Title").fill(lecTitle);
  const mp3 = fs.readdirSync("public/audio").find((f) => f.endsWith(".mp3"));
  // A 100 KB slice is enough to exercise upload, storage and range serving without measuring bandwidth.
  const slice = fs.readFileSync(path.resolve("public/audio", mp3)).subarray(0, 100_000);
  await form.locator('input[type="file"]').first().setInputFiles({ name: "e2e-lesson.mp3", mimeType: "audio/mpeg", buffer: slice });
  await page.getByText("File uploaded").waitFor();
  await form.locator("select").first().selectOption({ label: serTitle });
  await page.getByRole("button", { name: "Save Lecture" }).click();
  await page.waitForTimeout(1500);

  await eventually(async () => assert((await html(`/lectures/${lecSlug}`)).includes(lecTitle), "lecture page"));
  await eventually(async () => assert((await html(`/series/${serSlug}`)).includes(lecTitle), "series page lists the lecture"));
  const audioUrl = (await html(`/lectures/${lecSlug}`)).match(/\/uploads\/[A-Za-z0-9._-]+\.mp3/)?.[0];
  assert(audioUrl, "lecture page references the uploaded audio");
  const partial = await page.request.get(BASE + audioUrl, { headers: { Range: "bytes=0-99" } });
  assert(partial.status() === 206 && (await partial.body()).length === 100, "audio supports range requests");
});
await step("renaming the series updates the lecture's series title; deleting the series detaches lectures", async () => {
  await page.goto(BASE + "/admin/series");
  await cardFor(serTitle, /edit/i).getByRole("button", { name: /edit/i }).first().click();
  const form = page.locator("form").last();
  await F(form, "Series Title *").fill(serTitle + " Renamed");
  await F(form, "URL Slug *").fill(serSlug);
  await form.getByRole("button", { name: "Save Series" }).click();
  await page.waitForTimeout(1200);
  await eventually(async () => assert((await html(`/lectures/${lecSlug}`)).includes(serTitle + " Renamed"), "lecture shows the new series title"));
});
await step("clean up lecture and series", async () => {
  await page.goto(BASE + "/admin/lectures");
  await cardFor(lecTitle, /delete|trash/i).getByRole("button", { name: /delete|trash/i }).first().click();
  await confirmDelete();
  await page.goto(BASE + "/admin/series");
  await cardFor(serTitle, /delete/i).getByRole("button", { name: /delete/i }).first().click();
  await confirmDelete();
  await eventually(async () => assert(!(await html(`/lectures/${lecSlug}`)).includes(lecTitle), "lecture gone"));
  await eventually(async () => assert(!(await html("/series")).includes(serSlug), "series gone"));
});

console.log("\nVideo from a link");
await step("an unusable link is explained, not silently accepted", async () => {
  await page.goto(BASE + "/admin/lectures");
  await page.getByRole("button", { name: "Add New Lecture" }).first().click();
  const form = page.locator("form").last();
  await form.getByPlaceholder("Paste a link here").first().fill("this is not a link");
  await form.getByText("This is not a valid link.").waitFor();
  await form.getByLabel("Lecture Title").fill("E2E invalid link");
  await page.getByRole("button", { name: "Save Lecture" }).click();
  await page.getByText("Add a video or audio link or file first.").waitFor();
  await page.keyboard.press("Escape");
});
const linkCases = [
  ["youtube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "youtube-nocookie.com/embed/dQw4w9WgXcQ"],
  ["facebook", "https://www.facebook.com/UstazMuhammad/videos/123456789/", "facebook.com/plugins/video.php"],
  ["tiktok", "https://www.tiktok.com/@ustazmuhammadferej0/video/7234567890123456789", "tiktok.com/embed/v2/7234567890123456789"],
  ["telegram", "https://t.me/ustazmuhammadferej/1234", "t.me/ustazmuhammadferej/1234?embed=1"],
  ["direct", "https://example.com/e2e/lesson.mp4", 'type="video/mp4"'],
];
for (const [name, link, expected] of linkCases) {
  await step(`a ${name} link is detected, previewed and plays on the public lecture page`, async () => {
    const lecTitle2 = `E2E ${name} ${run}`;
    const slug2 = `e2e-${name}-${run}`;
    await page.goto(BASE + "/admin/lectures");
    await page.getByRole("button", { name: "Add New Lecture" }).first().click();
    const form = page.locator("form").last();
    await form.getByPlaceholder("Paste a link here").first().fill(link);
    await form.locator("[data-source-chip]").first().waitFor();
    await form.getByLabel("Lecture Title").fill(lecTitle2);
    await page.getByRole("button", { name: "Save Lecture" }).click();
    await eventually(async () => {
      const html2 = await html(`/lectures/${slug2}`);
      assert(html2.includes(expected), `public page should contain ${expected}`);
    });
    await page.goto(BASE + "/admin/lectures");
    await cardFor(lecTitle2, /delete/i).getByRole("button", { name: /delete/i }).first().click();
    await confirmDelete();
  });
}
await step("the Amharic title of a lecture gets a readable, non-empty slug", async () => {
  await page.goto(BASE + "/admin/lectures");
  await page.getByRole("button", { name: "Add New Lecture" }).first().click();
  const form = page.locator("form").last();
  await form.getByLabel("Lecture Title").fill("ሰላም ትምህርት");
  await form.locator("summary").click();
  const slugValue = await form.getByLabel("URL Slug").inputValue();
  assert(/^[a-z0-9-]{4,}$/.test(slugValue), `unexpected slug "${slugValue}"`);
  await page.keyboard.press("Escape");
});

console.log("\nFatwas & inquiries");
const fatTitle = `E2E Ruling ${run}`;
const fatSlug = `e2e-ruling-${run}`;
await step("publish and delete a fatwa", async () => {
  await page.goto(BASE + "/admin/fatwas");
  await page.getByRole("button", { name: "Publish New Fatwa" }).click();
  const form = page.locator("form").last();
  await F(form, "Ruling Subject *").fill(fatTitle);
  await F(form, "URL Slug *").fill(fatSlug);
  await F(form, "Submitted Question *").fill("Is this e2e?");
  await F(form, "Scholar's Answer & Evidence *").fill("Yes, answered in e2e.");
  await form.getByRole("button", { name: "Save Fatwa" }).click();
  await page.waitForTimeout(1200);
  assert((await html(`/fatwas/${fatSlug}`)).includes("answered in e2e"), "fatwa page");
  await page.goto(BASE + "/admin/fatwas");
  await cardFor(fatTitle, /delete/i).getByRole("button", { name: /delete/i }).first().click();
  await confirmDelete();
  assert(!(await html("/fatwas")).includes(fatSlug), "fatwa gone");
});
await step("a question submitted on the public site reaches the admin inbox", async () => {
  const q = `Is the e2e inbox working? ${run}`;
  const r = await post("/api/inquiries", { body: q, askerName: "E2E" });
  assert(r.ok(), "submit");
  await page.goto(BASE + "/admin/inquiries");
  await page.getByText(q).first().waitFor();
});

console.log("\nBackup");
await step("export then restore round-trips without losing content", async () => {
  const count = async () => (await (await page.request.get(BASE + "/")).text(), (await page.goto(BASE + "/admin/lectures"), await page.getByRole("tab", { name: /^All \(/ }).innerText()));
  const before = await count();
  await page.goto(BASE + "/admin/backup");
  const json = await page.locator("textarea").first().inputValue();
  assert(JSON.parse(json).lectures.length > 0, "export has lectures");
  await page.locator('input[type="file"][accept*="json"]').setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(json) });
  await page.waitForFunction(() => document.querySelectorAll("textarea")[1]?.value.length > 1000);
  await page.getByRole("button", { name: /restore database/i }).click();
  await page.getByRole("dialog").getByRole("button", { name: /restore/i }).click();
  await page.getByText(/success/i).first().waitFor();
  assert((await count()) === before, "lecture count unchanged after restore");
});

console.log("\nAdmin pages render in every language without missing messages");
await step("no raw message keys on admin pages in en/ar/am/om", async () => {
  for (const L of ["en", "ar", "am", "om"]) {
    await ctx.addCookies([{ name: "admin_locale", value: L, url: BASE }]);
    for (const p of ["/admin", "/admin/courses", "/admin/profile", "/admin/events", "/admin/media"]) {
      await page.goto(BASE + p);
      const text = await page.locator("body").innerText();
      assert(!/\badmin\.[a-z]+\.[A-Za-z]+\b/.test(text), `${L} ${p} shows a raw key`);
    }
  }
  await ctx.addCookies([{ name: "admin_locale", value: "en", url: BASE }]);
});

console.log("\nMobile shell (390px, default language)");
{
  const mctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  const m = await mctx.newPage();
  m.setDefaultTimeout(45000 * Math.max(1, SLOW / 2));
  await step("a fresh admin session opens in Amharic", async () => {
    await m.goto(BASE + "/admin/login");
    await m.locator('input[type="text"]').first().fill(USER);
    await m.locator('input[type="password"]').fill(PASS);
    await m.locator('button[type="submit"]').click();
    await m.waitForURL(BASE + "/admin");
    const heading = await m.locator("main h1").first().innerText();
    assert(/[\u1200-\u137F]/.test(heading), `expected Ethiopic text, got "${heading}"`);
  });
  await step("no sideways scrolling on the main admin pages", async () => {
    for (const p of ["/admin", "/admin/lectures", "/admin/articles", "/admin/media", "/admin/inquiries"]) {
      await m.goto(BASE + p);
      await m.locator("main").first().waitFor();
      const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 1, `${p} overflows by ${overflow}px`);
    }
  });
  await step('the dock "+" opens the create sheet, Escape closes it, a choice opens that form', async () => {
    await m.goto(BASE + "/admin");
    const plus = m.locator("nav button").filter({ has: m.locator("svg") }).nth(0);
    await m.locator('nav[aria-label] div.flex.justify-center button').click();
    const sheet = m.getByRole("dialog");
    await sheet.waitFor();
    assert((await sheet.locator('a[href*="?new=1"]').count()) === 6, "six create choices");
    await m.keyboard.press("Escape");
    await sheet.waitFor({ state: "detached" });
    await m.locator('nav[aria-label] div.flex.justify-center button').click();
    await m.getByRole("dialog").locator('a[href="/admin/articles?new=1"]').click();
    await m.waitForURL(/\/admin\/articles$/);
    await m.locator("form").last().waitFor();
    void plus;
  });
  await mctx.close();
}

console.log("\nLogout");
await step("logout revokes the session", async () => {
  const cookies = await ctx.cookies();
  const session = cookies.find((c) => c.name === "sheikh_admin_session");
  assert(session, "session cookie present");
  await page.goto(BASE + "/admin");
  await page.getByRole("button", { name: /sign out/i }).click();
  await page.waitForURL(/\/admin\/login/);
  // replay the old cookie: signature is valid but the server-side session is gone
  await ctx.addCookies([session]);
  await page.goto(BASE + "/admin/articles");
  assert(page.url().includes("/admin/login"), `replayed cookie must not work, got ${page.url()}`);
});

await browser.close();
const failed = results.filter((r) => !r[0]);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
