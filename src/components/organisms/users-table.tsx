'use client';

import { useMemo, useState, useTransition } from 'react';
import { CompleteUser, UserStatus } from '@/db/schema';
import { deleteUser, exportUsers } from '@/server/actions/user.action';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { PiPencilThin } from 'react-icons/pi';
import { RiDownloadLine } from 'react-icons/ri';
import { Avatar, Button, Modal, Popover, Select, Text, Title } from 'rizzui';
import { toast } from 'sonner';
import { writeFileXLSX } from 'xlsx';

import { MESSAGES } from '@/config/messages';
import { USER_ROLES } from '@/config/roles';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { getOptionByValue } from '@/lib/utils/getOptionByValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useQueryParams from '@/hooks/useQueryParam';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { Box, Flex } from '@/components/atoms/layout';

import { Badge } from '../atoms/badge';
import { SearchBox } from '../atoms/search-box';
import { Table } from '../atoms/table/table';
import TablePagination from '../atoms/table/table-pagination';
import { Fallback } from '../molecules/Fallback';
import { UpdateUser } from './forms/update-user';

export const UsersTable = ({
  users,
  userId,
  totalUsers,
}: {
  users: CompleteUser[];
  userId: string;
  totalUsers: number;
}) => {
  const { openDrawer } = useDrawer();
  const { clearQueryParams, setQueryParams, queryParams } = useQueryParams();
  const [isLoading, setIsLoading] = useState(false);
  const filterParams = ['text', 'status', 'role'];
  const toggleClearBtn = filterParams.some((key) => {
    return key in queryParams;
  });

  const page = queryParams.page ? Number(queryParams.page) : 1;
  const size = queryParams.size ? Number(queryParams.size) : 10;

  const columns = useMemo<ColumnDef<FIX_ME>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'user.name',
        size: 200,
        cell: ({ row }) => {
          const name = row.original.user
            ? row.original.user.name
            : row.original.name;

          const image = row.original.user ? row.original.user.image : null;

          return (
            <Flex justify="start" className="gap-2.5">
              <Avatar name={name} src={image} size="sm" />
              <Text className="capitalize text-steel-700 dark:text-steel-100/90">
                {name}
              </Text>
            </Flex>
          );
        },
      },
      {
        header: 'Email',
        accessorKey: 'user.email',
        size: 200,
        cell: ({ row }) => {
          const email = row.original.user
            ? row.original.user.email
            : row.original.email;

          return (
            <Text className="text-steel-700 dark:text-steel-100/90">
              {email}
            </Text>
          );
        },
      },
      {
        header: 'Role',
        accessorKey: 'role',
        size: 100,
        cell: ({ row }) => {
          const userRoles = row.original.roles;

          return (
            <Text className="text-steel-700 dark:text-steel-100/90">
              {userRoles.map((roles: any) => roles.role.name).join(', ')}
            </Text>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        size: 100,
        enableSorting: false,
        cell: ({ row }) => {
          function statusColor(status: string) {
            if (status === UserStatus.Inactive) return 'danger';
            return 'success';
          }

          return (
            <Flex justify="start" className="gap-2">
              <Badge color={statusColor(row.original.status)} renderAsDot />
              <Text className="text-steel-700 dark:text-steel-100/90">
                {row.original.status}
              </Text>
            </Flex>
          );
        },
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        size: 120,
        enableSorting: false,
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
        meta: {
          columnName: 'Operations',
        },
        enableHiding: false,
        accessorKey: 'id',
        size: 100,
        cell: ({ row }: { row: any }) => {
          const { id: id, role, status } = row.original;
          return (
            <Flex justify="end" className="gap-1">
              <Button
                aria-label="Edit User Button"
                type="button"
                variant="flat"
                className="w-8 h-8 p-1 dark:bg-steel-600 text-steel-400 hover:text-steel-600 dark:text-stone-300"
                onClick={() =>
                  openDrawer(UpdateUser, 'Update User', 'Change user info', {
                    user: row.original,
                  })
                }
              >
                <PiPencilThin className="text-[17px]" />
              </Button>
              <DeleteUserButton id={id} userId={userId} />
            </Flex>
          );
        },
      },
    ],
    [openDrawer, userId]
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
    data: users,
    columns,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: false,
    pageCount: Math.ceil(totalUsers / size) ?? -1,
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
    const workbook = await exportUsers(queryParams);
    let d = new Date().toJSON();
    let filename = 'Users-' + d + '.xlsx';
    // create an XLSX file and try to save to Users-*.xlsx
    writeFileXLSX(workbook, filename, { compression: true });
    setIsLoading(false);
  };

  return (
    <Flex direction="col" align="stretch" className="w-full gap-0 mt-0">
      <Flex justify="start" direction="col" className="gap-3 mb-10 lg:flex-row">
        <Flex
          justify="start"
          className="gap-3 lg:gap-5 flex-wrap lg:flex-nowrap"
        >
          <SearchBox
            className="w-full sm:w-auto lg:w-64 3xl:w-96"
            name="text"
            onClear={() => {
              setQueryParams({ text: '' });
            }}
            placeholder="Search users"
            inputClassName="h-10"
            onSubmit={(text) => {
              setQueryParams({ text: text, page: 1 });
            }}
            defaultValue={queryParams?.text}
            queryParams={queryParams}
          />

          <Select
            placeholder="Filter By Status"
            className="w-full sm:w-auto lg:w-52 xl:w-44"
            optionClassName="capitalize"
            options={userStatusOptions}
            onChange={(value: string) => {
              setQueryParams({ status: value, page: 1 });
            }}
            getOptionValue={(option) => option?.value?.toLowerCase() as any}
            value={queryParams?.status ?? ''}
            displayValue={(value) =>
              getOptionByValue(userStatusOptions, value as any)?.label
            }
          />

          {toggleClearBtn && (
            <Button
              className="!h-10 w-full sm:w-auto !font-normal text-steel-500 dark:text-steel-400 hover:bg-steel-50 dark:hover:text-steel-100 dark:hover:bg-steel-600"
              onClick={() => {
                clearQueryParams();
              }}
              variant="text"
            >
              Clear Filters
            </Button>
          )}
        </Flex>
      </Flex>

      {totalUsers > 0 ? (
        <>
          <Table table={table} total={totalUsers} />
          <Flex justify="end" className="mt-6">
            <TablePagination
              pageSize={size}
              setPageSize={onRowsPerPageChange as any}
              total={totalUsers}
              current={page}
              onChange={onPaginationChange}
            />
          </Flex>
        </>
      ) : (
        <>
          <Flex justify="center" className="mt-10 mb-16">
            <Fallback
              illustration={NoFilesIllustration}
              illustrationClassName="min-w-[280px] max-w-[700px] h-auto"
              title="No user found."
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};

function DeleteUserButton({ id, userId }: { id: any; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExtraSmall = useMediaQuery('(max-width:424px )');

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteUser(id);
        toast.success(MESSAGES.USER_DELETED);
        isModalOpen && setIsModalOpen(false);
      } catch (error) {
        handleError(error);
      }
    });
  }

  if (isExtraSmall) {
    return (
      <>
        <Button
          aria-label="Delete User Button"
          onClick={() => setIsModalOpen(true)}
          disabled={userId === id}
          color="danger"
          variant="flat"
          className="w-8 h-8 p-1 text-red-600 bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/70"
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
                onClick={handleDelete}
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
          aria-label="Delete User Button"
          disabled={userId === id}
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
                onClick={handleDelete}
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

const userStatusOptions = [
  {
    label: 'All',
    value: '*',
  },
  {
    label: UserStatus.Active,
    value: UserStatus.Active,
  },
  {
    label: UserStatus.Inactive,
    value: UserStatus.Inactive,
  },
];

const userRolesOptions = [
  {
    label: 'All',
    value: '*',
  },
  {
    label: USER_ROLES.USER,
    value: USER_ROLES.USER,
  },
  {
    label: USER_ROLES.OWNER,
    value: USER_ROLES.OWNER,
  },
];
