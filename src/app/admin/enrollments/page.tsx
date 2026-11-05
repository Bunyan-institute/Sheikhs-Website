import { getAllCourseEnrollments } from "@/lib/db/repository";
import { EnrollmentsClient } from "./enrollments-client";

export default async function AdminEnrollmentsPage() {
  const enrollments = await getAllCourseEnrollments();
  return <EnrollmentsClient initialEnrollments={enrollments} />;
}
