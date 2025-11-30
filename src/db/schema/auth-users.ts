import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const authUsers = pgTable('auth_user', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationTokenExpiresAt: timestamp('verification_token_expires_at'),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordTokenExpiresAt: timestamp('reset_password_token_expires_at'),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  mfaSecret: varchar('mfa_secret', { length: 255 }),
  mfaBackupCodes: varchar('mfa_backup_codes', { length: 1000 }), // JSON array
  userId: varchar('user_id', { length: 255 }).unique(), // Link to main users table

   // NEW: Encryption fields
  encryptionType: varchar('encryption_type', { length: 50 }).default('AES-256-GCM'),
  encryptionKey: varchar('encryption_key', { length: 500 }), // Encrypted user key

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const authUsersRelations = relations(authUsers, ({ one }) => ({
  user: one(users, {
    fields: [authUsers.userId],
    references: [users.id],
    relationName: 'authUser',
  }),
}));

export type AuthUser = typeof authUsers.$inferSelect;
export type NewAuthUser = typeof authUsers.$inferInsert;