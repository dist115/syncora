import { getCurrentSubscription } from '@/server/actions/user.action';

import { UsersBillingSettings } from '@/components/templates/users-billing-settings';

export default async function Page({ searchParams }: { searchParams: any }) {
  const subscription = await getCurrentSubscription();
  return (
    <UsersBillingSettings
      searchParams={searchParams}
      subscription={subscription}
    />
  );
}
