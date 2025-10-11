'use client';

import { SetStateAction, useMemo, useState, useTransition } from 'react';
import { type CompleteTeam } from '@/db/schema';
import { deleteTeam, exportAllTeams } from '@/server/actions/team.action';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { RiDownloadLine } from 'react-icons/ri';
import { Avatar, Button, Modal, Popover, Text, Title } from 'rizzui';
import { writeFileXLSX } from 'xlsx';

import { handleError } from '@/lib/utils/error';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useQueryParams from '@/hooks/useQueryParam';
import { Checkbox } from '@/components/atoms/forms';
import { Box, Flex, Grid } from '@/components/atoms/layout';
import { SearchBox } from '@/components/atoms/search-box';
import { Table } from '@/components/atoms/table/table';
import TablePagination from '@/components/atoms/table/table-pagination';
import { NoTeamFallback } from '@/components/organisms/no-team-fallback';
import { TeamDeleteButton } from '@/components/organisms/team-delete-button';

export const AllTeamsTable = ({
  teams,
  totalTeams,
}: {
  teams: any[];
  totalTeams: any;
}) => {
  const { setQueryParams, queryParams } = useQueryParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const page = queryParams.page ? Number(queryParams.page) : 1;
  const size = queryParams.size ? Number(queryParams.size) : 10;

  const columns = useMemo<ColumnDef<CompleteTeam>[]>(
    () => [
      {
        id: 'select',
        size: 45,
        enableHiding: false,
        header: () => (
          <Checkbox
            checked={selectedRows.length === teams.length}
            indeterminate={
              selectedRows.length > 0 && selectedRows.length < teams.length
            }
            onChange={() => {
              if (selectedRows.length === teams.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(teams.map((row) => row.id.toString()));
              }
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.id.toString())}
            disabled={!row.getCanSelect()}
            onChange={() => {
              const id = row.original.id.toString();
              selectedRows.includes(id)
                ? setSelectedRows(selectedRows.filter((row) => row !== id))
                : setSelectedRows([...selectedRows, id]);
            }}
          />
        ),
      },
      {
        header: 'Name',
        accessorKey: 'name',
        size: 180,
        cell: ({ row }) => {
          const name = row.original.name;
          const image = row.original.avatar ? row.original.avatar : null;

          return (
            <Flex justify="start" className="gap-2.5">
              <Avatar name={name} src={image as string} size="sm" />
              <Text className="capitalize truncate text-steel-700 dark:text-steel-100/90">
                {name}
              </Text>
            </Flex>
          );
        },
      },
      {
        header: 'slug',
        accessorKey: 'slug',
        size: 180,
        cell: ({ row }) => {
          const slug = row.original.slug;
          return (
            <Text className="truncate text-steel-700 dark:text-steel-100/90">
              {slug}
            </Text>
          );
        },
      },
      {
        header: 'domain',
        accessorKey: 'domain',
        size: 120,
        cell: ({ row }) => {
          const domain = row.original.domain ?? '-';
          return (
            <Text className="text-steel-700 truncate dark:text-steel-100/90">
              {domain}
            </Text>
          );
        },
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        size: 130,
        cell: ({ row }) => {
          return (
            <Text className="text-steel-700 dark:text-steel-100/90">
              {format(row.original.createdAt, 'MMM dd, yyyy')}
            </Text>
          );
        },
      },
      {
        header: '',
        enableHiding: false,
        meta: {
          columnName: 'Operations',
        },
        size: 80,
        accessorKey: 'id',
        cell: ({ row }) => {
          const { id: id } = row.original;
          return (
            <>
              <Flex justify="end" className="gap-1">
                <DeleteUserButton id={id} />
              </Flex>
            </>
          );
        },
      },
    ],
    [selectedRows, teams]
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
    data: teams,
    columns,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: false,
    pageCount: Math.ceil(totalTeams / size) ?? -1,
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

  const handleExport = async () => {
    setIsLoading(true);
    const workbook = await exportAllTeams(queryParams);
    let d = new Date().toJSON();
    let filename = 'All-Teams-' + d + '.xlsx';
    writeFileXLSX(workbook, filename, { compression: true });
    setIsLoading(false);
  };

  return (
    <Flex direction="col" align="stretch" className="w-full gap-0 mt-0">
      <Flex className="gap-3 mb-10 flex-wrap">
        <SearchBox
          className="order-3 sm:w-auto sm:order-[0]"
          name="text"
          onClear={() => {
            setQueryParams({ text: '' });
          }}
          placeholder="Search team by name"
          inputClassName="h-10"
          onSubmit={(text) => {
            setQueryParams({ text: text, page: 1 });
          }}
          defaultValue={queryParams?.text}
          queryParams={queryParams}
        />

        <Grid columns="2" className="w-full sm:w-auto gap-3 lg:gap-5">
          <Button
            className="w-full"
            onClick={handleExport}
            isLoading={isLoading}
            variant="outline"
          >
            <RiDownloadLine className="duration-200 mr-1.5 w-4 h-4" />
            Export
          </Button>

          <TeamDeleteButton teams={selectedRows} className="w-full" />
        </Grid>
      </Flex>

      {totalTeams > 0 ? (
        <>
          <Table table={table} total={totalTeams} />
          <Flex justify="end" className="mt-6">
            <TablePagination
              pageSize={size}
              setPageSize={onRowsPerPageChange as any}
              total={totalTeams}
              current={page}
              onChange={onPaginationChange}
            />
          </Flex>
        </>
      ) : (
        <Flex justify="center" direction="col" className="mt-20">
          <NoTeamFallback
            fallbackText="No team found"
            hideButton={queryParams?.text && totalTeams == 0 ? false : true}
          />
        </Flex>
      )}
    </Flex>
  );
};

function DeleteUserButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExtraSmall = useMediaQuery('(max-width:424px )');

  function handleDelete(setOpen: (value: SetStateAction<boolean>) => void) {
    startTransition(async () => {
      try {
        await deleteTeam(id);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    });
  }

  if (isExtraSmall) {
    return (
      <>
        <Button
          aria-label="Delete Team Button"
          color="danger"
          variant="flat"
          onClick={() => setIsModalOpen(true)}
        >
          <TrashIcon className="w-4" />
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          containerClassName="bg-white dark:bg-steel-800"
        >
          <Box className="p-4">
            <Title className="mb-2 text-lg font-semibold">Delete User?</Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this user?
            </Text>
            <Flex className="gap-3 mt-6" justify="end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={() => handleDelete(setIsModalOpen)}
                variant="flat"
                color="danger"
              >
                Delete
              </Button>
            </Flex>
          </Box>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Button
          aria-label="Delete Team Button"
          color="danger"
          variant="flat"
          className="w-8 h-8 p-1 text-red-600 bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/70"
        >
          <TrashIcon className="w-4" />
        </Button>
      </Popover.Trigger>

      <Popover.Content>
        {({ setOpen }) => (
          <>
            <Title className="mb-2 text-lg font-semibold">Delete User?</Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this user?
            </Text>
            <Flex className="gap-3 mt-6" justify="end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={() => handleDelete(setOpen)}
                variant="flat"
                color="danger"
              >
                Delete
              </Button>
            </Flex>
          </>
        )}
      </Popover.Content>
    </Popover>
  );
}
