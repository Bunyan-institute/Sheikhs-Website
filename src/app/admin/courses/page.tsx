import { getAllCourses } from "@/lib/db/repository";
import { CoursesClient } from "./courses-client";

export default function AdminCoursesPage() {
  const courses = getAllCourses();
  return <CoursesClient initialCourses={courses} />;
}
