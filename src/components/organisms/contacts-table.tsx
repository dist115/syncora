'use client';

import React, { useState } from 'react';
import { Contact } from '@/db/schema';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Text } from 'rizzui';

import useQueryParams from '@/hooks/useQueryParam';
import { Flex } from '@/components/atoms/layout';

import { NoContactIllustration } from '../atoms/illustrations/fallbacks/no-contact-illustration';
import { Table } from '../atoms/table/table';
import TablePagination from '../atoms/table/table-pagination';
import { Fallback } from '../molecules/Fallback';

export const ContactsTable = ({
  contacts,
  totalContacts,
}: {
  contacts: Contact;
  totalContacts: any;
}) => {
  const { clearQueryParams, setQueryParams, queryParams } = useQueryParams();
  const [isLoading, setIsLoading] = useState(false);

  const page = queryParams.page ? Number(queryParams.page) : 1;
  const size = queryParams.size ? Number(queryParams.size) : 10;

  const columns = React.useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        size: 100,
      },
      {
        header: 'Email',
        accessorKey: 'email',
        size: 100,
      },
      {
        header: 'Messages',
        accessorKey: 'message',
        size: 600,
        cell: ({ row }: any) => (
          <Text className="whitespace-normal">{row.original.message}</Text>
        ),
      },
      {
        header: 'Subject',
        accessorKey: 'subject',
        size: 100,
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        minSize: 100,
        cell: ({ row }) => {
          return (
            <Text className="text-steel-700 dark:text-steel-100/90">
              {row.original.createdAt
                ? format(row.original.createdAt, 'MMM dd, yyyy')
                : ''}
            </Text>
          );
        },
      },
    ],
    []
  );

  const [columnVisibility, setColumnVisibility] = useState<{
    [key: string]: boolean;
  }>({
    createdAt: true,
    id: true,
    role: true,
    status: true,
    user_email: true,
    user_name: true,
  });

  const table = useReactTable({
    data: contacts as any,
    columns,
    defaultColumn: {
      minSize: 200,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    enableSorting: false,
    pageCount: Math.ceil(totalContacts / size) ?? -1,
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const onPaginationChange = (page: number) => {
    setQueryParams({ page });
  };

  const onRowsPerPageChange = (rows: number) => {
    setQueryParams({ size: rows, page: 1 });
  };
  return (
    <>
      {totalContacts > 0 ? (
        <>
          <Table table={table} />
          <Flex justify="end" className="mt-6">
            <TablePagination
              pageSize={size}
              setPageSize={onRowsPerPageChange as any}
              total={totalContacts}
              current={page}
              onChange={onPaginationChange}
            />
          </Flex>
        </>
      ) : (
        <Flex justify="center" className="mt-20">
          <Fallback
            illustration={NoContactIllustration}
            illustrationClassName="min-w-[280px] max-w-[700px] h-auto"
            title="No message from contact us form is available"
          />
        </Flex>
      )}
    </>
  );
};
