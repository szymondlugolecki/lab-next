import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  type InferSelectModel,
  type InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import {
  LANGUAGES_MAP,
  PRIVACY,
  type Tag,
  type Language,
} from "../../constants";
import { usersTable } from "./user";
import { commentsTable } from "./comment";

const languages = LANGUAGES_MAP.map(({ value }) => value) as [
  Language,
  ...Language[]
];

export const articlesTable = sqliteTable("article", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  title: text("title").notNull(),
  parsedTitle: text("parsed_title").notNull(),

  language: text("language", { enum: languages }).notNull(),

  // category: text("category", { enum: categories }).notNull().default("other"),
  tags: text("tags", { mode: "json" }).$type<Tag[]>().notNull().default([]),

  // "private" | "public" | "restricted"
  privacy: text("privacy", { enum: PRIVACY }).notNull().default("private"),

  // parsed content optimized for search
  searchContent: text("search_content").notNull().default(""),

  authorId: text("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

// Junction table for allowed access
export const allowedAccessTable = sqliteTable(
  "allowed_access",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articlesTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.articleId, t.userId] }),
  })
);

// Junction table for blocked access
export const blockedAccessTable = sqliteTable(
  "blocked_access",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articlesTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.articleId, t.userId] }),
  })
);

// Relations for articlesTable
export const articlesRelations = relations(articlesTable, ({ one, many }) => ({
  allowedUsers: many(allowedAccessTable, {
    relationName: "allowed_access_article",
  }),
  blockedUsers: many(blockedAccessTable, {
    relationName: "blocked_access_article",
  }),
  comments: many(commentsTable, { relationName: "comments" }),
  author: one(usersTable, {
    fields: [articlesTable.authorId],
    references: [usersTable.id],
    relationName: "author",
  }),
}));

// Relations for allowedAccessTable
export const allowedAccessRelations = relations(
  allowedAccessTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [allowedAccessTable.articleId],
      references: [articlesTable.id],
      relationName: "allowed_access_article",
    }),
    user: one(usersTable, {
      fields: [allowedAccessTable.userId],
      references: [usersTable.id],
      relationName: "allowed_article_user",
    }),
  })
);

// Relations for blockedAccessTable
export const blockedAccessRelations = relations(
  blockedAccessTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [blockedAccessTable.articleId],
      references: [articlesTable.id],
      relationName: "blocked_access_article",
    }),
    user: one(usersTable, {
      fields: [blockedAccessTable.userId],
      references: [usersTable.id],
      relationName: "blocked_article_user",
    }),
  })
);

export const insertArticleSchema = createInsertSchema(articlesTable);
export const selectArticleSchema = createSelectSchema(articlesTable);

export type SelectArticle = InferSelectModel<typeof articlesTable>;
export type InsertArticle = InferInsertModel<typeof articlesTable>;
