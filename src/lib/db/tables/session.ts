import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { usersTable } from './user';

export const sessionsTable = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable);
export const selectSessionSchema = createSelectSchema(sessionsTable);

export type SelectSession = InferSelectModel<typeof sessionsTable>;
export type InsertSession = InferInsertModel<typeof sessionsTable>;
