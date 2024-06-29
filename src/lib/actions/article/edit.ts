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
import { redirect } from "next/navigation";
import { z } from "zod";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";

// https://github.com/szymondlugolecki/lab-articles.git

import { article$ } from "@/lib/schemas";

export default async function edit(data: z.infer<ArticleEditInfoSchema>) {
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

  const { id, title, privacy, category, tags } = result.data;

  const article = await db.query.articleVariantsTable.findFirst({
    where: eq(articleVariantsTable.id, id),
    columns: {
      articleId: true,
    },
  });
  if (!article) {
    return {
      error: "Article not found",
    };
  }

  // Updating article info in the database
  const [, failedDatabaseUpload] = await attempt(
    db.batch([
      db
        .update(articleVariantsTable)
        .set({ title, parsedTitle: parseArticleTitle(title) })
        .where(eq(articleVariantsTable.id, id)),
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

  return {
    success: true,
  };
}
