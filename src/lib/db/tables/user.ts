import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  type InferSelectModel,
  type InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { ROLES } from "../../constants";
import {
  allowedAccessTable,
  articlesTable,
  blockedAccessTable,
} from "./article";

export const usersTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateIdFromEntropySize(10)),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  role: text("role", { enum: ROLES }).notNull().default("awaiting-approval"),

  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image").notNull(),
});

// Relations for usersTable
export const usersRelations = relations(usersTable, ({ many }) => ({
  authoredArticles: many(articlesTable, { relationName: "author" }),
  allowedArticles: many(allowedAccessTable, {
    relationName: "allowed_article_user",
  }),
  blockedArticles: many(blockedAccessTable, {
    relationName: "blocked_article_user",
  }),
}));

export const insertUserSchema = createInsertSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
