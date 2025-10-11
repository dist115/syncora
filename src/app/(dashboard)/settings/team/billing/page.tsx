import { getCurrentTeamSubscription } from '@/server/actions/billing.action';
import { getUserPermission } from '@/server/actions/permission.action';
import { me } from '@/server/actions/user.action';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import Allow from '@/components/atoms/allow';
import NoPermission from '@/components/templates/no-permission';
import { TeamBillingSettings } from '@/components/templates/team-billing-settings';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: any }) {
  const user = await me();

  const subscription = await getCurrentTeamSubscription();
  const permissions = await getUserPermission();

  return (
    <Allow
      access={PERMISSIONS.VIEW_TEAM_BILLING}
      mod={MODULE.TEAM}
      rules={permissions}
      fallback={<NoPermission />}
    >
      <TeamBillingSettings
        permissions={permissions}
        teamId={user.currentTeamId}
        searchParams={searchParams}
        subscription={subscription}
      />
    </Allow>
  );
}
