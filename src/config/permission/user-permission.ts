import { MODULE, PermissionType } from './common';

export const USER_PERMISSION: PermissionType = {
  name: 'USER_PERMISSION',
  module: MODULE.ALL,
  description: 'User Permissions',
};

export const OWNER_PERMISSION: PermissionType = {
  name: 'OWNER_PERMISSION',
  module: MODULE.ALL,
  description: 'Owner Permissions',
};

export const ALL_USER_PERMISSIONS = {
  USER_PERMISSION,
  OWNER_PERMISSION,
};
