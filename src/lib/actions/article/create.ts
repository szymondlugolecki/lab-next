"use server";

import { auth } from "@/lib/auth";
import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { getArticlePath, parseArticleTitle } from "@/lib/utils";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";
import { ArticleCreateSchema } from "@/lib/schemas/article";
import { article$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";

// https://github.com/szymondlugolecki/lab-articles.git

// This is used to create an empty article with default settings
// Only title & language are provided first
// Privacy, etc. are set to default
const createArticle = moderatorAction
  .schema(article$.create())
  .action(async ({ parsedInput, ctx }) => {
    const { title, language } = parsedInput;
    const articleId = generateRandomString(10, alphabet("a-z", "0-9"));
    const parsedTitle = parseArticleTitle(title);

    // Promise: Upload article to Github
    const uploadToGithub = octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "szymondlugolecki",
        repo: "lab-articles",
        path: getArticlePath(articleId),
        message: `Created: ${title}`,
        content: Buffer.from("[]").toString("base64"),
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    // Promise: Upload article to database
    const uploadToDatabase = db.insert(articlesTable).values({
      id: articleId,
      title,
      parsedTitle,
      language,
      authorId: ctx.session.user.id,
    });

    // Put article into the database & upload to Github at once
    const [githubUploadResult, dbUploadResult] = await Promise.allSettled([
      uploadToGithub,
      uploadToDatabase,
    ]);

    if (githubUploadResult.status === "rejected") {
      console.error(
        "Error while uploading to Github",
        githubUploadResult.reason
      );
      return {
        error: "Error while uploading to Github",
      };
    }
    if (dbUploadResult.status === "rejected") {
      console.error(
        "Error while inserting article into the database",
        dbUploadResult.reason
      );
      return {
        error: "Error while inserting article into the database",
      };
    }

    return {
      success: true,
      parsedTitle,
    };
  });

export default createArticle;
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
//   `${process.env.NEXT_PUBLIC_BASE_URL}/${language}/article/${parsedTitle}/edit`
// );

// return {
//   success: true,
//   parsedTitle,
// };

// Doesn't throw an error, but doesn't redirect either:
// NextResponse.redirect(
//   `${process.env.NEXT_PUBLIC_BASE_URL}/${language}/article/${parsedTitle}/edit`
// );

// Error + no redirect:
// I think this redirect is not compatible with edge runtime or actions
// redirect({
//   pathname: "/article/[title]/edit",
//   params: { title: parsedTitle },
// });

// console.log("redirecting to", `/article/${parsedTitle}/edit`);
// permanentRedirect({
//   pathname: "/article/[title]/edit",
//   params: { title: parsedTitle },
// });
