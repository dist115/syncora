import { ValueOf } from 'type-fest';

export const TagOwnerType = {
  user: 'user',
  team: 'team',
} as const;

export type TagOwnerType = ValueOf<typeof TagOwnerType>;
