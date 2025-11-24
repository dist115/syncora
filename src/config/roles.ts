import {
  PERMISSION_NAMES,
  PERMISSIONS,
  SUPER_USER_PERMISSIONS,
} from './permission';

/**
 * Default Roles for seeding
 */
export const TEAM_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export const USER_ROLES = {
  OWNER: 'OWNER',
  USER: 'USER',
} as const;

/**
 * Default Role Permissions for seeding
 */
const { USER_PERMISSION, OWNER_PERMISSION } = SUPER_USER_PERMISSIONS;
export const USER_ROLES_PERMISSIONS = [
  {
    name: USER_ROLES.OWNER,
    description: 'Owner',
    permissions: [OWNER_PERMISSION],
  },
  {
    name: USER_ROLES.USER,
    description: 'User',
    permissions: [USER_PERMISSION],
  },
];

const { VIEW_TEAM_MEMBERS, VIEW_FILES, UPLOAD_FILES } = PERMISSIONS;
export const TEAM_ROLES_PERMISSIONS = [
  {
    name: TEAM_ROLES.ADMIN,
    description: 'Admin',
    permissions: [...PERMISSION_NAMES],
  },
  {
    name: TEAM_ROLES.MEMBER,
    description: 'Member',
    permissions: [VIEW_TEAM_MEMBERS, VIEW_FILES, UPLOAD_FILES],
  },
];
