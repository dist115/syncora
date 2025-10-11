'use client';

import React, { useTransition } from 'react';
import { Permission, TeamRole } from '@/db/schema';
import { deleteTeamRole } from '@/server/actions/team-role.action';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Badge, Button, Popover, Text, Title } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { TEAM_ROLES } from '@/config/roles';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { Box, Flex } from '@/components/atoms/layout';
import { Table } from '@/components/atoms/table/table';
import { UpdateRoleForm } from '@/components/organisms/forms/update-role-form';

export const TeamRolesTable = ({
  roles,
  permissions,
}: {
  roles: TeamRole[];
  permissions: Permission[];
}) => {
  const { openDrawer } = useDrawer();
  const [columnVisibility, setColumnVisibility] = React.useState<{
    [key: string]: boolean;
  }>({
    role: true,
    permission: true,
  });
  const columns = React.useMemo<ColumnDef<TeamRole>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        size: 100,
      },
      {
        header: 'Permissions',
        accessor: 'permissions',
        size: 500,
        cell: ({ row }) => (
          <Box className="flex w-full gap-2 flex-wrap">
            {(row.original.permissions as any[]).map(
              (permission: any, index: number) => (
                <Badge variant="flat" key={index}>
                  {permission || 'None'}
                </Badge>
              )
            )}
          </Box>
        ),
      },
      {
        header: '',
        meta: {
          columnName: 'Operations', // need this to display the name of the column on the control popover
        },
        accessorKey: 'id',
        size: 40,
        enableHiding: false,
        cell: ({ row }) => {
          const role = row.original;
          const { id: roleId } = role;

          return (
            <Flex justify="end" className="gap-1">
              {role.name !== TEAM_ROLES.ADMIN &&
                role.name !== TEAM_ROLES.MEMBER && (
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      openDrawer(
                        UpdateRoleForm,
                        'Update Role',
                        'Change role name or permissions',
                        {
                          role,
                          permissions,
                        }
                      )
                    }
                  >
                    Edit
                  </Button>
                )}
              <DeleteTeam role={role} />
            </Flex>
          );
        },
      },
    ],
    [openDrawer, permissions]
  );
  const table = useReactTable({
    data: roles,
    columns,
    defaultColumn: {
      minSize: 200,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <>
      <Table table={table} />
    </>
  );
};

function DeleteTeam({ role }: { role: any }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteTeamRole(role.id);
        toast.success(MESSAGES.ROLE_DELETED);
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Button
          disabled={
            role.name === TEAM_ROLES.ADMIN || role.name === TEAM_ROLES.MEMBER
          }
          className="group"
          variant="flat"
          color="danger"
        >
          <RiDeleteBinLine className="w-4 h-auto" />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        {({ setOpen }) => (
          <>
            <Title className="mb-2 text-lg font-semibold">Delete Role?</Title>
            <Text className="text-gray-600 dark:text-gray-300 max-w-[42ch]">
              Are you sure you want to delete this role?
            </Text>
            <Flex justify="end" className="gap-3 mt-6">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={handleDelete}
                color="danger"
                variant="flat"
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
