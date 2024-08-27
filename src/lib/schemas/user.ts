import { ROLES } from "@/lib/constants";
import type { Language } from "@/lib/constants";
import { z } from "zod";

// export const create = (language: Language = "en") =>
//   z.object({
//     title: z
//       .string({
//         invalid_type_error: "Invalid title",
//         required_error: "Title is required",
//       })
//       .min(3),
//     language: z.enum(LOCALES, {
//       invalid_type_error: "Invalid language",
//       required_error: "Language is required",
//     }),
//   });

export const role = (language: Language = "en") => ({
  change: z.object({
    id: z.string({
      invalid_type_error: "Invalid user id",
      required_error: "User id is required",
    }),
    role: z.enum(ROLES, {
      invalid_type_error: "Invalid role",
      required_error: "Role is required",
    }),
  }),
  approve: z.object({
    ids: z.array(
      z.string({
        invalid_type_error: "Invalid user ids",
        required_error: "User ids are required",
      }),
      {
        invalid_type_error: "Invalid user ids",
        required_error: "User ids are required",
      }
    ),
  }),
});

export type UserRoleChangeSchema = ReturnType<typeof role>["change"];
export type UserRoleApproveSchema = ReturnType<typeof role>["approve"];
