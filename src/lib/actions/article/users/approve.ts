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
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { UserRoleApproveSchema } from "@/lib/schemas/user";

// https://github.com/szymondlugolecki/lab-articles.git

import { user$ } from "@/lib/schemas";

export default async function approve(data: z.infer<UserRoleApproveSchema>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  console.log("approve", session.user.role, isModerator(session.user.role));

  if (!isModerator(session.user.role)) {
    throw new Error("Insufficient permissions");
  }

  const result = user$.role().approve.safeParse(data);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { ids } = result.data;

  // Filter users only with awaiting-approval role for convenience
  const users = await db.query.usersTable.findMany({
    where: and(
      inArray(usersTable.id, ids),
      eq(usersTable.role, "awaiting-approval")
    ),
    columns: {
      id: true,
    },
  });
  if (!users) {
    return {
      error: "Users not found",
    };
  }

  // Change user roles from 'awaiting-approval' to 'guest'
  const [, failedUserApproval] = await attempt(
    db
      .update(usersTable)
      .set({ role: "guest" })
      .where(
        inArray(
          usersTable.id,
          users.map((user) => user.id)
        )
      )
  );
  if (failedUserApproval) {
    console.error("Error while approving a user", failedUserApproval);
    return {
      error: "Error while approving a user",
    };
  }

  revalidatePath("/admin/users");

  return {
    success: true,
  };
}
