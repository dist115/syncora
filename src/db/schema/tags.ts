import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

import { tagOwnerTypeEnum } from './enums';
import { team as TeamsTable } from './teams';
import { users as UsersTable } from './users';

export const tags = pgTable(
  'tags',
  {
    id: varchar('id', { length: 255 })
      .$defaultFn(() => createId())
      .primaryKey(),
    label: varchar('label', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    ownerId: varchar('owner_id', { length: 255 }).notNull().default(''),
    ownerType: tagOwnerTypeEnum('owner_type').notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.slug, t.ownerId, t.ownerType),
  })
);

export const tagsRelations = relations(tags, ({ one }) => ({
  team: one(TeamsTable, {
    fields: [tags.ownerId],
    references: [TeamsTable.id],
  }),
  user: one(UsersTable, {
    fields: [tags.ownerId],
    references: [UsersTable.id],
  }),
}));

export type Tags = typeof tags.$inferSelect;
export type CompleteTag = Tags & {
  team: typeof TeamsTable.$inferSelect;
  user: typeof UsersTable.$inferSelect;
};
