import { notFound } from 'next/navigation';
import { CONFIG } from '@/config';
import { CompleteFile } from '@/db/schema';
import { getFileByHash } from '@/server/actions/files.action';
import { getSetting } from '@/server/actions/settings.action';

import { SharedFilePreview } from '@/components/templates/shared-file-preview';

export default async function Page({ params }: { params: { hash: string } }) {
  const logo = await getSetting('logo');
  const lightModeLogoUrl = logo?.value;
  const logoSmall = await getSetting('logo_small');
  const logoSmallUrl = logoSmall?.value;
  const darkModeLogo = await getSetting('dark_mode_logo');
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmall = await getSetting('dark_mode_logo_small');
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;
  const appName = CONFIG.APP_NAME;
  const file = await getFileByHash(params.hash);

  if (!file) {
    throw notFound();
  }

  return (
    <SharedFilePreview
      file={file as CompleteFile}
      logoUrl={lightModeLogoUrl as string}
      logoSmallUrl={logoSmallUrl as string}
      darkModeLogoUrl={darkModeLogoUrl as string}
      darkModeLogoSmallUrl={darkModeLogoSmallUrl as string}
      appName={appName}
    />
  );
}
