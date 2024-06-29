import { CATEGORIES, LOCALES, PRIVACY, TAGS } from "@/lib/constants";
import type { Category, Tag, Language } from "@/lib/constants";
import { z } from "zod";

export const create = (language: Language = "en") =>
  z.object({
    title: z
      .string({
        invalid_type_error: "Invalid title",
        required_error: "Title is required",
      })
      .min(3),
    language: z.enum(LOCALES, {
      invalid_type_error: "Invalid language",
      required_error: "Language is required",
    }),
  });

export const edit = (language: Language = "en") => ({
  info: z.object({
    id: z.string({
      invalid_type_error: "Invalid article id",
      required_error: "Article id is required",
    }),
    variantId: z.string({
      invalid_type_error: "Invalid article id",
      required_error: "Article id is required",
    }),
    title: z.string({
      invalid_type_error: "Invalid title",
      required_error: "Title is required",
    }),
    privacy: z.enum(PRIVACY, {
      invalid_type_error: "Invalid privacy",
      required_error: "Privacy is required",
    }),
    category: z.enum(CATEGORIES as [Category, ...Category[]], {
      invalid_type_error: "Invalid category",
      required_error: "Category is required",
    }),
    tags: z
      .array(
        z.enum(TAGS as [Tag, ...Tag[]], {
          invalid_type_error: "Invalid tags",
          required_error: "Tags are required",
        }),
        {
          invalid_type_error: "Invalid tags",
          required_error: "Tags are required",
        }
      )
      .optional(),
  }),
  content: z.object({
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
  }),
});

export type ArticleCreateSchema = ReturnType<typeof create>;
export type ArticleEditInfoSchema = ReturnType<typeof edit>["info"];
export type ArticleEditContentSchema = ReturnType<typeof edit>["content"];
