import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { subscriptionStatusEnum } from './enums';
import { team } from './teams';
import { users } from './users';

export const subscription = pgTable('subscriptions', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  subscriptionId: varchar('subscription_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }),
  planId: varchar('plan_id', { length: 255 }),
  teamId: varchar('team_id', { length: 255 }),
  storage:varchar('storage', { length: 20 }),
  maxTeam:integer('max_team').default(2),
  provider: varchar('provider', { length: 255 }),
  status: subscriptionStatusEnum('subscription_status'),
  quantity: integer('quantity').default(1),
  trialStartsAt: timestamp('trial_starts_at', { mode: 'date' }),
  trialEndsAt: timestamp('trial_ends_at', { mode: 'date' }),
  currentPeriodStartsAt: timestamp('current_period_starts_at', {
    mode: 'date',
  }),
  currentPeriodEndsAt: timestamp('current_period_ends_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  deletedAt: timestamp('deleted_at'),
});

export const subscriptionRelations = relations(
  subscription,
  ({ one, many }) => ({
    user: one(users, {
      fields: [subscription.userId],
      references: [users.id],
    }),
    team: one(team, {
      fields: [subscription.teamId],
      references: [team.id],
    }),
  })
);

export type NewSubscription = typeof subscription.$inferInsert;
export type Subscription = typeof subscription.$inferSelect;
