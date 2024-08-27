"use server";

import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/tables/user";
import { attempt } from "@/lib/utils";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { user$ } from "@/lib/schemas";
import { moderatorAction } from "@/lib/server/safe-action";

// This action changes the role of a user/users
// from awaiting-approval to guest
export const approve = moderatorAction
  .schema(user$.role().approve)
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

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
  });

export default approve;
