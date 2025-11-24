import React from 'react';
import { Permission, TeamRole } from '@/db/schema';

import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { CreateRoleButton } from '@/components/organisms/create-role-button';
import { TeamRolesTable } from '@/components/organisms/team-roles-table';

export const TeamRoles = ({
  roles,

  permissions,
}: {
  roles: TeamRole[];
  permissions: Permission[];
}) => {
  return (
    <>
      <PageHeader
        title="Manage Roles"
        description="View and manage your team roles"
        titleClassName="text-xl"
        className="items-center"
      >
        <Flex justify="end" className="w-full">
          <CreateRoleButton permissions={permissions} />
        </Flex>
      </PageHeader>
      <TeamRolesTable permissions={permissions} roles={roles} />
    </>
  );
};
