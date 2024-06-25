import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language, Locale } from "./constants";
import { JSONContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/html";
import { octokit } from "./server/clients";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const attempt = async <T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (throwable) {
    if (throwable instanceof Error) return [null, throwable];

    throw throwable;
  }
};

// replace all spaces and *special* characters with a dash
// convert & to 'and'
export const parseArticleTitle = (title: string) =>
  title
    .toString()
    .replaceAll("&", "and")
    .split(/[ ,]+/)
    .filter((x) => x)
    .join("-")
    .toLowerCase();

export const getArticlePath = (articleVariantId: string, language: Language) =>
  `articles/${language}/${articleVariantId}.json`;

export const extractTextFromJSON = (json: JSONContent) => {
  let text = "";

  // If the current object has a "text" property, add it to the result.
  if (json.text) {
    text += json.text;
  }

  // If the current object has a "content" property, recursively extract text from its children.
  if (json.content) {
    for (const child of json.content) {
      text += extractTextFromJSON(child);
    }
  }

  return text;
};

export const getLanguageFromLocale = (locale: Locale): Language => {
  if (locale.startsWith("pl")) {
    return "pl";
  }

  return "en";
};

// {
//   content?: string[] | undefined;
// }

export const errorToToast = (error: string | Record<string, string[]>) => {
  if (typeof error === "string") {
    return [error];
  }

  return Object.entries(error).map(
    ([key, value]) => `${key}: ${value.join(". ")}`
  );
};

export const fetchArticleHTML = async (path: string) => {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: process.env.GH_REPO_OWNER,
      repo: process.env.GH_REPO_NAME,
      path,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  // console.log("data", typeof data, data);

  if (!("content" in data)) {
    return "No content found";
  }

  const contentStringified = Buffer.from(data.content, "base64").toString(
    "utf-8"
  );
  const jsonContent = JSON.parse(contentStringified);
  const document = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: jsonContent,
      },
    ],
  };

  return sanitizeHtml(
    generateHTML(document, [Document, Paragraph, Text, Bold])
  );
};
