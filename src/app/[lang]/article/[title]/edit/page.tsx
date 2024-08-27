import Tiptap from "@/components/editor/tip-tap";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { fetchArticleHTML, getArticlePath } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { generateHTML } from "@tiptap/html";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import {
  EllipsisVertical,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import { EditArticleInfoDrawer } from "./(components)/edit-article-settings-drawer";
import { getTranslations } from "next-intl/server";
import { articlesTable } from "@/lib/db/tables/article";
import { EditArticleSettingsForm } from "./(components)/edit-article-settings-form";

export const runtime = "edge";

const fetchArticle = async (parsedTitle: string) => {
  const result = await db.query.articlesTable.findFirst({
    where: eq(articlesTable.parsedTitle, parsedTitle),
    columns: {
      id: true,
      language: true,
      title: true,
      privacy: true,
      category: true,
      tags: true,
    },
  });

  if (!result) {
    return null;
  }
  return result;
};

export default async function EditArticlePage({
  params,
}: {
  params: { lang: Language; title: string };
}) {
  const t = await getTranslations("Article");
  const articleData = await fetchArticle(decodeURIComponent(params.title));
  if (!articleData) {
    throw new Error("Article not found");
  }
  console.log("articleData", articleData);
  const articleContent = await fetchArticleHTML(getArticlePath(articleData.id));

  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Article Actions */}
            <div className="flex gap-x-2 justify-start items-center">
              {/* View Article Button */}
              <Button
                variant="ghost"
                asChild
                className="flex items-center gap-x-1.5"
                size="sm"
              >
                <Link
                  href={{
                    pathname: "/article/[title]",
                    params: { title: params.title },
                  }}
                >
                  {t("view_article")}
                  <SquareArrowOutUpRight className="size-4" />
                </Link>
              </Button>

              {/* Edit Article Settings Button */}
              <EditArticleInfoDrawer>
                <EditArticleSettingsForm
                  articleData={articleData}
                  lang={params.lang}
                />
              </EditArticleInfoDrawer>
            </div>

            <div className="pb-4"></div>

            <div className="flex justify-between gap-x-2 pb-4">
              {/* Article Title */}
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {articleData.title}
              </h1>
            </div>

            {/* Article Content */}
            <Tiptap id={articleData.id} fetchedContent={articleContent} />
          </div>
        </div>
      </section>
    </main>
  );
}
