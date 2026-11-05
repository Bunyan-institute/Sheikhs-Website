import { getAllCourses } from "@/lib/db/repository";
import { CoursesClient } from "./courses-client";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();
  return <CoursesClient initialCourses={courses} />;
}
