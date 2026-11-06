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

// ── media-source ──
import { parseMediaUrl, oembedEndpoint, isPlayable } from "../src/lib/media-source.ts";

test("parseMediaUrl: YouTube in all common shapes", () => {
  const id = "5hlykYaVcn4";
  for (const url of [
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtube.com/watch?v=${id}&t=30s&list=PLabc`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://music.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=xyz`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/live/${id}`,
    `  https://www.youtube.com/watch?v=${id}  `,
  ]) {
    const p = parseMediaUrl(url);
    assert.equal(p.provider, "youtube", url);
    assert.equal(p.kind, "video", url);
    assert.equal(p.embedUrl, `https://www.youtube-nocookie.com/embed/${id}`, url);
    assert.equal(p.thumbnailUrl, `https://img.youtube.com/vi/${id}/hqdefault.jpg`, url);
    assert.equal(p.aspect, "16/9");
  }
  assert.equal(parseMediaUrl(`https://youtube.com/shorts/${id}`).aspect, "9/16");
});

test("parseMediaUrl: YouTube playlists embed as a video series", () => {
  const p = parseMediaUrl("https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3");
  assert.equal(p.embedUrl, "https://www.youtube-nocookie.com/embed/videoseries?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3");
  assert.equal(oembedEndpoint(p), null, "playlists have no oEmbed lookup");
});

test("parseMediaUrl: Facebook videos, reels and short links embed; profile pages do not", () => {
  const v = parseMediaUrl("https://www.facebook.com/UstazMuhammad/videos/123456789/");
  assert.equal(v.provider, "facebook");
  assert.equal(v.kind, "video");
  assert.ok(v.embedUrl?.startsWith("https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com"));
  assert.equal(parseMediaUrl("https://fb.watch/abcDEF/").kind, "video");
  assert.equal(parseMediaUrl("https://www.facebook.com/reel/987654321").aspect, "9/16");
  const profile = parseMediaUrl("https://web.facebook.com/p/Ustaz-Muhammad-ferej-100064605885257/");
  assert.equal(profile.provider, "facebook");
  assert.equal(profile.embedUrl, undefined);
});

test("parseMediaUrl: TikTok video pages embed, short links are playable only as links", () => {
  const v = parseMediaUrl("https://www.tiktok.com/@ustazmuhammadferej0/video/7234567890123456789");
  assert.equal(v.embedUrl, "https://www.tiktok.com/embed/v2/7234567890123456789");
  assert.equal(v.aspect, "9/16");
  assert.ok(oembedEndpoint(v)?.startsWith("https://www.tiktok.com/oembed?url="));
  const short = parseMediaUrl("https://vm.tiktok.com/ZMabc123/");
  assert.equal(short.provider, "tiktok");
  assert.equal(short.embedUrl, undefined);
  assert.equal(parseMediaUrl("https://www.tiktok.com/@ustazmuhammadferej0").kind, "unknown");
});

test("parseMediaUrl: Telegram posts embed", () => {
  const p = parseMediaUrl("https://t.me/ustazmuhammadferej/1234");
  assert.equal(p.provider, "telegram");
  assert.equal(p.embedUrl, "https://t.me/ustazmuhammadferej/1234?embed=1&mode=tme");
  assert.equal(parseMediaUrl("https://t.me/ustazmuhammadferej").embedUrl, undefined);
});

test("parseMediaUrl: direct files get the right kind and mime type", () => {
  const cases = [
    ["https://example.com/a/lesson.MP3?x=1", "audio", "audio/mpeg"],
    ["https://example.com/a/lesson.m4a", "audio", "audio/mp4"],
    ["https://example.com/v/clip.webm", "video", "video/webm"],
    ["https://example.com/v/clip.mp4", "video", "video/mp4"],
    ["/audio/khutbah.mp3", "audio", "audio/mpeg"],
    ["/uploads/ab12-lesson.mp4", "video", "video/mp4"],
    ["https://example.com/book.pdf", "document", "application/pdf"],
  ];
  for (const [url, kind, mime] of cases) {
    const p = parseMediaUrl(url);
    assert.equal(p.kind, kind, url);
    assert.equal(p.mime, mime, url);
    assert.equal(p.valid, true);
  }
  assert.equal(parseMediaUrl("/uploads/x.mp3").provider, "upload");
  assert.equal(parseMediaUrl("/audio/x.mp3").provider, "direct");
  assert.equal(isPlayable(parseMediaUrl("/uploads/x.mp3")), true);
});

test("parseMediaUrl: unsafe or broken input is rejected, never thrown", () => {
  for (const bad of ["", "   ", "javascript:alert(1)", "data:text/html,<script>", "ftp://example.com/a.mp3", "not a url", "//evil.com/a.mp3", null, undefined]) {
    const p = parseMediaUrl(bad);
    assert.equal(p.valid, false, String(bad));
    assert.equal(p.url, "");
  }
});

test("parseMediaUrl: an unknown website is valid but only a link", () => {
  const p = parseMediaUrl("https://example.com/some/page");
  assert.equal(p.valid, true);
  assert.equal(p.provider, "unknown");
  assert.equal(isPlayable(p), false);
});

test("oembedEndpoint only ever points at youtube.com and tiktok.com", () => {
  assert.ok(oembedEndpoint(parseMediaUrl("https://youtu.be/5hlykYaVcn4"))?.startsWith("https://www.youtube.com/oembed?"));
  assert.equal(oembedEndpoint(parseMediaUrl("https://example.com/a.mp4")), null);
  assert.equal(oembedEndpoint(parseMediaUrl("https://www.facebook.com/x/videos/1")), null);
});

// ── rich text ──
import { markdownLiteToHtml, withSourceMarker, readSourceMarker, expandMediaPlaceholders, estimateReadingMinutes } from "../src/lib/rich-text.ts";
import { sanitizeArticleHtml, prepareArticleBody, renderArticleBody } from "../src/lib/rich-text-server.ts";

test("markdownLiteToHtml: headings, emphasis, lists, quotes and paragraphs", () => {
  const html = markdownLiteToHtml("## Title\n\nHello **bold** and _italic_.\nSecond line\n\n- one\n- two\n\n1. first\n2. second\n\n> wise words");
  assert.ok(html.includes("<h2>Title</h2>"));
  assert.ok(html.includes("<p>Hello <strong>bold</strong> and <em>italic</em>.<br>Second line</p>"));
  assert.ok(html.includes("<ul><li>one</li><li>two</li></ul>"));
  assert.ok(html.includes("<ol><li>first</li><li>second</li></ol>"));
  assert.ok(html.includes("<blockquote><p>wise words</p></blockquote>"));
});

test("markdownLiteToHtml: raw HTML typed by the user is shown as text, never executed", () => {
  const html = markdownLiteToHtml('<script>alert(1)</script> <img src=x onerror=alert(1)> & "quotes"');
  assert.ok(!html.includes("<script"));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("markdownLiteToHtml: links, auto-links and unsafe schemes", () => {
  const html = markdownLiteToHtml("[Read](https://example.com/a?x=1&y=2) and https://example.org/page. [bad](javascript:alert(1))");
  assert.ok(html.includes('<a href="https://example.com/a?x=1&amp;y=2" target="_blank" rel="noopener noreferrer nofollow">Read</a>'));
  assert.ok(html.includes('<a href="https://example.org/page"'));
  assert.ok(!html.includes('href="javascript:'));
});

test("markdownLiteToHtml: a lone video link becomes a media placeholder, a normal link stays a link", () => {
  const html = markdownLiteToHtml("Watch:\n\nhttps://www.youtube.com/watch?v=5hlykYaVcn4\n\nSee https://example.com/page");
  assert.ok(html.includes('<div data-media="https://www.youtube.com/watch?v=5hlykYaVcn4"></div>'));
  assert.ok(!html.includes('data-media="https://example.com'));
  const expanded = expandMediaPlaceholders(html);
  assert.ok(expanded.includes("youtube-nocookie.com/embed/5hlykYaVcn4"));
});

test("source marker round-trips Amharic and Arabic text exactly", () => {
  const source = "## ሰላም\n\nبسم الله الرحمن الرحيم **ok**\n- ነጥብ";
  const stored = withSourceMarker(source, markdownLiteToHtml(source));
  assert.equal(readSourceMarker(stored), source);
  assert.equal(readSourceMarker("<p>old html article</p>"), null);
});

test("sanitizeArticleHtml: removes scripts, handlers, styles, iframes and unsafe links", () => {
  const dirty =
    '<p onclick="x()" style="color:red">Hi<script>alert(1)</script></p><iframe src="https://evil.example"></iframe>' +
    '<a href="javascript:alert(1)">bad</a><a href="https://ok.example">ok</a><img src="x" onerror="alert(1)">' +
    '<svg onload=alert(1)></svg><object data="x"></object>';
  const clean = sanitizeArticleHtml(dirty);
  for (const bad of ["<script", "onclick", "onerror", "onload", "style=", "<iframe", "javascript:", "<svg", "<object"]) {
    assert.ok(!clean.includes(bad), `${bad} should be removed: ${clean}`);
  }
  assert.ok(clean.includes('href="https://ok.example"'));
  assert.ok(clean.includes("noopener"));
});

test("sanitizeArticleHtml keeps the markup older articles use (divs, classes, dir)", () => {
  const legacy = '<div class="space-y-6"><p class="text-right" dir="rtl">نص</p><h3 class="font-bold">Title</h3><ul class="x"><li>a</li></ul></div>';
  assert.equal(sanitizeArticleHtml(legacy), legacy);
});

test("renderArticleBody: sanitises, expands only our own media placeholders, and cannot be tricked into foreign iframes", () => {
  const stored = '<!--md:abc--><p>x</p><div data-media="https://www.youtube.com/watch?v=5hlykYaVcn4"></div><div data-media="javascript:alert(1)"></div><iframe src="https://evil.example"></iframe>';
  const html = renderArticleBody(stored);
  assert.ok(html.includes("youtube-nocookie.com/embed/5hlykYaVcn4"));
  assert.ok(!html.includes("evil.example"));
  assert.ok(!html.includes("javascript:"));
  assert.ok(!html.includes("<!--md"));
});

test("prepareArticleBody: text mode stores sanitised HTML plus the editable source; html mode only sanitises", () => {
  const saved = prepareArticleBody({ source: "## Hi\n\n**x** <b onclick=1>y</b>", format: "text" });
  assert.equal(readSourceMarker(saved), "## Hi\n\n**x** <b onclick=1>y</b>");
  assert.ok(!saved.includes("onclick=1>y</b>"), "typed HTML must be escaped");
  assert.equal(prepareArticleBody({ source: '<p onclick="a()">hi</p>', format: "html" }), "<p>hi</p>");
});

test("estimateReadingMinutes: at least one minute, scales with length", () => {
  assert.equal(estimateReadingMinutes(""), 1);
  assert.equal(estimateReadingMinutes("word ".repeat(540)), 3);
});

// ── push: real encryption and VAPID signing, without any network ──
import * as webpush from "web-push";
import crypto from "node:crypto";
import { pushMessage } from "../src/lib/push-messages.ts";

test("web-push builds a valid encrypted, VAPID-signed request for a subscription", () => {
  const vapid = webpush.generateVAPIDKeys();
  const browser = crypto.createECDH("prime256v1");
  browser.generateKeys();
  const subscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/example-device-token",
    keys: { p256dh: browser.getPublicKey().toString("base64url"), auth: crypto.randomBytes(16).toString("base64url") },
  };
  const details = webpush.generateRequestDetails(subscription, JSON.stringify({ title: "ሰላም", body: "x", url: "/admin/inquiries", tag: "inquiry" }), {
    vapidDetails: { subject: "https://muhammedferej.pro.et", publicKey: vapid.publicKey, privateKey: vapid.privateKey },
    TTL: 3600,
    urgency: "high",
  });
  assert.equal(details.method, "POST");
  assert.equal(details.endpoint, subscription.endpoint);
  assert.equal(details.headers["Content-Encoding"], "aes128gcm");
  assert.match(details.headers.Authorization, /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/);
  assert.equal(String(details.headers.TTL), "3600");
  assert.ok(Buffer.isBuffer(details.body) && details.body.length > 40, "encrypted body present");
  assert.ok(!details.body.toString("utf8").includes("inquiry"), "payload must be encrypted");
});

test("push messages exist in every language and never put personal details on the lock screen", () => {
  for (const locale of ["en", "ar", "am", "om"]) {
    for (const kind of ["inquiry", "registration", "enrollment", "certificate", "test"]) {
      assert.ok(pushMessage(kind, locale).title.length > 2, `${kind}/${locale}`);
    }
  }
  assert.equal(pushMessage("registration", "en", "Annual Conference").body, "Annual Conference");
  assert.equal(pushMessage("inquiry", "xx").title, pushMessage("inquiry", "am").title, "unknown locale falls back to Amharic");
  assert.ok(pushMessage("inquiry", "en", "x".repeat(500)).body.length <= 120);
});
