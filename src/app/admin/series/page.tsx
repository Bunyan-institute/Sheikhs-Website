import { redirect } from "next/navigation";

export default function AdminSeriesRedirect() {
  redirect("/admin/playlists");
}
