import { getAllArticles } from "@/lib/db/repository";
import { ArticlesClient } from "./articles-client";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();
  return <ArticlesClient initialArticles={articles} />;
}
