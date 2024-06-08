"use server";

import { octokit } from "@/lib/server/clients";
import { generateRandomString, alphabet } from "oslo/crypto";

// https://github.com/szymondlugolecki/lab-articles.git

export default async function create(content: string, formData: FormData) {
  const title = formData.get("title");
  console.log("formData", title);
  // const date = new Date().toLocaleDateString('pl-PL')

  if (!title || typeof title !== "string") {
    throw new Error("Title is required");
  }

  // const parseTitle = title.toString().replace(/\s+/g, "-").toLowerCase();
  const id = generateRandomString(10, alphabet("a-z", "0-9"));

  // Upload to Github
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "szymondlugolecki",
    repo: "lab-articles",
    path: `articles/${id}.json`,
    message: `Added ${title}`,
    content: Buffer.from(content).toString("base64"),
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return;
}
