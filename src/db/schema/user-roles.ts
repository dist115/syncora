import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

import { roles } from './roles';
import { users } from './users';

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id')
    .references(() => roles.id)
    .notNull(),
  userId: varchar('user_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
});

export const userRolesRelations = relations(userRoles, ({ one, many }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),

  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
export type CompleteUserRole = typeof userRoles.$inferSelect & {
  user: typeof users.$inferSelect;
  role: typeof roles.$inferSelect;
};
