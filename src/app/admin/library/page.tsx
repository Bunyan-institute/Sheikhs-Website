import { getAllBooks } from "@/lib/db/repository";
import { LibraryClient } from "./library-client";

export default async function AdminLibraryPage() {
  const books = await getAllBooks();
  return <LibraryClient initialBooks={books} />;
}
