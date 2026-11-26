import { getPlaylists } from "@/lib/api/playlists";
import { getCourses } from "@/lib/api/courses";
import { PlaylistCatalog, type PlaylistCatalogItem } from "./playlist-catalog";

export async function PublicPlaylistCatalog({ locale }: { locale: string }) {
  const [playlists, courses] = await Promise.all([getPlaylists(locale), getCourses({ locale })]);
  const items: PlaylistCatalogItem[] = [
    ...playlists.map((p) => ({ id: p.id, title: p.title, description: p.description, href: `/playlists/${p.slug}`, count: p.lecture_count, kind: "playlist" as const })),
    ...courses.data.map((c) => ({ id: c.id, title: c.title, description: c.summary, href: `/courses/${c.slug}`, count: c.lesson_count, kind: "course" as const })),
  ];
  return <PlaylistCatalog items={items} locale={locale} />;
}
