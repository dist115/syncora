import { getSetting } from '@/server/actions/settings.action';

import { FaqForm } from '@/components/organisms/forms/faq-form';

export default async function Page() {
  const setting = await getSetting('faq');

  return <FaqForm faq={setting?.value} />;
}
