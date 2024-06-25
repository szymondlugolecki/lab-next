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
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ArticleUpdateContentSchema } from "@/lib/schemas/article";

// https://github.com/szymondlugolecki/lab-articles.git

import { article$ } from "@/lib/schemas";

// const date = new Date().toLocaleDateString('pl-PL')

export default async function updateContent(
  data: z.infer<ArticleUpdateContentSchema>
) {
  console.log(0);
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const result = article$.update().content.safeParse(data);
  console.log(1);

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }
  console.log(2);

  const { id, content, locale } = result.data;
  const language = getLanguageFromLocale(locale);
  console.log(3);

  // Update the article on Github
  const [, failedGithubUpdate] = await attempt(
    octokit.createOrUpdateTextFile({
      owner: process.env.GH_REPO_OWNER,
      repo: process.env.GH_REPO_NAME,
      path: getArticlePath(id, language),
      content,
      message: `Updated article`,
    })
  );
  console.log(4);
  if (failedGithubUpdate) {
    console.error("Error while updating article on Github", failedGithubUpdate);
    return {
      error: "Error while updating the article on Github",
    };
  }
  console.log(5);

  const searchContentParsed = extractTextFromJSON(JSON.parse(content));

  // Updating the content in the database
  const [newDatabaseArticle, failedDatabaseUpload] = await attempt(
    db
      .update(articleVariantsTable)
      .set({ searchContent: searchContentParsed })
      .where(
        and(
          eq(articleVariantsTable.id, id),
          eq(articleVariantsTable.language, language)
        )
      )
      .returning({ parsedTitle: articleVariantsTable.parsedTitle })
  );
  console.log(6);
  if (failedDatabaseUpload) {
    console.error(
      "Error while updating article content in the database",
      failedDatabaseUpload
    );
    return {
      error: "Error while updating content in the database",
    };
  }
  console.log(7);

  redirect(`/article/${newDatabaseArticle[0].parsedTitle}`);
}
