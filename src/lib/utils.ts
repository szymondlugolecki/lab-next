import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language, Locale, Role } from "./constants";
import { JSONContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/html";
import { octokit } from "./server/clients";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";
import StarterKit from "@tiptap/starter-kit";

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
    .split(/[ ,|:]+/)
    .filter((x) => x)
    .join("-")
    .toLowerCase();

export const getURLFriendlyEmail = (email: string) => {
  return email.split("@")[0];
};

export const getArticlePath = (articleId: string) =>
  `articles/${articleId}/article.json`;

export const isModerator = (role: Role) => {
  return role === "moderator" || role === "admin";
};

export const getRoleRank = (role: Role) => {
  if (role === "admin") return 0;
  if (role === "moderator") return 1;
  if (role === "guest") return 2;
  if (role === "awaiting-approval") return 3;
  return 4;
};

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
  const contentParsed = JSON.parse(contentStringified);
  const isDocumentEmpty =
    !contentParsed ||
    (Array.isArray(contentParsed) && contentParsed.length === 0);
  const document = isDocumentEmpty
    ? { type: "doc", content: [] }
    : contentParsed;

  return sanitizeHtml(
    generateHTML(document, [
      StarterKit,
      Document,
      Heading,
      Paragraph,
      Text,
      Bold,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
      }),
    ])
  );
};
