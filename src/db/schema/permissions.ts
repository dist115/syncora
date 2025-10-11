import { boolean, json, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 255 }),
  subject: varchar('subject', { length: 255 }),
  fields: json('fields').$type<string[]>(),
  conditions: varchar('conditions', { length: 255 }),
  inverted: boolean('inverted').default(false),
  reason: varchar('reason', { length: 255 }),
});

export type NewPermission = typeof permissions.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
