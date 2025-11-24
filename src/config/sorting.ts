import { ValueOf } from 'type-fest';

export const FileSort = {
  name: 'name',
  size: 'size',
  modified: 'updatedAt',
} as const;

export type FileSortType = ValueOf<typeof FileSort>;

export const SortOrder = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortOrderType = ValueOf<typeof SortOrder>;
