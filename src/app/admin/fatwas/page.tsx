import { getAllFatwas } from "@/lib/db/repository";
import { FatwasClient } from "./fatwas-client";

export default async function AdminFatwasPage() {
  const fatwas = await getAllFatwas();
  return <FatwasClient initialFatwas={fatwas} />;
}
