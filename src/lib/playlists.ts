import type { PublicSeries } from "./api/types";

/** Keep curriculum order, with natural title ordering for unnumbered lessons. */
export function sortPlaylistTracks<T extends { title: string; series: { position: number | null } | null }>(tracks: T[], locale = "en"): T[] {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  return [...tracks].sort((a, b) =>
    (a.series?.position ?? Number.MAX_SAFE_INTEGER) - (b.series?.position ?? Number.MAX_SAFE_INTEGER) || collator.compare(a.title, b.title)
  );
}

export function publicPlaylists(series: PublicSeries[], locale = "en"): PublicSeries[] {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  return series.filter((s) => s.status !== "draft").map((s) => {
    const lectures = sortPlaylistTracks((s.lectures ?? []).filter((l) => l.status !== "draft"), locale);
    return { ...s, lectures, lecture_count: lectures.length };
  }).sort((a, b) => collator.compare(a.title, b.title));
}

/** Uploaded gallery references may point at the same audio as a course lesson. */
export function unassignedAudio<T extends { kind: string; url: string | null }>(media: T[], playlists: PublicSeries[]): T[] {
  const seen = new Set(playlists.flatMap((p) => (p.lectures ?? []).flatMap((l) => l.media.audio ? [l.media.audio] : [])));
  return media.filter((m) => {
    if (m.kind !== "audio" || !m.url || seen.has(m.url)) return false;
    seen.add(m.url);
    return true;
  });
}
