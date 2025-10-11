import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { BillingStatus } from '@/components/molecules/billing/billing-status';
import { ManageBilling } from '@/components/molecules/billing/manage-billing';
import { TeamPricing } from '@/components/organisms/team-pricing';
import Allow from '../atoms/allow';
import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';

export const TeamBillingSettings = ({
  teamId,
  searchParams,
  subscription,
  permissions
}: {
  teamId: string | null;
  searchParams?: any;
  subscription?: any;
  permissions?: any;
}) => {
  return (
    <Box>
      <PageHeader
        title="Pricing Plan"
        description="Pick the plan that best fits your needs"
        titleClassName="text-xl"
        className="items-center"
      >
        <Allow
          access={PERMISSIONS.MANAGE_TEAM_BILLING}
          mod={MODULE.TEAM}
          rules={permissions}
        >
          <Flex justify="end" className="w-full">
            <ManageBilling />
          </Flex>

        </Allow>

      </PageHeader>

      {searchParams?.success || searchParams?.cancel ? (
        <BillingStatus searchParams={searchParams} />
      ) : (
        <TeamPricing teamId={teamId} subscription={subscription} />
      )}
    </Box>
  );
};
