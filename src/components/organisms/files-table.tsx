'use client';

import { useMemo, useState } from 'react';
import { CompleteFile, CompleteTeam } from '@/db/schema';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';
import { Button, Select, Text } from 'rizzui';

import { getOptionByValue } from '@/lib/utils/getOptionByValue';
import useQueryParams from '@/hooks/useQueryParam';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { Flex } from '@/components/atoms/layout';
import { SearchBox } from '@/components/atoms/search-box';
import { Table } from '@/components/atoms/table/table';
import TablePagination from '@/components/atoms/table/table-pagination';
import { Fallback } from '@/components/molecules/Fallback';

export const FilesTable = ({
  files,
  teams,
  totalFiles,
}: {
  files: CompleteFile[];
  totalFiles: number;
  teams: CompleteTeam[];
}) => {
  const { clearQueryParams, setQueryParams, queryParams } = useQueryParams();
  const teamDropdown = TotalTeam({ teams });
  const filterParams = ['search', 'type', 'team'];
  const toggleClearBtn = filterParams.some((key) => {
    return key in queryParams;
  });

  const page = queryParams.page ? Number(queryParams.page) : 1;
  const size = queryParams.size ? Number(queryParams.size) : 10;

  const columns = useMemo<ColumnDef<CompleteFile>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        size: 200,
        cell: ({ row }) => {
          const iconType = row.original.type as FileIconType | null;
          return (
            <Flex justify="start" className="gap-2.5 pl-2 py-1.5">
              <DynamicFileIcon
                className="w-6 h-auto shrink-0"
                iconType={iconType}
              />
              <Text className="capitalize max-w-[30ch] truncate text-custom-black dark:text-slate-300 font-medium ">
                {row.original.name}
              </Text>
            </Flex>
          );
        },
      },
      {
        header: 'User',
        accessorKey: 'user.name',
        size: 200,
        cell: ({ row }) => (
          <Text className="text-steel-700 dark:text-steel-100/90">
            {row.original.user?.name}
          </Text>
        ),
      },
      {
        header: 'Type',
        accessorKey: 'type',
        size: 200,
        enableSorting: false,
        cell: ({ row }) => (
          <Flex justify="start" className="gap-2">
            <Text className="text-steel-700 dark:text-steel-100/90">
              {row.original.type}
            </Text>
          </Flex>
        ),
      },
      {
        header: 'File Size',
        accessorKey: 'fileSize',
        size: 200,
        enableSorting: false,
        cell: ({ row }) => (
          <Flex justify="start" className="gap-2">
            <Text className="text-steel-700 dark:text-steel-100/90">
              {prettyBytes(row.original.fileSize || 0)}
            </Text>
          </Flex>
        ),
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        size: 200,
        enableSorting: false,
        cell: ({ row }) => (
          <Text className="text-steel-700 dark:text-steel-100/90">
            {format(row.original.createdAt, 'MMM dd, yyyy')}
          </Text>
        ),
      },
    ],
    []
  );

  // This state is for controlling the column visibility. default key is the keys of actual data (accessorKey)
  // Please save this object in DB and use it as columns initial state.
  // We also need to fire server action for column save btn (ui not implemented yet) on column control to save the columns
  // we will pass down the onClick method to the table as props so that on click the btn this object will save on the server
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
    data: files,
    columns,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: false,
    pageCount: Math.ceil(totalFiles / size) ?? -1,
    manualPagination: true,
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
    <Flex direction="col" align="stretch" className="w-full gap-0">
      <Flex justify="start" className="gap-5 mb-10 grid grid-cols-2 lg:flex">
        <SearchBox
          className="col-span-full lg:w-96"
          name="search"
          onClear={() => {
            setQueryParams({ search: '' });
          }}
          placeholder="Search files"
          inputClassName="h-10"
          onSubmit={(search) => {
            setQueryParams({ search: search, page: 1 });
          }}
          defaultValue={queryParams?.search}
          queryParams={queryParams}
        />

        <Select
          placeholder="Filter By Type"
          className="lg:w-52 xl:w-44"
          optionClassName="capitalize"
          options={fileType}
          onChange={(value: string) => {
            setQueryParams({ type: value, page: 1 });
          }}
          getOptionValue={(option) => option?.value?.toLowerCase() as any}
          value={queryParams?.type ?? ''}
          displayValue={(value) =>
            getOptionByValue(fileType, value as any)?.label
          }
        />

        <Select
          placeholder="Filter By Team"
          className="lg:w-52 xl:w-44"
          optionClassName="capitalize"
          options={teamDropdown}
          onChange={(value: string) => {
            setQueryParams({ team: value, page: 1 });
          }}
          getOptionValue={(option) => option?.value?.toLowerCase() as any}
          value={queryParams?.team ?? ''}
          displayValue={(value) =>
            getOptionByValue(teamDropdown, value as any)?.label
          }
        />

        {toggleClearBtn && (
          <Button
            className="!h-10 col-span-2 min-w-[124px] !font-normal text-steel-500 dark:text-steel-400 hover:bg-steel-50 dark:hover:text-steel-100 dark:hover:bg-steel-600"
            onClick={() => {
              clearQueryParams();
            }}
            variant="text"
          >
            Clear Filters
          </Button>
        )}
      </Flex>

      {totalFiles > 0 ? (
        <>
          <Table table={table} total={totalFiles} />
          <Flex justify="end" className="mt-6">
            <TablePagination
              pageSize={size}
              setPageSize={onRowsPerPageChange as any}
              total={totalFiles}
              current={page}
              onChange={onPaginationChange}
            />
          </Flex>
        </>
      ) : (
        <Flex justify="center" className="mt-10 mb-16">
          <Fallback
            illustration={NoFilesIllustration}
            illustrationClassName="min-w-[280px] max-w-[700px] h-auto"
            title="No files found."
          />
        </Flex>
      )}
    </Flex>
  );
};

const fileType = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Folders',
    value: 'folder',
  },
  {
    label: 'Image',
    value: 'image',
  },
  {
    label: 'Video',
    value: 'video',
  },
  {
    label: 'Audio',
    value: 'audio',
  },
  {
    label: 'Doc',
    value: 'doc',
  },
  {
    label: 'Docx',
    value: 'docx',
  },
  {
    label: 'Xlsx',
    value: 'xlsx',
  },
  {
    label: 'Pdf',
    value: 'pdf',
  },
  {
    label: 'Text',
    value: 'txt',
  },
  {
    label: 'Zip',
    value: 'zip',
  },
];

const TotalTeam = ({ teams }: { teams: CompleteTeam[] }) => {
  return [
    {
      label: 'all',
      value: '',
    },
    ...teams.map((item: CompleteTeam) => ({
      label: item.name,
      value: item.id,
    })),
  ];
};
