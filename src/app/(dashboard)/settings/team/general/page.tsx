import { getUserPermission } from '@/server/actions/permission.action';
import { getCurrentTeam } from '@/server/actions/team.action';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import Allow from '@/components/atoms/allow';
import { TeamGeneralSettingsForm } from '@/components/organisms/forms/team-general-settings-form';
import NoPermission from '@/components/templates/no-permission';
import { permissions } from '../../../../../db/schema/permissions';

export default async function Page() {
  
  const currentTeam = await getCurrentTeam();
  const permissions = await getUserPermission();

  return (
    <Allow
      access={PERMISSIONS.VIEW_TEAM_SETTINGS}
      mod={MODULE.TEAM}
      rules={permissions}
      fallback={<NoPermission />}
    >
      <TeamGeneralSettingsForm permissions={permissions} team={currentTeam} />
    </Allow>
  );
}
