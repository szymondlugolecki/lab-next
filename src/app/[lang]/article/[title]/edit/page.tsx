import Tiptap from "@/components/editor/tip-tap";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { fetchArticleHTML, getArticlePath } from "@/lib/utils";
import { eq } from "drizzle-orm";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/html";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { EllipsisVertical, SquareArrowOutUpRight } from "lucide-react";
// import { EditArticleForm } from "./edit-article-form";

export const runtime = "edge";

const fetchArticle = async (parsedTitle: string) => {
  const result = await db.query.articleVariantsTable.findFirst({
    where: eq(articleVariantsTable.parsedTitle, parsedTitle),
    columns: {
      id: true,
      language: true,
      title: true,
    },
    with: {
      article: {
        columns: {
          id: true,
          privacy: true,
          category: true,
          tags: true,
        },
      },
    },
  });

  if (!result) {
    return null;
  }

  const variantData = {
    id: result.id,
    language: result.language,
    title: result.title,
  };

  const articleData = {
    articleId: result.article.id,
    privacy: result.article.privacy,
    category: result.article.category,
    tags: result.article.tags,
  };

  return {
    ...variantData,
    ...articleData,
  };
};

export default async function Page({
  params,
}: {
  params: { lang: Language; title: string };
}) {
  const articleData = await fetchArticle(params.title);
  if (!articleData) {
    return {
      status: 404,
      error: "Article not found",
    };
  }
  const articleContent = await fetchArticleHTML(
    getArticlePath(articleData.id, articleData.language)
  );

  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* <EditArticleForm defaultValues={articleData} /> */}
            <div className="flex justify-between gap-x-2 pb-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {articleData.title}
              </h1>
              <div className="flex flex-col gap-2 justify-start items-center">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={{
                      pathname: "/article/[title]",
                      params: { title: params.title },
                    }}
                  >
                    <SquareArrowOutUpRight className="size-5" />
                    <span className="sr-only">Read article</span>
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={{
                      pathname: "/article/[title]/edit",
                      params: { title: params.title },
                    }}
                  >
                    <EllipsisVertical className="size-5" />
                    <span className="sr-only">Edit info</span>
                  </Link>
                </Button>
              </div>
            </div>
            <Tiptap id={articleData.id} fetchedContent={articleContent} />
          </div>
        </div>
      </section>
    </main>
  );
}
