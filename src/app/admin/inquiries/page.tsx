import { getAllInquiries } from "@/lib/db/repository";
import { InquiriesClient } from "./inquiries-client";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();
  return <InquiriesClient initialInquiries={inquiries} />;
}
