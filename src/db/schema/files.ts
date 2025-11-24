import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
<<<<<<< HEAD
  text,
=======
>>>>>>> cafdcd0276b654aa9be83d16971b317ccdea35bf
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { ComepleteComment, comments } from './comments';
import { Tags, tags } from './tags';
import { TagPivot, tagsPivot } from './tags-pivot';
import { team } from './teams';
import { users } from './users';

export type NewFile = typeof files.$inferInsert;
export type File = typeof files.$inferSelect;

export type Folder = typeof files.$inferSelect;

export type CompleteFile = typeof files.$inferSelect & {
  comments: ComepleteComment[];
  user?: typeof users.$inferSelect;
  team?: typeof team.$inferSelect;
  tags: TagPivot[];
};

export interface CompleteBreadcrumbs {
  id: string;
  name: string;
  type: string;
}

export const files = pgTable('files', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mime: varchar('mime', { length: 255 }),
  fileSize: integer('file_size').default(0),
  userId: varchar('user_id', { length: 255 }).notNull(),
  parentId: varchar('parent_id', { length: 255 }),
  type: varchar('type', { length: 255 }),
  extension: varchar('extension', { length: 255 }),
  teamId: varchar('team_id', { length: 255 }),
  trashed: boolean('trashed'),
  isPublic: boolean('is_public').default(false),
  isFavourite:boolean('is_favourite').default(false),
  hash: varchar('hash', { length: 255 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
<<<<<<< HEAD

  // Add these fields to your files table schema
  encryptedKey: text('encrypted_key'), // Base64 encoded wrapped file key
  encryptionIv: text('encryption_iv'), // Base64 encoded IV
  encryptionSalt: text('encryption_salt'), // Base64 encoded salt
  isEncrypted: boolean('is_encrypted').default(false), // Flag for encrypted files
  encryptionVersion: text('encryption_version').default('1.0') // Version tracking

=======
>>>>>>> cafdcd0276b654aa9be83d16971b317ccdea35bf
});

export const fileRelations = relations(files, ({ many, one }) => ({
  comments: many(comments),
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
    relationName: 'user',
  }),
  tags: many(tagsPivot),
}));
