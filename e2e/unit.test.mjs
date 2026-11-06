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
