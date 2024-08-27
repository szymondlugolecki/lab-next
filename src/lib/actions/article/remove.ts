"use server";

import { auth } from "@/lib/auth";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { attempt, getArticlePath, parseArticleTitle } from "@/lib/utils";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";
import { ArticleCreateSchema } from "@/lib/schemas/article";
import { article$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// https://github.com/szymondlugolecki/lab-articles.git

// This is used to delete an article from database (!) only
// It doesn't delete the article from Github
// Since one article is only a few KBs of data
// It won't hurt to leave it there
const removeArticle = moderatorAction
  .schema(article$.remove())
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    // Remove article from the database
    const [, removeArticleError] = await attempt(
      db.delete(articlesTable).where(eq(articlesTable.id, id))
    );

    if (removeArticleError) {
      console.error(
        "Error while removing article from the database",
        removeArticleError
      );
      return {
        error: "Error while removing article from the database",
      };
    }

    revalidatePath("/admin/articles");

    return {
      success: true,
    };
  });

export default removeArticle;
