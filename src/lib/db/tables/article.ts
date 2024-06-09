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
import { generateIdFromEntropySize } from "lucia";
import {
  CATEGORIES_MAP,
  PRIVACY,
  type Category,
  type Tag,
} from "../../constants";
import { usersTable } from "./user";

const categories = CATEGORIES_MAP.map(({ value }) => value) as [
  Category,
  ...Category[]
];

export const articlesTable = sqliteTable(
  "article",
  {
    id: text("id").primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    title: text("title").notNull(),
    parsedTitle: text("parsed_title").notNull(),
    category: text("category", { enum: categories }).notNull().default("other"),
    tags: text("tags", { mode: "json" }).$type<Tag[]>().notNull().default([]),

    authorId: text("author_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // "private" | "public" | "restricted"
    privacy: text("privacy", { enum: PRIVACY }).notNull().default("private"),

    // users with allowed access (overrides privacy settings)

    //   allowedAccessId: text("allowed_access_id").references(() => usersTable.id, {
    //     onDelete: "cascade",
    //   }),

    // users with blocked access (overrides privacy settings)
    //   blockedAccessId: text("blocked_access_id").references(() => usersTable.id, {
    //     onDelete: "cascade",
    //   }),

    // parsed content optimized for search
    searchContentPL: text("search_content_pl").notNull().default(""),
    searchContentEN: text("search_content_en").notNull().default(""),
  },
  (table) => {
    return {
      parsedTitlex: uniqueIndex("parsed_titlex").on(table.parsedTitle),
      searchContentPLx: index("search_content_plx").on(table.searchContentPL),
      searchContentENx: index("search_content_enx").on(table.searchContentEN),
    };
  }
);

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
  author: one(usersTable, {
    fields: [articlesTable.authorId],
    references: [usersTable.id],
    relationName: "author",
  }),
  allowedUsers: many(allowedAccessTable, {
    relationName: "allowed_access_article",
  }),
  blockedUsers: many(blockedAccessTable, {
    relationName: "blocked_access_article",
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
