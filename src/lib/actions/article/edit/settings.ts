"use server";

import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { attempt, parseArticleTitle } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { article$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";

// https://github.com/szymondlugolecki/lab-articles.git

// This action is used to edit article's settings, like:
// title, privacy, tags
// Not content tho!
const editArticleSettings = moderatorAction
  .schema(article$.edit().settings)
  .action(async ({ parsedInput }) => {
    const { title, privacy, tags, id } = parsedInput;

    const parsedTitle = parseArticleTitle(title);

    // Updating article settings in the database
    const [, updateArticleSettingsError] = await attempt(
      db
        .update(articlesTable)
        .set({ title, parsedTitle, privacy, tags })
        .where(eq(articlesTable.id, id))
    );

    if (updateArticleSettingsError) {
      console.error(
        "Error while updating article settings in the database",
        updateArticleSettingsError
      );
      return {
        error: "Error while updating settings in the database",
      };
    }

    return {
      success: true,
      parsedTitle,
    };
  });

export default editArticleSettings;
