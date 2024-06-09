"use server";

import { octokit } from "@/lib/server/clients";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";

// https://github.com/szymondlugolecki/lab-articles.git

// const date = new Date().toLocaleDateString('pl-PL')

// interface ArticleUpdateSchema {
//   content: JSONContent;
// }

export default async function updateContent(content: JSONContent) {
  console.log("update.ts", typeof content, content);
  try {
    JSON.parse(JSON.stringify(content));
  } catch (error) {
    return {
      error: "Invalid content",
    };
  }

  // const { content } = data;

  //

  //   const id = generateRandomString(10, alphabet("a-z", "0-9"));
  //   const parsedTitle = title.toString().replace(/\s+/g, "-").toLowerCase();

  //   // Upload to Github
  //   try {
  //     await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
  //       owner: "szymondlugolecki",
  //       repo: "lab-articles",
  //       path: `articles/${id}.json`,
  //       message: `Added ${title}`,
  //       content: Buffer.from("[]").toString("base64"),
  //       headers: {
  //         "X-GitHub-Api-Version": "2022-11-28",
  //       },
  //     });
  //   } catch (error) {
  //     return {
  //       errror: "Error while uploading to Github",
  //     };
  //   }

  redirect(`/`);
  // revalidatePath('/')
}
