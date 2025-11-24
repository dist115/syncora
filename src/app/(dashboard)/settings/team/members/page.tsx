import { notFound } from 'next/navigation';
import { getUserPermission } from '@/server/actions/permission.action';
import { getAllTeamRoles } from '@/server/actions/team-role.action';
import { getCurrentTeam, getTeamMembers } from '@/server/actions/team.action';
import { me } from '@/server/actions/user.action';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import Allow from '@/components/atoms/allow';
import NoPermission from '@/components/templates/no-permission';
import { TeamMembers } from '@/components/templates/team-members';

export default async function Page({ searchParams }: { searchParams: any }) {
  const user = await me();
  if (!user?.currentTeamId) {
    notFound();
  }

  const { members, count } = await getTeamMembers(
    user.currentTeamId,
    searchParams
  );

  const currentTeam = await getCurrentTeam();
  const roles = await getAllTeamRoles(currentTeam?.id as string);
  const permissions = await getUserPermission();

  return (
    <Allow
      access={PERMISSIONS.VIEW_TEAM_MEMBERS}
      mod={MODULE.TEAM}
      rules={permissions}
      fallback={<NoPermission />}
    >
      <TeamMembers
        roles={roles}
        members={members}
        userId={user.id}
        totalMembers={count}
        permissions={permissions}
      />
    </Allow>
  );
}
