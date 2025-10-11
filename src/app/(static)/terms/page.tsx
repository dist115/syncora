import { getSetting } from '@/server/actions/settings.action';

import { ShowTerms } from '@/components/templates/show-terms';

export default async function Page() {
  const terms = await getSetting('terms');

  return <ShowTerms terms={terms?.value ?? ''} />;
}
