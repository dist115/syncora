import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { teamMemberStatusEnum } from './enums';
import { TeamRole, teamRole } from './team-roles';
import { team, Team } from './teams';
import { User, users } from './users';

export const teamMember = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  teamId: varchar('team_id', { length: 255 }).references(() => team.id),
  inviterId: varchar('inviter_id', { length: 255 }),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  tokenExpires: timestamp('token_expires').notNull(),
  status: teamMemberStatusEnum('team_member_status'),
  roleId: integer('role_id').references(() => teamRole.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
    relationName: 'team',
  }),
  user: one(users, {
    fields: [teamMember.userId],
    references: [users.id],
    relationName: 'user',
  }),
  role: one(teamRole, {
    fields: [teamMember.roleId],
    references: [teamRole.id],
    relationName: 'role',
  }),
}));

export const CreateTeamMemberSchema = createInsertSchema(teamMember, {
  userId: z.string().cuid2(),
  teamId: z.string().cuid2(),
  inviterId: z.string().cuid2(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewTeamMember = typeof teamMember.$inferInsert;
export type TeamMember = typeof teamMember.$inferSelect;
export type CompleteTeamMember = typeof teamMember.$inferSelect & {
  team: Team;
  user: User;
  role: TeamRole;
};
