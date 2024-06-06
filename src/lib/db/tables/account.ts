import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { usersTable } from "./user";
import type { AdapterAccountType } from "next-auth/adapters";

export const accountsTable = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const insertOauthAccountSchema = createInsertSchema(accountsTable);
export const selectOauthAccountSchema = createSelectSchema(accountsTable);

export type SelectOauthAccount = InferSelectModel<typeof accountsTable>;
export type InsertOauthAccount = InferInsertModel<typeof accountsTable>;
