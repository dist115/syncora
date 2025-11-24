import {
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
} from '@casl/ability';

import {
  PERMISSION_CONFIG,
  PermissionNameType,
  SuperUserPermissionNameType,
} from '@/config/permission';
import { ModuleNameType } from '@/config/permission/common';

export const getKeyList = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

export const getKeyObject = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key as keyof T] = key as keyof T;
      return acc;
    },
    {} as { [K in keyof T]: K }
  );
};

export interface PermissionObject {
  action: PermissionNameType | SuperUserPermissionNameType;
  subject: ModuleNameType;
  reason: string;
  condition?: string;
  fields?: string[];
}
export const getPermissionObject = (permissionKeys: PermissionNameType[]) => {
  const list: PermissionObject[] = [];
  permissionKeys.forEach((key) => {
    if (PERMISSION_CONFIG.hasOwnProperty(key)) {
      list.push({
        action: PERMISSION_CONFIG[key].name,
        subject: PERMISSION_CONFIG[key].module,
        condition: PERMISSION_CONFIG[key].condition,
        fields: PERMISSION_CONFIG[key].fields,
        reason: PERMISSION_CONFIG[key].description,
      });
    }
  });
  return list;
};
export type Abilities = [
  PermissionNameType | SuperUserPermissionNameType,
  ModuleNameType | ForcedSubject<ModuleNameType>,
];
export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);
