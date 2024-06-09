"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { attempt, parseArticleTitle } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";

// https://github.com/szymondlugolecki/lab-articles.git

const articleCreateSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Invalid title",
      required_error: "Title is required",
    })
    .min(3),
});

// const date = new Date().toLocaleDateString('pl-PL')

export default async function create(
  data: z.infer<typeof articleCreateSchema>
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = articleCreateSchema.safeParse(data);

  if (!result.success) {
    result.error;
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { title } = data;
  const id = generateRandomString(10, alphabet("a-z", "0-9"));
  const parsedTitle = parseArticleTitle(title);

  // Upload to Github
  const [, failedGithubUpload] = await attempt(
    octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: "szymondlugolecki",
      repo: "lab-articles",
      path: `articles/pl/${id}.json`,
      message: `Added ${title}`,
      content: Buffer.from("[]").toString("base64"),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
  );
  if (failedGithubUpload) {
    console.error("Error while uploading to Github", failedGithubUpload);
    return {
      error: "Error while uploading to Github",
    };
  }

  const [, failedDatabaseUpload] = await attempt(
    db.insert(articlesTable).values({
      id,
      title,
      parsedTitle,
      authorId: session.user.id,
    })
  );
  if (failedDatabaseUpload) {
    console.error("Error while uploading to Database", failedDatabaseUpload);
    return {
      error: "Error while uploading to Database",
    };
  }

  redirect(`/article/${parsedTitle}/update`);
}
