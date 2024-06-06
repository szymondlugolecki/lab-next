import { db } from "@/db";

import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { accountsTable } from "@/db/tables/account";
import { authenticatorsTable } from "@/db/tables/authenticator";
import { sessionsTable } from "@/db/tables/session";
import { usersTable } from "@/db/tables/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
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
    session({ session }) {
      return session;
    },
  },
});
