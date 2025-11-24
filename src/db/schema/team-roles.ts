import {
  boolean,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const teamRole = pgTable('team_roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  teamId: varchar('team_id', { length: 255 }),
  description: varchar('description', { length: 255 }),
  permissions: json('permissions').notNull(),
  generated: boolean('generated').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type TeamRoleInsert = typeof teamRole.$inferInsert;
export type TeamRole = typeof teamRole.$inferSelect;
