'use client';

import { usePathname } from 'next/navigation';
import { Title } from 'rizzui';

export default function PageTitle() {
  const pathname = usePathname();

  return (
    <Title fontWeight="medium" className="capitalize text-xl md:text-2xl">
      {getPageTitle(pathname) ?? 'Home'}
    </Title>
  );
}

function getPageTitle(pathname: string) {
  const pageTitle = pathname.split('/').slice(-1)[0];

  if (pathname.includes('folders')) return 'Folders';

  if (pathname.includes('settings')) return 'Settings';

  return pageTitle;
}
