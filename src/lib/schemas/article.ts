import { LOCALES, type Language } from "@/lib/constants";
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

export type ArticleCreateSchema = ReturnType<typeof create>;
