import { CompleteTeamMember, TeamRole } from '@/db/schema';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { InviteButton } from '@/components/organisms/invite-button';
import { TeamMembersTable } from '@/components/organisms/team-members-table';

import Allow from '../atoms/allow';

export const TeamMembers = async ({
  roles,
  members,
  userId,
  totalMembers,
  permissions,
}: {
  roles: TeamRole[];
  members: CompleteTeamMember[];
  userId: string;
  totalMembers: number;
  permissions: any;
}) => {
  return (
    <>
      <Flex direction="col" align="stretch" className="gap-0">
        <PageHeader
          title="Manage Member"
          description="Manage your teams"
          titleClassName="text-xl"
          className="items-center"
          headingWrapperClassName="w-full 375px:w-auto"
          childrenClassName="shrink-0 375px:w-auto 375px:shrink"
        >
          <Allow
            access={PERMISSIONS.INVITE_TEAM_MEMBERS}
            mod={MODULE.TEAM}
            rules={permissions}
          >
            <Flex justify="end" align="stretch" className="w-full 375px:w-auto">
              <InviteButton roles={roles} className="w-full 375px:w-auto" />
            </Flex>
          </Allow>
        </PageHeader>
        <TeamMembersTable
          roles={roles}
          members={members}
          currentUserId={userId}
          totalMembers={totalMembers}
          permissions={permissions}
        />
      </Flex>
    </>
  );
};
