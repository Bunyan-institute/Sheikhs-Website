import { getAllBooks } from "@/lib/db/repository";
import { LibraryClient } from "./library-client";

export default function AdminLibraryPage() {
  const books = getAllBooks();
  return <LibraryClient initialBooks={books} />;
}
