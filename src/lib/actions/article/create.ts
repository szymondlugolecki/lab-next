"use server";

import { auth } from "@/lib/auth";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable, articlesTable } from "@/lib/db/tables/article";
// import { redirect, permanentRedirect } from "@/lib/i18n/navigation";
import { octokit } from "@/lib/server/clients";
import { attempt, getArticlePath, parseArticleTitle } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
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
  language: Language,
  data: z.infer<typeof articleCreateSchema>
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = articleCreateSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { title } = data;
  const articleId = generateRandomString(10, alphabet("a-z", "0-9"));
  const articleVariantId = generateRandomString(10, alphabet("a-z", "0-9"));
  const parsedTitle = parseArticleTitle(title);

  // Upload to Github
  const [, failedGithubUpload] = await attempt(
    octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: "szymondlugolecki",
      repo: "lab-articles",
      path: getArticlePath(articleVariantId, language),
      message: `New Article: ${title}`,
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

  const [, failedArticleInsert] = await attempt(
    db.batch([
      db.insert(articlesTable).values({ id: articleId }),
      db.insert(articleVariantsTable).values({
        id: articleVariantId,
        title,
        parsedTitle,
        language,
        authorId: session.user.id,
        articleId,
      }),
    ])
  );

  if (failedArticleInsert) {
    console.error(
      "Error while inserting article into the database",
      failedArticleInsert
    );
    return {
      error: "Error while inserting article into the database",
    };
  }

  // const [, failedArticleVariantInsert] = await attempt(

  // );
  // if (failedArticleVariantInsert) {
  //   console.error("Error while inserting article variant into the database", failedArticleVariantInsert);
  //   return {
  //     error: "Error while inserting article variant into the database",
  //   };
  // }

  console.log(
    "redirecting to",
    `${process.env.NEXT_PUBLIC_BASE_URL}/${language}/article/${parsedTitle}/update`
  );

  return {
    success: true,
  };

  // Doesn't throw an error, but doesn't redirect either:
  // NextResponse.redirect(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/${language}/article/${parsedTitle}/update`
  // );

  // Error + no redirect:
  // I think this redirect is not compatible with edge runtime or actions
  // redirect({
  //   pathname: "/article/[title]/update",
  //   params: { title: parsedTitle },
  // });
}
