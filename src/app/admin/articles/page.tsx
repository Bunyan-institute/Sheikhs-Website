import { getAllArticles } from "@/lib/db/repository";
import { ArticlesClient } from "./articles-client";

export default function AdminArticlesPage() {
  const articles = getAllArticles();
  return <ArticlesClient initialArticles={articles} />;
}
