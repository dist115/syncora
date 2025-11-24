import { db } from '@/db';
import { NewPermission, permissions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const PermissionService = {
  find: async (id: number) => {
    return db.query.permissions.findFirst({
      where: (permissions, { eq }) => eq(permissions.id, id),
    });
  },

  findAll: async () => {
    return db.query.permissions.findMany();
  },

  create: async (data: NewPermission) => {
    const [inserted] = await db.insert(permissions).values(data).returning();

    return inserted;
  },

  delete: async (id: number) => {
    const [deleted] = await db
      .delete(permissions)
      .where(eq(permissions.id, id))
      .returning();

    return deleted;
  },

  update: async (id: number, data: Partial<NewPermission>) => {
    const [updated] = await db
      .update(permissions)
      .set(data)
      .where(eq(permissions.id, id))
      .returning();

    return updated;
  },
};
