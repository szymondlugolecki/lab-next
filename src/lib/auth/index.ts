import { db } from "@/db";

import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { accountsTable } from "@/db/tables/account";
import { authenticatorsTable } from "@/db/tables/authenticator";
import { sessionsTable } from "@/db/tables/session";
import { usersTable } from "@/db/tables/user";
import { eq } from "drizzle-orm";
import { Role } from "../constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: DrizzleAdapter(db, {
    accountsTable,
    usersTable,
    sessionsTable,
    authenticatorsTable,
  }),
  providers: [GoogleProvider],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session }) {
      console.log("session callback");
      const result = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, session.user.id),
        columns: {
          role: true,
        },
      });
      console.log("result", result);
      if (!result) {
        return {
          ...session,
          user: { ...session.user, role: "awaiting-approval" },
        };
      }

      return { ...session, user: { ...session.user, role: result.role } };
    },
  },
});
