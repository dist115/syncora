import { getSetting } from '@/server/actions/settings.action';

import { PrivacyPolicy } from '@/components/organisms/privacy-policy';

export default async function Page() {
  const setting = await getSetting('privacy_policy');

  return <PrivacyPolicy data={setting?.value ?? ''} />;
}
