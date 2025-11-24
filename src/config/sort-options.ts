import { FileSortType, SortOrderType } from './sorting';

type FileSortOptions = {
  label: string;
  value: FileSortType;
};

export const FILE_SORT_OPTIONS: FileSortOptions[] = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Size',
    value: 'size',
  },
  {
    label: 'Modified',
    value: 'updatedAt',
  },
];

type OrderOptions = {
  label: string;
  value: SortOrderType;
};

export const ORDER_OPTIONS: OrderOptions[] = [
  {
    label: 'Ascending',
    value: 'asc',
  },
  {
    label: 'Descending',
    value: 'desc',
  },
];
