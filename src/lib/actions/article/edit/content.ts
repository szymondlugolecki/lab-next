"use server";

import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { attempt, extractTextFromJSON, getArticlePath } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { article$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";

// This action is used to edit article's content
// First it changes it on Github
// Then it the parsed search-optimized text in the database

// Transactions here would be great, but SQLite DOES NOT ALLOW THEM!
// Instead I'm going with Promise.allSettled() here
const editArticleContent = moderatorAction
  .schema(article$.edit().content)
  .action(async ({ parsedInput }) => {
    const { id, content, language } = parsedInput;

    const githubContentUpdate = octokit.createOrUpdateTextFile({
      owner: process.env.GH_REPO_OWNER,
      repo: process.env.GH_REPO_NAME,
      path: getArticlePath(id),
      content,
      message: `Update`,
    });

    // Extracting text optimized for search from JSON
    const searchContentParsed = extractTextFromJSON(JSON.parse(content));

    const databaseContentUpdate = db
      .update(articlesTable)
      .set({ searchContent: searchContentParsed })
      .where(eq(articlesTable.id, id))
      .returning({ parsedTitle: articlesTable.parsedTitle });

    // Run both promises at once
    const [githubUpdateResult, databaseUpdateResult] = await Promise.allSettled(
      [githubContentUpdate, databaseContentUpdate]
    );
    if (githubUpdateResult.status === "rejected") {
      console.error(
        "Error while updating article content on Github",
        githubUpdateResult.reason
      );
      return {
        error: "Error while updating article content on Github",
      };
    }
    if (databaseUpdateResult.status === "rejected") {
      console.error(
        "Error while updating article content in the database",
        databaseUpdateResult.reason
      );
      return {
        error: "Error while updating article content in the database",
      };
    }

    redirect(`/article/${databaseUpdateResult.value[0].parsedTitle}`);
  });

export default editArticleContent;
