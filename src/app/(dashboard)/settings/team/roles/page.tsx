import React from 'react';
import { getAllPermissions, getUserPermission} from '@/server/actions/permission.action';
import { getAllTeamRoles } from '@/server/actions/team-role.action';
import { getCurrentTeam } from '@/server/actions/team.action';

import { TeamRoles } from '@/components/templates/team-roles';
import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import NoPermission from '@/components/templates/no-permission';
import Allow from '@/components/atoms/allow';

export default async function Page() {
  const currentTeam = await getCurrentTeam();
  const roles = await getAllTeamRoles(currentTeam?.id as string);
  const allPermissions = await getAllPermissions();
  const userPermissions = await getUserPermission();
  return (
    <Allow
      access={PERMISSIONS.VIEW_TEAM_ROLES}
      mod={MODULE.TEAM}
      rules={userPermissions}
      fallback={<NoPermission />}
    >
       <TeamRoles permissions={allPermissions} roles={roles} />

    </Allow>
     
  );
}
