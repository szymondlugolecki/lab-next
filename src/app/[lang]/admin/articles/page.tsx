import { db } from "@/lib/db";
import { AdminTableArticle, columns } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";
import { Language } from "@/lib/constants";

function fetchArticles() {
  return db.query.articlesTable.findMany({
    columns: {
      id: true,
      privacy: true,
      category: true,
      tags: true,
      language: true,
      title: true,
      parsedTitle: true,
      createdAt: true,
    },
    with: {
      author: {
        columns: {
          id: true,
          email: true,
          image: true,
          name: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: (articles, { desc }) => [desc(articles.createdAt)],
  });
}

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={articles} />
    </div>
  );
}
