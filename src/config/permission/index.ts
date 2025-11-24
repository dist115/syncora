import { ValueOf } from 'type-fest';
import { getKeyList, getKeyObject } from '@/lib/utils/object-key';
import { FILE_PERMISSIONS } from './file-permission';
import { TEAM_PERMISSIONS } from './team-permission';
import { ALL_USER_PERMISSIONS } from './user-permission';

export const PERMISSION_CONFIG = {
  ...FILE_PERMISSIONS,
  ...TEAM_PERMISSIONS,
};

// Team User Permissions
export const PERMISSIONS = getKeyObject(PERMISSION_CONFIG);
export const PERMISSION_NAMES = getKeyList(PERMISSION_CONFIG);

// Super User Permissions
export const SUPER_USER_PERMISSION_NAMES = getKeyList(ALL_USER_PERMISSIONS);
export const SUPER_USER_PERMISSIONS = getKeyObject(ALL_USER_PERMISSIONS);

export type PermissionNameType = ValueOf<typeof PERMISSIONS>;
export type SuperUserPermissionNameType = ValueOf<
  typeof SUPER_USER_PERMISSIONS
>;