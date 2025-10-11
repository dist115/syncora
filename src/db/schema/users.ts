import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { Account, accounts } from './accounts';
import { userStatusEnum } from './enums';
import { files } from './files';
import { Session, sessions } from './sessions';
import { Subscription, subscription } from './subscriptions';
import { TeamMember, teamMember } from './teamMembers';
import { Team, team } from './teams';
import { UserRole, userRoles } from './user-roles';


export const users = pgTable('user', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique().notNull(),
  googleId: varchar('google_id', { length: 255 }).unique(),
  emailVerified: boolean('email_verified').default(false),
  image: varchar('image', { length: 255 }),
  currentTeamId: varchar('current_team_id', { length: 255 }),
  customerId: varchar('customer_id', { length: 255 }).unique(),
  status: userStatusEnum('user_status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  currentTeam: one(team, {
    fields: [users.currentTeamId],
    references: [team.id],
    relationName: 'currentTeam',
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  subscriptions: many(subscription),
  teamMembers: many(teamMember),
  files: many(files),
  roles: many(userRoles),
}));

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type CompleteUser = typeof users.$inferSelect & {
  currentTeam?: Team | null;
  accounts: Account[];
  sessions: Session[];
  subscriptions: Subscription[];
  teamMembers: TeamMember[];
  roles: string[] | UserRole[] | undefined;
};
