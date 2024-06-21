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

// https://github.com/szymondlugolecki/lab-articles.git

const articleUpdateContentSchema = z.object({
  id: z.string({
    invalid_type_error: "Invalid article id",
    required_error: "Article id is required",
  }),
  content: z.string({
    invalid_type_error: "Invalid content",
    required_error: "Content is required",
  }),
  locale: z.enum(LOCALES, {
    invalid_type_error: "Invalid locale",
    required_error: "Locale is required",
  }),
});

// const date = new Date().toLocaleDateString('pl-PL')

export default async function updateContent(
  data: z.infer<typeof articleUpdateContentSchema>
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = articleUpdateContentSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { id, content, locale } = data;
  const language = getLanguageFromLocale(locale);

  // Update the article on Github
  const [, failedGithubUpdate] = await attempt(
    octokit.createOrUpdateTextFile({
      owner: process.env.GH_REPO_OWNER,
      repo: process.env.GH_REPO_NAME,
      path: getArticlePath(id, language),
      content,
      message: `Updated article`,
    })
    // octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    //   owner: "szymondlugolecki",
    //   repo: "lab-articles",
    //   path: `articles/pl/${id}.json`,
    //   message: `Updated ${title}`,
    //   content: Buffer.from("[]").toString("base64"),
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28",
    //   },
    // })
  );
  if (failedGithubUpdate) {
    console.error("Error while updating article on Github", failedGithubUpdate);
    return {
      error: "Error while updating the article on Github",
    };
  }

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
  if (failedDatabaseUpload) {
    console.error(
      "Error while updating article content in the database",
      failedDatabaseUpload
    );
    return {
      error: "Error while updating content in the database",
    };
  }

  redirect(`/article/${newDatabaseArticle[0].parsedTitle}`);
}
