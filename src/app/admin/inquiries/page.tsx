import { getAllInquiries } from "@/lib/db/repository";
import { InquiriesClient } from "./inquiries-client";

export default function AdminInquiriesPage() {
  const inquiries = getAllInquiries();
  return <InquiriesClient initialInquiries={inquiries} />;
}
