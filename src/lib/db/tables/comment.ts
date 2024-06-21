import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  type InferSelectModel,
  type InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import { usersTable } from "./user";
import { articlesTable } from "./article";

export const commentsTable = sqliteTable("comment", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  content: text("content").notNull(),

  articleId: text("article_id")
    .notNull()
    .references(() => articlesTable.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

// Relations for commentsTable
export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [commentsTable.authorId],
    references: [usersTable.id],
    relationName: "author",
  }),
  article: one(articlesTable, {
    fields: [commentsTable.articleId],
    references: [articlesTable.id],
    relationName: "comments",
  }),
}));

export const insertCommentSchema = createInsertSchema(commentsTable);
export const selectCommentSchema = createSelectSchema(commentsTable);

export type SelectComment = InferSelectModel<typeof commentsTable>;
export type InsertComment = InferInsertModel<typeof commentsTable>;
