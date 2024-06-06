import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { usersTable } from './user';

export const authenticatorsTable = sqliteTable(
  'authenticator',
  {
    credentialID: text('credential_id').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: integer('credential_backed_up', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const insertAuthenticatorSchema =
  createInsertSchema(authenticatorsTable);
export const selectAuthenticatorSchema =
  createSelectSchema(authenticatorsTable);

export type SelectAuthenticator = InferSelectModel<typeof authenticatorsTable>;
export type InsertAuthenticator = InferInsertModel<typeof authenticatorsTable>;
