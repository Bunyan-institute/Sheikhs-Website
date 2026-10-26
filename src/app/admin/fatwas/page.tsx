import { getAllFatwas } from "@/lib/db/repository";
import { FatwasClient } from "./fatwas-client";

export default function AdminFatwasPage() {
  const fatwas = getAllFatwas();
  return <FatwasClient initialFatwas={fatwas} />;
}
