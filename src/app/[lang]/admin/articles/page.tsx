import { db } from "@/lib/db";
import { AdminTableArticle, columns } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";
import { Language } from "@/lib/constants";

async function getData(lang: Language): Promise<AdminTableArticle[]> {
  const articles = await db.query.articlesTable.findMany({
    columns: {
      id: true,
      privacy: true,
      category: true,
      tags: true,
    },
    with: {
      variants: {
        columns: {
          id: true,
          language: true,
          title: true,
          parsedTitle: true,
          createdAt: true,
        },
        // where: (variants, { eq }) => eq(variants.language, lang),
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
      },
    },
    orderBy: (articles, { desc }) => [desc(articles.createdAt)],
  });

  return articles
    .filter((article) => article.variants.length)
    .map((article) => ({
      id: article.id,
      privacy: article.privacy,
      category: article.category,
      tags: article.tags,
      variantId: article.variants[0].id,
      language: article.variants[0].language,
      title: article.variants[0].title,
      parsedTitle: article.variants[0].parsedTitle,
      createdAt: article.variants[0].createdAt,
      author: article.variants[0].author,
    }));
}

export default async function Page({ params }: { params: { lang: Language } }) {
  const data = await getData(params.lang);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
