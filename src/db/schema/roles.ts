import { json, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  permissions: json('permissions').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export type RoleInsert = typeof roles.$inferInsert;
export type Role = typeof roles.$inferSelect;
