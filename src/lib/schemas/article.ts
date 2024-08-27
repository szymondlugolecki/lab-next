import { CATEGORIES, LANGUAGES, LOCALES, PRIVACY, TAGS } from "@/lib/constants";
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
  settings: z.object({
    // id: z.string({
    //   invalid_type_error: "Invalid article id",
    //   required_error: "Article id is required",
    // }),
    id: z.string({
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
    language: z.enum(LANGUAGES as [Language, ...Language[]], {
      invalid_type_error: "Invalid language",
      required_error: "Language is required",
    }),
  }),
});

export type ArticleCreateSchema = z.infer<ReturnType<typeof create>>;
export type ArticleEditSettingsSchema = z.infer<
  ReturnType<typeof edit>["settings"]
>;
export type ArticleEditContentSchema = z.infer<
  ReturnType<typeof edit>["content"]
>;
