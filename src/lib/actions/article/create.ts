"use server";

import { auth } from "@/lib/auth";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable, articlesTable } from "@/lib/db/tables/article";
import { redirect, permanentRedirect } from "@/lib/i18n/navigation";
import { octokit } from "@/lib/server/clients";
import { attempt, getArticlePath, parseArticleTitle } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
// import { permanentRedirect, redirect } from "next/navigation";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";
import { ArticleCreateSchema } from "@/lib/schemas/article";
import { article$ } from "@/lib/schemas";

// https://github.com/szymondlugolecki/lab-articles.git

// const date = new Date().toLocaleDateString('pl-PL')

export default async function create(data: z.infer<ArticleCreateSchema>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = article$.create().safeParse(data);

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { title, language } = data;
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

  // console.log(
  //   "redirecting to",
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/${language}/article/${parsedTitle}/update`
  // );

  return {
    success: true,
    parsedTitle,
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

  // console.log("redirecting to", `/article/${parsedTitle}/update`);
  // permanentRedirect({
  //   pathname: "/article/[title]/update",
  //   params: { title: parsedTitle },
  // });
}
