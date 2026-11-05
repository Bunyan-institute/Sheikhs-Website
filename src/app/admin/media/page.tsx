import { getAllMedia } from "@/lib/db/repository";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const mediaItems = await getAllMedia();
  return <MediaClient initialMedia={mediaItems} />;
}
