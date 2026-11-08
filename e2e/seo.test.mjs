import test from "node:test";
import assert from "node:assert/strict";
import {
  getSiteUrl,
  getScholarEntity,
  getOrganizationEntity,
  buildFatwaSchema,
  buildFatwaKeywords,
  buildArticleSchema,
  buildCourseSchema,
  buildLectureSchema,
  buildLibrarySchema,
  buildEventSchema,
  buildBreadcrumbSchema,
  buildWebsiteSchema,
  buildHreflangAlternates,
  buildSeriesSchema,
  buildCollectionSchema,
  buildContactSchema,
  getHomepageMetadata,
  getLocalizedUrl,
  buildSitemapAlternates,
  buildSitelinksNavigationSchema,
  PRIMARY_SITELINKS,
} from "../src/lib/seo.ts";

test("SEO: canonical domain is correctly configured", () => {
  const url = getSiteUrl();
  assert.ok(url.startsWith("https://"), "Site URL must be HTTPS");
  assert.ok(url.includes("sheikhmuhammedferej.info") || url.includes("localhost"), "Valid domain");
});

test("SEO: Scholar entity has full knowledge graph properties", () => {
  const scholar = getScholarEntity();
  assert.equal(scholar["@type"], "Person");
  assert.equal(scholar.name, "Sheikh Muhammed Ferej Megeno");
  assert.ok(scholar.alternateName.includes("ሸይኽ ሙሐመድ ፈረጅ መገኖ"));
  assert.ok(scholar.alternateName.includes("الشيخ محمد فرج مجنو"));
  assert.ok(scholar.sameAs.length >= 4, "Should have YouTube, Facebook, Telegram, TikTok");
  assert.ok(scholar.hasCredential.length >= 4, "Should have degrees and AAOIFI credentials");
  assert.ok(scholar.knowsAbout.includes("Fatwa Issuance & Sharia Rulings"));
  assert.ok(scholar.knowsAbout.includes("Islamic Banking & Halal Finance"));
});

test("SEO: Fatwa schema produces valid QAPage with author link", () => {
  const mockFatwa = {
    object: "fatwa",
    id: "fat_test",
    title: "Ruling on Zakat al-Fitr in Cash",
    slug: "ruling-zakat-al-fitr-cash",
    summary: "Can Zakat al-Fitr be paid in currency or only in food?",
    question: "Is it permissible to pay Zakat al-Fitr in money?",
    answer: "The majority of scholars held food is required, but Imam Abu Hanifa allowed cash for poor benefit.",
    locale: "am",
    direction: "ltr",
    categories: ["zakat", "fasting", "fiqh"],
    tags: ["ramadan", "charity"],
    published_at: "2026-04-10T10:00:00Z",
    updated_at: "2026-04-11T12:00:00Z",
  };

  const schema = buildFatwaSchema(mockFatwa, "am");
  assert.equal(schema["@type"], "QAPage");
  assert.equal(schema.mainEntity["@type"], "Question");
  assert.equal(schema.mainEntity.name, mockFatwa.title);
  assert.equal(schema.mainEntity.acceptedAnswer["@type"], "Answer");
  assert.equal(schema.mainEntity.acceptedAnswer.author["@type"], "Person");
  assert.equal(schema.mainEntity.acceptedAnswer.author.name, "Sheikh Muhammed Ferej Megeno");

  const keywords = buildFatwaKeywords(mockFatwa, "am");
  assert.ok(keywords.includes("ፈትዋ"));
  assert.ok(keywords.includes("فتوى"));
  assert.ok(keywords.includes("fatwa"));
  assert.ok(keywords.includes("zakat"));
});

test("SEO: Article, Course, Lecture and Event schemas produce valid Schema.org entities", () => {
  const articleSchema = buildArticleSchema({
    object: "article",
    id: "art_1",
    title: "Virtues of Dhikr",
    slug: "virtues-of-dhikr",
    summary: "Reflections on daily remembrance.",
    body: "Dhikr purifies the heart.",
    reading_minutes: 5,
    locale: "en",
    direction: "ltr",
    cover: null,
    categories: ["Spirituality"],
    tags: ["dhikr"],
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  }, "en");
  assert.equal(articleSchema["@type"], "ScholarlyArticle");
  assert.equal(articleSchema.headline, "Virtues of Dhikr");
  assert.equal(articleSchema.author["@type"], "Person");

  const courseSchema = buildCourseSchema({
    object: "course",
    id: "cou_1",
    title: "Fiqh of Worship",
    slug: "fiqh-of-worship",
    summary: "Introductory fiqh course.",
    description: "Detailed curriculum.",
    categories: ["Fiqh"],
    locale: "en",
    direction: "ltr",
    cover: null,
    enrolment_open: true,
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  }, "en");
  assert.equal(courseSchema["@type"], "Course");
  assert.equal(courseSchema.name, "Fiqh of Worship");

  const lectureSchema = buildLectureSchema({
    object: "lecture",
    id: "lec_1",
    title: "Tafsir Surah Al-Fatiha",
    slug: "tafsir-surah-al-fatiha",
    summary: "Detailed exegesis.",
    locale: "ar",
    direction: "rtl",
    duration_seconds: 3600,
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    cover: null,
    media: { audio: "/audio/lec1.mp3", video: null, transcript: null },
    series: null,
    categories: ["Tafsir"],
    tags: ["quran"],
  }, "ar");
  assert.equal(lectureSchema["@type"], "AudioObject");
  assert.equal(lectureSchema.name, "Tafsir Surah Al-Fatiha");

  const eventSchema = buildEventSchema({
    object: "event",
    id: "eve_1",
    title: "Annual Sharia Seminar",
    slug: "annual-sharia-seminar",
    summary: "Public educational gathering.",
    description: "Annual Sharia conference.",
    starts_at: "2026-05-01T10:00:00Z",
    ends_at: "2026-05-01T14:00:00Z",
    timezone: "Africa/Addis_Ababa",
    venue_name: "Grand Mosque Hall",
    venue_address: "Bole, Addis Ababa",
    online_url: null,
    registration_required: true,
    capacity: 500,
    locale: "en",
    direction: "ltr",
    cover: null,
    categories: ["Conference"],
    tags: ["seminar"],
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  }, "en");
  assert.equal(eventSchema["@type"], "Event");
  assert.equal(eventSchema.name, "Annual Sharia Seminar");
  assert.equal(eventSchema.location.name, "Grand Mosque Hall");
});

test("SEO: Bidirectional hreflang alternates include all 4 languages with prefixless default", () => {
  const alternates = buildHreflangAlternates("/fatwas/test-slug", "am");
  assert.ok(alternates.canonical?.includes("/am/fatwas/test-slug"));
  assert.equal(alternates.languages?.en?.includes("/en/fatwas"), false);
  assert.ok(alternates.languages?.en?.includes("/fatwas/test-slug"));
  assert.ok(alternates.languages?.ar?.includes("/ar/fatwas/test-slug"));
  assert.ok(alternates.languages?.am?.includes("/am/fatwas/test-slug"));
  assert.ok(alternates.languages?.om?.includes("/om/fatwas/test-slug"));
  assert.ok(alternates.languages?.["x-default"]?.includes("/fatwas/test-slug"));
});

test("SEO: Breadcrumbs and Website schemas match Schema.org specifications", () => {
  const crumbs = buildBreadcrumbSchema([
    { name: "Home", url: "https://www.sheikhmuhammedferej.info/am" },
    { name: "Fatwas", url: "https://www.sheikhmuhammedferej.info/am/fatwas" },
  ]);
  assert.equal(crumbs["@type"], "BreadcrumbList");
  assert.equal(crumbs.itemListElement.length, 2);
  assert.equal(crumbs.itemListElement[0].position, 1);
  assert.equal(crumbs.itemListElement[1].name, "Fatwas");

  const website = buildWebsiteSchema("am");
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.potentialAction["@type"], "SearchAction");
});

test("SEO: Series, Collection, Contact and Homepage schemas produce valid structured data", () => {
  const seriesSchema = buildSeriesSchema({
    object: "series",
    id: "ser_1",
    title: "Explanation of Kitab at-Tawheed",
    slug: "kitab-at-tawheed",
    description: "Detailed scholarly explanation.",
    locale: "am",
    direction: "ltr",
    cover: null,
    lecture_count: 24,
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    lectures: [
      {
        object: "lecture",
        id: "lec_1",
        title: "Introduction to Tawheed",
        slug: "tawheed-intro",
        summary: "First lesson of the series.",
        locale: "am",
        direction: "ltr",
        duration_seconds: 3600,
        published_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
        cover: null,
        media: { audio: "/audio/tawheed-1.mp3", video: null, transcript: null },
        series: { id: "ser_1", position: 1 },
        categories: ["Aqeedah"],
        tags: ["tawheed"],
      },
    ],
  }, "am");

  assert.equal(seriesSchema["@type"], "CreativeWorkSeries");
  assert.equal(seriesSchema.name, "Explanation of Kitab at-Tawheed");
  assert.equal(seriesSchema.numberOfItems, 24);
  assert.equal(seriesSchema.hasPart?.[0]?.name, "Introduction to Tawheed");

  const collectionSchema = buildCollectionSchema({
    name: "Islamic Fatwas",
    description: "Authenticated rulings archive.",
    url: "https://www.sheikhmuhammedferej.info/am/fatwas",
    inLanguage: "am",
    items: [
      { name: "Fatwa 1", url: "https://www.sheikhmuhammedferej.info/am/fatwas/f1" },
      { name: "Fatwa 2", url: "https://www.sheikhmuhammedferej.info/am/fatwas/f2" },
    ],
  });
  assert.equal(collectionSchema["@type"], "CollectionPage");
  assert.equal(collectionSchema.mainEntity["@type"], "ItemList");
  assert.equal(collectionSchema.mainEntity.itemListElement.length, 2);

  const contactSchema = buildContactSchema("ar");
  assert.equal(contactSchema["@type"], "ContactPage");
  assert.equal(contactSchema.about["@type"], "Person");
  assert.equal(contactSchema.about.name, "Sheikh Muhammed Ferej Megeno");

  const amMetadata = getHomepageMetadata("am");
  assert.ok(amMetadata.title?.toString().includes("ሸይኽ ሙሐመድ ፈረጅ"));
  assert.ok(amMetadata.description?.includes("የሸሪዓ ብይኖች"));
  assert.equal(amMetadata.openGraph?.locale, "am_ET");

  const arMetadata = getHomepageMetadata("ar");
  assert.ok(arMetadata.title?.toString().includes("الشيخ محمد فرج"));
  assert.equal(arMetadata.openGraph?.locale, "ar_SA");
});

test("SEO: getLocalizedUrl generates correct non-redirect URLs", () => {
  // English is prefix-less
  assert.equal(getLocalizedUrl("", "en"), "https://www.sheikhmuhammedferej.info");
  assert.equal(getLocalizedUrl("/fatwas", "en"), "https://www.sheikhmuhammedferej.info/fatwas");
  assert.equal(getLocalizedUrl("/fatwas/test-slug", "en"), "https://www.sheikhmuhammedferej.info/fatwas/test-slug");

  // Non-English are prefixed
  assert.equal(getLocalizedUrl("", "am"), "https://www.sheikhmuhammedferej.info/am");
  assert.equal(getLocalizedUrl("/fatwas", "am"), "https://www.sheikhmuhammedferej.info/am/fatwas");
  assert.equal(getLocalizedUrl("/fatwas/test-slug", "am"), "https://www.sheikhmuhammedferej.info/am/fatwas/test-slug");

  const alternates = buildSitemapAlternates("/fatwas/test-slug");
  assert.equal(alternates.en, "https://www.sheikhmuhammedferej.info/fatwas/test-slug");
  assert.equal(alternates["x-default"], "https://www.sheikhmuhammedferej.info/fatwas/test-slug");
  assert.equal(alternates.am, "https://www.sheikhmuhammedferej.info/am/fatwas/test-slug");
});

test("SEO: Google Sitelinks navigation schema generates 5 authoritative pillars", () => {
  assert.equal(PRIMARY_SITELINKS.length, 5, "Must have exactly 5 sitelinks");

  const enSitelinks = buildSitelinksNavigationSchema("en");
  assert.equal(enSitelinks["@type"], "ItemList");
  assert.equal(enSitelinks.itemListElement.length, 5);

  const expectedPaths = ["/fatwas", "/articles", "/series", "/courses", "/ask"];

  enSitelinks.itemListElement.forEach((el, idx) => {
    assert.equal(el["@type"], "SiteNavigationElement");
    assert.equal(el.position, idx + 1);
    assert.ok(el.name.length > 2, "Has name");
    assert.ok(el.description.length > 10, "Has description");
    assert.ok(el.url.endsWith(expectedPaths[idx]), `URL should end with ${expectedPaths[idx]}`);
    assert.equal(el.url.includes("/en/"), false, "English sitelink URLs must not contain /en/");
  });

  const amSitelinks = buildSitelinksNavigationSchema("am");
  assert.equal(amSitelinks.itemListElement.length, 5);
  amSitelinks.itemListElement.forEach((el, idx) => {
    assert.ok(el.url.includes(`/am${expectedPaths[idx]}`), `Amharic URL must contain /am${expectedPaths[idx]}`);
  });

  // Verify WebSite schema includes hasPart for sitelinks
  const website = buildWebsiteSchema("en");
  assert.ok(Array.isArray(website.hasPart), "WebSite must contain hasPart");
  assert.equal(website.hasPart.length, 5);
  assert.equal(website.hasPart[0]["@type"], "WebPage");
});




