"use server";

import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/tables/user";
import { attempt, getRoleRank } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// https://github.com/szymondlugolecki/lab-articles.git

import { user$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";

// This is used to change a user's role
const changeRole = moderatorAction
  .schema(user$.role().change)
  .action(async ({ parsedInput, ctx }) => {
    const { id: userId, role } = parsedInput;

    // First, check if the user exists
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: {
        role: true,
      },
    });
    if (!user) {
      return {
        error: "User not found",
      };
    }

    if (ctx.session.user.email !== process.env.OWNER_EMAIL) {
      // Next, handle permission check
      // Can only change the role of a user with lower rank
      if (getRoleRank(user.role) <= getRoleRank(ctx.session.user.role)) {
        return {
          error: "Insufficient permissions",
        };
      }
    }

    // Permissions are OK, we can update user role in the database
    const [, failedRoleChange] = await attempt(
      db.update(usersTable).set({ role }).where(eq(usersTable.id, userId))
    );
    if (failedRoleChange) {
      console.error(
        "Error while changing the role of a user",
        failedRoleChange
      );
      return {
        error: "Error while changing the role of a user",
      };
    }

    revalidatePath("/admin/users");

    return {
      success: true,
    };
  });

export default changeRole;
