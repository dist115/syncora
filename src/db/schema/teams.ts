import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { teamMember, TeamMember } from './teamMembers';
import {User, users } from './users';

export const team = pgTable('teams', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  avatar: varchar('avatar', { length: 255 }),
  domain: varchar('domain', { length: 255 }),
  createdBy: varchar('created_by', { length: 255 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const teamRelations = relations(team, ({ many, one }) => ({
  members: many(teamMember),
  users: many(users),
  owner: one(users, {
    fields: [team.createdBy],
    references: [users.id],
    relationName: 'owner',
  }),
}));

export type Team = typeof team.$inferSelect;
export type CompleteTeam = typeof team.$inferSelect & {
  members: TeamMember[];
  users: User[];
  owner: User;
};
