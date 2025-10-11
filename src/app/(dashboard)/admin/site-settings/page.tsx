import { getAllSettings } from '@/server/actions/settings.action';

import { SiteSettingsForm } from '@/components/organisms/forms/site-settings-form';

export default async function Page() {
  const settings = await getAllSettings();
  return <SiteSettingsForm settings={settings} />;
}
