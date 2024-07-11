"use server";

import { auth } from "@/lib/auth";
import { LANGUAGES_MAP, LOCALES, Language, Locale } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable, articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import {
  attempt,
  extractTextFromJSON,
  getArticlePath,
  getLanguageFromLocale,
  parseArticleTitle,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";

// https://github.com/szymondlugolecki/lab-articles.git

import { article$ } from "@/lib/schemas";
import { getPathname, redirect } from "@/lib/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function editInfo(data: z.infer<ArticleEditInfoSchema>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const result = article$.edit().info.safeParse(data);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { id, title, privacy, category, tags, variantId } = result.data;

  const article = await db.query.articleVariantsTable.findFirst({
    where: eq(articleVariantsTable.id, variantId),
    columns: {
      articleId: true,
    },
  });
  if (!article) {
    return {
      error: "Article not found",
    };
  }

  const parsedTitle = parseArticleTitle(title);

  // Updating article info in the database
  const [, failedDatabaseUpload] = await attempt(
    db.batch([
      db
        .update(articleVariantsTable)
        .set({ title, parsedTitle })
        .where(eq(articleVariantsTable.id, variantId)),
      db
        .update(articlesTable)
        .set({ privacy, category, tags })
        .where(eq(articlesTable.id, article.articleId)),
    ])
  );
  console.log(6);
  if (failedDatabaseUpload) {
    console.error(
      "Error while updating article info in the database",
      failedDatabaseUpload
    );
    return {
      error: "Error while updating info in the database",
    };
  }
  console.log(7);

  // Revalidating the article page
  revalidatePath("/article");
  revalidatePath("/admin/articles");

  return {
    success: true,
  };

  // redirect({
  //   pathname: "/article/[title]",
  //   params: {
  //     title: parsedTitle,
  //   },
  // });
}
