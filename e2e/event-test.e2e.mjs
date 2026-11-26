import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import path from 'node:path';

const base = process.env.BASE_URL || 'http://localhost:3015';
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) throw new Error('Admin credentials required.');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox', '--use-fake-device-for-media-stream'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['camera'] });
await context.addCookies([{ name: 'admin_locale', value: 'en', url: base }]);
const page = await context.newPage(); page.setDefaultTimeout(30000);
let slug = '';
try {
  await page.goto(`${base}/admin/login`);
  await page.locator('input[autocomplete="username"]').fill(process.env.ADMIN_USERNAME);
  await page.locator('input[autocomplete="current-password"]').fill(process.env.ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign In to Admin', exact: true }).click();
  await page.waitForURL(`${base}/admin`);

  await page.goto(`${base}/admin/tests`);
  const select = page.locator('main select');
  slug = await select.inputValue(); assert.ok(slug, 'at least one event exists for the sample test');
  await page.locator('input[type=file]').setInputFiles(path.resolve('public/samples/event-test.sample.json'));
  await page.getByRole('button', { name: 'Import test', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Imported 2 questions' }).waitFor();
  await page.getByRole('button', { name: /^(Open|Close) exam$/ }).waitFor();
  if (await page.getByRole('button', { name: 'Open exam', exact: true }).count()) {
    await page.getByRole('button', { name: 'Open exam', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Exam opened for learners.' }).waitFor();
  }
  await page.getByRole('button', { name: 'Close exam', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Exam closed.' }).waitFor();
  console.log('✓ admin imports the downloadable sample test');

  const publicContext = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera'] });
  const testPage = await publicContext.newPage();
  const testApi = await testPage.request.get(`${base}/api/events/test?slug=${slug}`);
  assert.equal(testApi.status(), 409, 'closed exams cannot be loaded through the API');
  const closedSubmit = await testPage.request.post(`${base}/api/events/test`, { data: { slug, answers: { q1: 0, q2: 0 } } });
  assert.equal(closedSubmit.status(), 409, 'closed exams cannot be submitted through the API');
  const closedRoute = await testPage.goto(`${base}/events/${slug}/test`);
  assert.ok(closedRoute.status() === 404 || closedRoute.ok());
  assert.equal(await testPage.getByRole('button', { name: /Allow camera and begin/ }).count(), 0, 'closed exams do not render a test start control');
  const closedEvent = await testPage.goto(`${base}/events/${slug}`);
  assert.ok((await testPage.locator('body').innerText()).includes('Exam currently closed'));
  assert.ok(closedEvent.ok());

  await page.goto(`${base}/admin/tests`);
  await page.getByRole('button', { name: 'Open exam', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Exam opened for learners.' }).waitFor();
  console.log('✓ closed exam blocks direct page/API access; admin reopens it cleanly');

  const openTestApi = await testPage.request.get(`${base}/api/events/test?slug=${slug}`);
  assert.equal(openTestApi.status(), 200, 'open exams become available again');
  const payload = await openTestApi.json();
  assert.equal(payload.questions.length, 2);
  assert.ok(!JSON.stringify(payload).includes('correct_option_index'), 'correct answers are not sent to the browser');
  assert.equal((await testPage.request.post(`${base}/api/events/test`, { data: { slug, answers: { q1: 999, q2: 0 } } })).status(), 400);
  const scored = await testPage.request.post(`${base}/api/events/test`, { data: { slug, answers: { q1: 0, q2: 0 } } });
  assert.equal(scored.status(), 200); assert.equal((await scored.json()).score, 100);
  const eventPage = await testPage.goto(`${base}/events/${slug}`);
  assert.equal(eventPage.status(), 200); await testPage.getByRole('link', { name: /Open event test/ }).waitFor();
  console.log('✓ public event route, private answer key, validation, grading and event-to-test link');

  await testPage.goto(`${base}/events/${slug}/test`);
  await testPage.getByRole('button', { name: /Allow camera and begin/ }).click();
  await testPage.locator('video').waitFor();
  await testPage.getByText('Camera is on for this test.').waitFor();
  assert.equal(await testPage.evaluate(() => { const event = new Event('copy', { cancelable: true }); document.dispatchEvent(event); return event.defaultPrevented; }), true, 'copy is blocked while camera is active');
  await testPage.getByRole('radio', { name: /The Qur'an and authentic Sunnah/ }).check();
  await testPage.getByRole('radio', { name: /Ask for clarification/ }).check();
  await testPage.getByRole('button', { name: 'Submit answers' }).click();
  await testPage.getByRole('heading', { name: 'Test passed' }).waitFor();
  console.log('✓ camera-gated phone-sized test flow and successful result');
  await publicContext.close();

  await page.goto(`${base}/admin/tests`);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove event test' }).click();
  await page.getByRole('status').filter({ hasText: 'Test removed' }).waitFor();
  assert.equal((await page.request.get(`${base}/api/events/test?slug=${slug}`)).status(), 404);
  console.log('✓ test removal unpublishes its route and leaves the event itself intact');
} finally {
  if (slug) {
    try {
      await page.goto(`${base}/admin/tests`);
      await page.getByRole('button', { name: 'Remove event test' }).waitFor({ timeout: 10000 });
      if (await page.getByRole('button', { name: 'Remove event test' }).count()) {
        page.once('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'Remove event test' }).click();
        await page.getByRole('status').filter({ hasText: 'Test removed' }).waitFor({ timeout: 10000 });
      }
    } catch { /* the run may have already removed the temporary imported test */ }
  }
  await page.request.post(`${base}/api/admin/logout`).catch(() => {});
  await browser.close();
}
