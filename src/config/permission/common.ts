import { ValueOf } from 'type-fest';
import { PermissionNameType, SuperUserPermissionNameType } from '.';

export const MODULE = {
  ALL: 'ALL',
  TEAM: 'TEAM',
  FILE: 'FILE',
  SETTINGS: 'SETTINGS',
} as const;

export type ModuleNameType = ValueOf<typeof MODULE>;

export const MODULE_LIST = Object.values(MODULE);

export type ModuleType = ValueOf<typeof MODULE>;

export type PermissionType = {
  name: PermissionNameType | SuperUserPermissionNameType;
  module: ModuleNameType;
  description: string;
  condition?: string;
  fields?: string[];
};
