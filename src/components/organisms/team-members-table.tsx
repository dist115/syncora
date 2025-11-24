'use client';

import {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { CompleteTeamMember, TeamMemberStatus, TeamRole } from '@/db/schema';
import {
  deleteMember,
  exportTeamMembers,
  resendInvitation,
} from '@/server/actions/team.action';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { RiDeleteBinLine, RiDownloadLine, RiRefreshLine } from 'react-icons/ri';
import {
  Avatar,
  Button,
  Checkbox,
  Modal,
  Popover,
  Select,
  SelectOption,
  Text,
  Title,
} from 'rizzui';
import { toast } from 'sonner';
import { writeFileXLSX } from 'xlsx';

import { MESSAGES } from '@/config/messages';
import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { getOptionByValue } from '@/lib/utils/getOptionByValue';
import { useIsClient } from '@/hooks/useIsClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useQueryParams from '@/hooks/useQueryParam';
import Allow from '@/components/atoms/allow';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { Box, Flex } from '@/components/atoms/layout';

import { Badge } from '../atoms/badge';
import { SearchBox } from '../atoms/search-box';
import { Table } from '../atoms/table/table';
import TablePagination from '../atoms/table/table-pagination';
import { Fallback } from '../molecules/Fallback';
import { UpdateTeamMember } from './forms/update-team-member';
import { MembersDeleteButton } from './memebrs-delete-button';

export const TeamMembersTable = ({
  roles,
  members,
  currentUserId,
  totalMembers,
  permissions,
}: {
  roles: TeamRole[];
  members: CompleteTeamMember[];
  currentUserId: string;
  totalMembers: number;
  permissions: any;
}) => {
  const { openDrawer } = useDrawer();
  const { clearQueryParams, setQueryParams, queryParams } = useQueryParams();
  const [isLoading, setIsLoading] = useState(false);
  const filterParams = ['text', 'status', 'role'];
  const toggleClearBtn = filterParams.some((key) => {
    return key in queryParams;
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const page = queryParams.page ? Number(queryParams.page) : 1;
  const size = queryParams.size ? Number(queryParams.size) : 10;

  const memberRolesOptions = useMemo(() => {
    const options = roles.map((role) => ({
      label: role.name,
      value: role.id.toString(),
    }));
    return [{ label: 'All', value: '*' }, ...options];
  }, [roles]);

  const columns = useMemo<ColumnDef<CompleteTeamMember>[]>(
    () => [
      {
        id: 'select',
        maxSize: 45,
        enableHiding: false,
        header: () => (
          <Allow
            access={PERMISSIONS.DELETE_TEAM_MEMBERS}
            mod={MODULE.TEAM}
            rules={permissions}
          >
            <Checkbox
              aria-label="All Row Selection Checkbox"
              variant="flat"
              size="sm"
              checked={selectedRows.length === members.length}
              onChange={() => {
                if (selectedRows.length === members.length) {
                  setSelectedRows([]);
                } else {
                  setSelectedRows(members.map((row) => row.id.toString()));
                }
              }}
            />
          </Allow>
        ),
        cell: ({ row }) => (
          <Allow
            access={PERMISSIONS.DELETE_TEAM_MEMBERS}
            mod={MODULE.TEAM}
            rules={permissions}
          >
            <Checkbox
              aria-label="Row Selection Checkbox"
              variant="flat"
              size="sm"
              checked={selectedRows.includes(row.original.id.toString())}
              disabled={!row.getCanSelect()}
              onChange={() => {
                const id = row.original.id.toString();
                selectedRows.includes(id)
                  ? setSelectedRows(selectedRows.filter((row) => row !== id))
                  : setSelectedRows([...selectedRows, id]);
              }}
            />
          </Allow>
        ),
      },
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
              <Avatar name={name as string} src={image as string} size="sm" />
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
        accessorKey: 'role.name',
        size: 150,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        size: 150,
        enableSorting: false,
        cell: ({ row }) => {
          function statusColor(status: string) {
            if (status === TeamMemberStatus.Inactive) return 'danger';
            if (status === TeamMemberStatus.Invited) return 'warning';
            return 'success';
          }

          return (
            <Flex justify="start" className="gap-2">
              <Badge
                color={statusColor(row.original.status as string)}
                renderAsDot
              />
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
        size: 130,
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
        size: 220,
        enableHiding: false,
        accessorKey: 'id',
        cell: ({ row }) => {
          const { id: memberId, teamId, userId, status } = row.original;
          return (
            <Flex justify="end" className="gap-1">
              <Allow
                access={PERMISSIONS.EDIT_TEAM_MEMBERS}
                mod={MODULE.TEAM}
                rules={permissions}
              >
                {status != TeamMemberStatus.Invited && (
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      openDrawer(
                        UpdateTeamMember,
                        'Update Member',
                        'Change member role or status',
                        {
                          member: row.original,
                          roles: roles,
                        }
                      )
                    }
                  >
                    Edit
                  </Button>
                )}
              </Allow>

              <Allow
                access={PERMISSIONS.INVITE_TEAM_MEMBERS}
                mod={MODULE.TEAM}
                rules={permissions}
              >
                {status == TeamMemberStatus.Invited && (
                  <ResendInvitationButton
                    memberId={memberId}
                    teamId={teamId as string}
                  />
                )}
              </Allow>

              <Allow
                access={PERMISSIONS.DELETE_TEAM_MEMBERS}
                mod={MODULE.TEAM}
                rules={permissions}
              >
                <DeleteMemberButton
                  row={row}
                  currentUserId={currentUserId as string}
                  userId={userId as string}
                  teamId={teamId as string}
                  memberId={memberId}
                />
              </Allow>
            </Flex>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUserId, members, openDrawer, roles, selectedRows]
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
    data: members,
    columns,
    defaultColumn: {
      minSize: 100,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: false,
    pageCount: Math.ceil(totalMembers / size) ?? -1,
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
    const workbook = await exportTeamMembers(queryParams);
    let d = new Date().toJSON();
    let filename = 'Team-Members-' + d + '.xlsx';
    // create an XLSX file and try to save to Team-Members-*.xlsx
    writeFileXLSX(workbook, filename, { compression: true });
    setIsLoading(false);
  };

  return (
    <Flex direction="col" align="stretch" className="w-full gap-0">
      <Flex
        justify="start"
        className="gap-3 mb-10 flex-wrap md:justify-between"
      >
        <SearchBox
          className="w-full md:w-56 lg:w-96 [@media(min-width:1440px)]:w-64"
          name="text"
          onClear={() => {
            setQueryParams({ text: '' });
          }}
          placeholder="Search team members"
          onSubmit={(text) => {
            setQueryParams({ text: text, page: 1 });
          }}
          defaultValue={queryParams?.text}
          queryParams={queryParams}
        />

        <Flex className="w-full grid grid-cols-2 md:flex md:w-auto">
          <Select
            placeholder="Filter By Status"
            className="!h-[42px] w-full md:w-48 capitalize"
            options={memberStatusOptions}
            value={queryParams?.status ?? ''}
            onChange={(value) => setQueryParams({ status: value, page: 1 })}
            getOptionValue={(option) => option?.label}
            getOptionDisplayValue={(option) => renderCustomOptions(option)}
          />
          <Select
            placeholder="Filter By Role"
            className="!h-[42px] w-full md:w-48 capitalize"
            options={memberRolesOptions}
            value={queryParams?.role ?? ''}
            onChange={(value) => setQueryParams({ role: value, page: 1 })}
            getOptionValue={(option) => option?.value}
            displayValue={(v) =>
              getOptionByValue(memberRolesOptions, v as any)?.label
            }
          />
        </Flex>
        {toggleClearBtn && (
          <Button
            className="w-full md:w-auto md:ml-0 !font-normal text-steel-500 dark:text-steel-400 hover:bg-steel-50 dark:hover:text-steel-100 dark:hover:bg-steel-600"
            onClick={() => {
              clearQueryParams();
            }}
            variant="text"
          >
            Clear Filters
          </Button>
        )}
        <Flex className="w-full grid grid-cols-2 md:flex md:w-auto md:ml-auto">
          <Allow
            access={PERMISSIONS.EXPORT_TEAM_MEMBERS}
            mod={MODULE.TEAM}
            rules={permissions}
          >
            <Button
              variant="outline"
              className="ml-auto flex gap-2 items-center w-full"
              onClick={handleExport}
              isLoading={isLoading}
            >
              <RiDownloadLine className="duration-200 w-4 h-4" />
              Export
            </Button>
          </Allow>
          <Allow
            access={PERMISSIONS.DELETE_TEAM_MEMBERS}
            mod={MODULE.TEAM}
            rules={permissions}
          >
            <MembersDeleteButton members={selectedRows} />
          </Allow>
        </Flex>
      </Flex>

      {totalMembers > 0 ? (
        <>
          <Table table={table} total={totalMembers} />
          <Flex justify="end" className="mt-6">
            <TablePagination
              pageSize={size}
              setPageSize={onRowsPerPageChange as any}
              total={totalMembers}
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
              title="No member found"
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};

function DeleteMemberButton({
  row,
  currentUserId,
  userId,
  teamId,
  memberId,
}: {
  row: any;
  currentUserId: string;
  userId: string;
  teamId: string;
  memberId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExtraSmall = useMediaQuery('(max-width:425px)');
  const isClient = useIsClient();

  function handleDelete(setOpen: Dispatch<SetStateAction<boolean>>) {
    startTransition(async () => {
      try {
        await deleteMember(teamId as string, memberId);
        toast.success('Team member deleted successfully');
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    });
  }

  if (!isClient) return null;

  if (isExtraSmall) {
    return (
      <>
        <Button
          aria-label="Delete Member Button"
          variant="flat"
          color="danger"
          disabled={
            currentUserId === userId || row.original.role.name === 'ADMIN'
          }
          onClick={() => setIsModalOpen(true)}
        >
          <RiDeleteBinLine className="w-4 h-auto" />
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          containerClassName="bg-white dark:bg-steel-800"
        >
          <Box className="p-4">
            <Title className="mb-2 text-lg font-semibold">Delete member?</Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this member?
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
          aria-label="Delete Member Button"
          variant="flat"
          color="danger"
          disabled={
            currentUserId === userId || row.original.role.name === 'ADMIN'
          }
        >
          <RiDeleteBinLine className="w-4 h-auto" />
        </Button>
      </Popover.Trigger>

      <Popover.Content>
        {({ setOpen }) => (
          <>
            <Title className="mb-2 text-lg font-semibold">Delete Member?</Title>
            <Text className="text-gray-600 dark:text-gray-300 max-w-[42ch]">
              Are you sure you want to delete this member?
            </Text>
            <Flex className="gap-3 mt-6" justify="end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
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

function ResendInvitationButton({
  memberId,
  teamId,
}: {
  memberId: number;
  teamId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleResend() {
    startTransition(async () => {
      try {
        await resendInvitation(memberId, teamId as string);
        toast.success(MESSAGES.SENT_INVITATION_SUCCESSFULLY);
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <Button type="button" variant="text" onClick={handleResend}>
      {isPending && (
        <RiRefreshLine className={'mr-1.5 w-4 h-auto animate-spin'} />
      )}
      Resend Invitation
    </Button>
  );
}

const memberStatusOptions = [
  {
    label: 'All',
    value: '*',
  },
  {
    label: TeamMemberStatus.Active,
    value: TeamMemberStatus.Active,
  },
  {
    label: TeamMemberStatus.Inactive,
    value: TeamMemberStatus.Inactive,
  },
  {
    label: TeamMemberStatus.Invited,
    value: TeamMemberStatus.Invited,
  },
];

function renderCustomOptions(option: SelectOption) {
  const v = option.value;
  switch (v) {
    case TeamMemberStatus.Active:
      return (
        <Flex justify="start" className="gap-2">
          <Badge color="success" renderAsDot />
          <Text className="capitalize">{v}</Text>
        </Flex>
      );
    case TeamMemberStatus.Inactive:
      return (
        <Flex justify="start" className="gap-2">
          <Badge color="danger" renderAsDot />
          <Text className="capitalize">{v}</Text>
        </Flex>
      );
    case TeamMemberStatus.Invited:
      return (
        <Flex justify="start" className="gap-2">
          <Badge color="warning" renderAsDot />
          <Text className="capitalize">{v}</Text>
        </Flex>
      );
    default:
      return (
        <Flex justify="start" className="gap-2">
          <Badge color="primary" renderAsDot />
          <Text className="capitalize">All</Text>
        </Flex>
      );
  }
}
