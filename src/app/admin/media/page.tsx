import { getAllMedia } from "@/lib/db/repository";
import { MediaClient } from "./media-client";

export default function AdminMediaPage() {
  const mediaItems = getAllMedia();
  return <MediaClient initialMedia={mediaItems} />;
}
