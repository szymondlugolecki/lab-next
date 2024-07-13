"use server";

import { auth } from "@/lib/auth";
import { LANGUAGES_MAP, LOCALES, Language, Locale } from "@/lib/constants";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/tables/user";
import { octokit } from "@/lib/server/clients";
import {
  attempt,
  extractTextFromJSON,
  getArticlePath,
  getLanguageFromLocale,
  getRoleRank,
  isModerator,
  parseArticleTitle,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { UserRoleChangeSchema } from "@/lib/schemas/user";

// https://github.com/szymondlugolecki/lab-articles.git

import { user$ } from "@/lib/schemas";
import { getPathname } from "@/lib/i18n/navigation";

export default async function changeRole(data: z.infer<UserRoleChangeSchema>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // if (session.user.email !== "szymon.dlugolecki77@gmail.com") {
  if (!isModerator(session.user.role)) {
    throw new Error("Insufficient permissions");
  }
  // }

  const result = user$.role().change.safeParse(data);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { id, role } = result.data;

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    columns: {
      role: true,
    },
  });
  if (!user) {
    return {
      error: "User not found",
    };
  }
  // Can only change the role of users with a lower rank
  // if (session.user.email !== "szymon.dlugolecki77@gmail.com") {
  if (getRoleRank(user.role) <= getRoleRank(session.user.role)) {
    return {
      error: "Insufficient permissions",
    };
  }
  // }

  // Update user role in the database
  const [, failedRoleChange] = await attempt(
    db.update(usersTable).set({ role }).where(eq(usersTable.id, id))
  );
  if (failedRoleChange) {
    console.error("Error while changing the role of a user", failedRoleChange);
    return {
      error: "Error while changing the role of a user",
    };
  }

  revalidatePath("/admin/users");

  return {
    success: true,
  };
}
