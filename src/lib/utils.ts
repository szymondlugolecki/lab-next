import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language, Locale } from "./constants";
import { JSONContent } from "@tiptap/react";

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
    .split(",")
    .filter((x) => x)
    .join("-")
    .toLowerCase();

export const getArticlePath = (id: string, language: Language) =>
  `articles/${language}/${id}.json`;

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
