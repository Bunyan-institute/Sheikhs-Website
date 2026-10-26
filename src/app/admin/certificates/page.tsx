import { getAllCertificates, getAllCourses } from "@/lib/db/repository";
import { CertificatesClient } from "./certificates-client";

export default function AdminCertificatesPage() {
  const certificates = getAllCertificates();
  const courses = getAllCourses();

  return <CertificatesClient initialCertificates={certificates} courses={courses} />;
}
