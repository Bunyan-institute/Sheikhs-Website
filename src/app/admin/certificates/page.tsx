import { getAllCertificates, getAllCourses } from "@/lib/db/repository";
import { CertificatesClient } from "./certificates-client";

export default async function AdminCertificatesPage() {
  const certificates = await getAllCertificates();
  const courses = await getAllCourses();

  return <CertificatesClient initialCertificates={certificates} courses={courses} />;
}
