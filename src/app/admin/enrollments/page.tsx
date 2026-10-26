import { getAllCourseEnrollments } from "@/lib/db/repository";
import { EnrollmentsClient } from "./enrollments-client";

export default function AdminEnrollmentsPage() {
  const enrollments = getAllCourseEnrollments();
  return <EnrollmentsClient initialEnrollments={enrollments} />;
}
