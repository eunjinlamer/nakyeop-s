import { notFound } from "next/navigation";
import { getArticleById, getNeighbors } from "@/data/articles";
import { ArticleViewer } from "@/components/ArticleViewer";

// Next 16 App Router: dynamic params arrive as a Promise that must be awaited.
export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();

  const { prev, next } = getNeighbors(id);

  return (
    <ArticleViewer
      article={article}
      prev={prev ? { id: prev.id, title: prev.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
    />
  );
}
