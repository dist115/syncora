import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PERMISSION_CONFIG, PERMISSION_NAMES } from '@/config/permission';
import { USER_ROLES_PERMISSIONS } from '@/config/roles';

import { permissions, roles } from '../schema';

export const permissionSeeder = async (
  db: NodePgDatabase<Record<string, never>>
) => {
  let seedPermissions = PERMISSION_NAMES.map((permission) => ({
    action: PERMISSION_CONFIG[permission].name,
    subject: PERMISSION_CONFIG[permission].module,
    description: PERMISSION_CONFIG[permission].description,
  }));

  await db.delete(permissions);
  await db.insert(permissions).values(seedPermissions).returning();

  const dbRoles = await db.select().from(roles);

  if (dbRoles.length === 0) {
    console.log('🚀 Inserting user roles\n');
    let seedRoles = USER_ROLES_PERMISSIONS.map((role) => ({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    }));

    await db.insert(roles).values(seedRoles);
  }
};
