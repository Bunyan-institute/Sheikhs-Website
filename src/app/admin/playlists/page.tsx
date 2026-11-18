import { getAllSeries } from "@/lib/db/repository";
import { PlaylistsClient } from "./playlists-client";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const playlists = await getAllSeries();
  return <PlaylistsClient initialPlaylists={playlists} />;
}
