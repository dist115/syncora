import { getSetting } from '@/server/actions/settings.action';

import { ShowFaq } from '@/components/templates/show-faq';

export default async function Page() {
  const faq = await getSetting('faq');

  return <ShowFaq faq={faq?.value ?? ''} />;
}
