import { getSetting } from '@/server/actions/settings.action';

import { ShowPrivacyPolicy } from '@/components/templates/show-privacy-policy';

export default async function Page() {
  const privacyPolicy = await getSetting('privacy_policy');

  return <ShowPrivacyPolicy privacyPolicy={privacyPolicy?.value ?? ''} />;
}
