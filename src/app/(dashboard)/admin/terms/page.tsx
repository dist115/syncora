import { getSetting } from '@/server/actions/settings.action';

import { Terms } from '@/components/organisms/terms';

export default async function Page() {
  const setting = await getSetting('terms');

  return <Terms data={setting?.value ?? ''} />;
}
