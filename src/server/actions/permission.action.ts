'use server';

import { PermissionService } from '@/server/service/permission.service';
import { createMongoAbility } from '@casl/ability';
import { getCurrentTeam } from './team.action';

export const getAllPermissions = async () => {
  return PermissionService.findAll();
};
export const getUserPermission = async () => {
  const team = await getCurrentTeam();
  const permissions = team?.permissions || [];

  return permissions;
};

export const getUserAbility = async (permissions: any) => {
  return createMongoAbility(permissions);
};
