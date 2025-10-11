import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { commentTypeEnum } from './enums';
import { files } from './files';
import { users } from './users';

export const comments = pgTable('comments', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  content: varchar('content', { length: 255 }).notNull(),
  commentableId: varchar('commentable_id', { length: 255 }).notNull(),
  commentType: commentTypeEnum('comment_type').notNull(),
  commenterId: varchar('commenter_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const commentRelations = relations(comments, ({ one }) => ({
  file: one(files, {
    fields: [comments.commentableId],
    references: [files.id],
  }),
  commenter: one(users, {
    fields: [comments.commenterId],
    references: [users.id],
  }),
}));

export type NewComment = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;

export type ComepleteComment = Comment & {
  commenter: typeof users.$inferSelect;
};
