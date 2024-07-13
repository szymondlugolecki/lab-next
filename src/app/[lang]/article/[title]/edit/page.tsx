import Tiptap from "@/components/editor/tip-tap";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { fetchArticleHTML, getArticlePath } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/html";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import {
  EllipsisVertical,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import { EditArticleInfoSheet } from "./(components)/edit-article-settings-sheet";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";

const fetchArticle = async (parsedTitle: string, lang: Language) => {
  const result = await db.query.articleVariantsTable.findFirst({
    where: and(
      eq(articleVariantsTable.parsedTitle, parsedTitle),
      eq(articleVariantsTable.language, lang)
    ),
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
    variantId: result.id,
    language: result.language,
    title: result.title,
  };

  const articleData = {
    id: result.article.id,
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
  const t = await getTranslations("Article");
  const articleData = await fetchArticle(params.title, params.lang);
  if (!articleData) {
    throw new Error("Article not found");
  }
  const articleContent = await fetchArticleHTML(
    getArticlePath(articleData.variantId, articleData.language)
  );

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
              <EditArticleInfoSheet
                articleData={articleData}
                lang={params.lang}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-x-1.5"
                  size="sm"
                >
                  {t("edit_article_settings")}
                  <Settings className="size-4" />
                </Button>
              </EditArticleInfoSheet>
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
