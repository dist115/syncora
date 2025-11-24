import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './users';

export const verificationTokens = pgTable('verificationToken', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id').notNull(),
  email: varchar('token').unique().notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
});

export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }:any) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
      relationName: 'user',
    }),
  })
);
