import { MODULE, type PermissionType } from './common';

const VIEW_TEAM_SETTINGS: PermissionType = {
  name: 'VIEW_TEAM_SETTINGS',
  module: MODULE.TEAM,
  description: 'view team settings',
};

const EDIT_TEAM_SETTINGS: PermissionType = {
  name: 'EDIT_TEAM_SETTINGS',
  module: MODULE.TEAM,
  description: 'edit team settings',
};

const VIEW_TEAM_MEMBERS: PermissionType = {
  name: 'VIEW_TEAM_MEMBERS',
  module: MODULE.TEAM,
  description: 'view team members',
};

const EDIT_TEAM_MEMBERS: PermissionType = {
  name: 'EDIT_TEAM_MEMBERS',
  module: MODULE.TEAM,
  description: 'edit team members',
};

const DELETE_TEAM_MEMBERS: PermissionType = {
  name: 'DELETE_TEAM_MEMBERS',
  module: MODULE.TEAM,
  description: 'delete team members',
};

const EXPORT_TEAM_MEMBERS: PermissionType = {
  name: 'EXPORT_TEAM_MEMBERS',
  module: MODULE.TEAM,
  description: 'export team members',
};

const INVITE_TEAM_MEMBERS: PermissionType = {
  name: 'INVITE_TEAM_MEMBERS',
  module: MODULE.TEAM,
  description: 'invite team members',
};

const VIEW_TEAM_ROLES: PermissionType = {
  name: 'VIEW_TEAM_ROLES',
  module: MODULE.TEAM,
  description: 'view team roles',
};

const EDIT_TEAM_ROLES: PermissionType = {
  name: 'EDIT_TEAM_ROLES',
  module: MODULE.TEAM,
  description: 'edit team roles',
};

const MANAGE_TEAM_BILLING: PermissionType = {
  name: 'MANAGE_TEAM_BILLING',
  module: MODULE.TEAM,
  description: 'manage team billing',
};

const VIEW_TEAM_BILLING: PermissionType = {
  name: 'VIEW_TEAM_BILLING',
  module: MODULE.TEAM,
  description: 'view team billing',
};

export const TEAM_PERMISSIONS = {
  VIEW_TEAM_SETTINGS,
  EDIT_TEAM_SETTINGS,
  VIEW_TEAM_MEMBERS,
  EDIT_TEAM_MEMBERS,
  DELETE_TEAM_MEMBERS,
  EXPORT_TEAM_MEMBERS,
  INVITE_TEAM_MEMBERS,
  VIEW_TEAM_ROLES,
  EDIT_TEAM_ROLES,
  MANAGE_TEAM_BILLING,
  VIEW_TEAM_BILLING,
};
