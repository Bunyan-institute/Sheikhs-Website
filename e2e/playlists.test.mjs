import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { publicPlaylists, sortPlaylistTracks, unassignedAudio } from "../src/lib/playlists.ts";

const seed = JSON.parse(fs.readFileSync(new URL("../src/lib/db/seed/content-seed.json", import.meta.url)));

test("playlist titles use natural name order and never expose draft content", () => {
  const result = publicPlaylists([
    { id: "10", title: "Course 10", lectures: [{ title: "Hidden", status: "draft", series: null }] },
    { id: "draft", title: "Course 1", status: "draft", lectures: [] },
    { id: "2", title: "Course 2", lectures: [{ title: "Published", series: null }] },
  ]);
  assert.deepEqual(result.map((p) => p.id), ["2", "10"]);
  assert.equal(result[1].lecture_count, 0);
  assert.equal(result[1].lectures.length, 0);
});

test("lessons retain curriculum positions and sort unnumbered titles naturally", () => {
  const tracks = [
    { title: "Lesson 10", series: null }, { title: "Later", series: { position: 2 } },
    { title: "Lesson 2", series: null }, { title: "First", series: { position: 1 } },
  ];
  assert.deepEqual(sortPlaylistTracks(tracks).map((t) => t.title), ["First", "Later", "Lesson 2", "Lesson 10"]);
  assert.equal(tracks[0].title, "Lesson 10", "sorting must not mutate stored data");
});

test("seeded playlists have unique routes, valid membership, and available local audio files", () => {
  const seriesIds = new Set(seed.series.filter((s) => s.status !== "draft").map((s) => s.id));
  const audio = seed.lectures.filter((l) => l.status !== "draft" && l.media.audio);
  const grouped = audio.filter((l) => seriesIds.has(l.series?.id));
  const loose = audio.filter((l) => !seriesIds.has(l.series?.id));
  assert.equal(new Set(seed.series.map((s) => s.slug)).size, seed.series.length, "playlist routes must be unique");
  assert.ok(!seed.series.some((s) => s.slug === "other-audio"), "the fallback playlist route must be available");
  for (const l of grouped) assert.ok(l.slug && l.id, "grouped lessons must have reachable detail routes");
  const playlists = publicPlaylists(seed.series.map((s) => ({ ...s, lectures: seed.lectures.filter((l) => l.series?.id === s.id) })));
  assert.equal(playlists.flatMap((p) => p.lectures).filter((l) => l.media.audio).length, grouped.length);
  assert.ok(grouped.length > 600);
  assert.ok(loose.length > 0);
  for (const lecture of audio) {
    if (lecture.media.audio.startsWith("/audio/")) {
      assert.ok(fs.existsSync(new URL(`../public${lecture.media.audio}`, import.meta.url)), lecture.media.audio);
    }
  }
});

test("gallery duplicates stay in their course playlist and loose audio appears only once", () => {
  const playlists = publicPlaylists(seed.series.map((s) => ({ ...s, lectures: seed.lectures.filter((l) => l.series?.id === s.id) })));
  const media = [
    ...seed.lectures.filter((l) => l.status !== "draft").map((l) => ({ kind: "audio", url: l.media.audio })),
    ...seed.media.filter((m) => m.title),
  ];
  const loose = unassignedAudio(media, playlists);
  assert.equal(loose.length, 18, "only standalone audio belongs in the fallback playlist");
  assert.equal(new Set(loose.map((m) => m.url)).size, loose.length);
  const urls = new Set([...playlists.flatMap((p) => p.lectures.map((l) => l.media.audio)), ...loose.map((m) => m.url)].filter(Boolean));
  for (const m of media.filter((m) => m.kind === "audio" && m.url)) assert.ok(urls.has(m.url));
});
