import { Select } from 'rizzui';

import { cn } from '@/lib/utils/cn';

import Pagination, { type PaginationProps } from './pagination';

const paginationLimitOptions = [1, 5, 10, 15, 20, 25].map((v) => ({
  label: String(v),
  value: v,
}));

export type TablePaginationProps = {
  pageSize: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  paginatorClassName?: string;
} & PaginationProps;

export default function TablePagination({
  pageSize,
  setPageSize,
  total,
  paginatorClassName,
  ...props
}: TablePaginationProps) {
  return (
    <div
      className={cn(
        'table-pagination flex items-center justify-center sm:justify-between w-full',
        paginatorClassName
      )}
    >
      <div className="hidden items-center sm:flex gap-3">
        <span className="text-sm text-steel-700 dark:text-steel-100">
          Rows per page:
        </span>
        <Select
          options={paginationLimitOptions as any}
          onChange={setPageSize}
          size="sm"
          variant="flat"
          value={pageSize}
          getOptionValue={({ value }) => value}
          dropdownClassName="!p-1.5 border w-12 border-gray-100 dark:border-gray-700 !z-10 shadow-lg"
          className="ms-1 w-auto [&_button]:font-medium"
          optionClassName="px-1"
        />
      </div>
      {total! > pageSize && (
        <Pagination
          total={total}
          pageSize={pageSize}
          defaultCurrent={1}
          showLessItems={true}
          prevIconClassName="py-0 text-gray-500 !leading-[26px]"
          nextIconClassName="py-0 text-gray-500 !leading-[26px]"
          {...props}
        />
      )}
    </div>
  );
}
