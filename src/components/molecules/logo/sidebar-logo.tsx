'use client';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { useResizableLayout } from '@/components/atoms/resizable-layout/resizable-layout.utils';
import { Logo } from '@/components/molecules/logo';

type Props = {
  logoUrl: string;
  logoSmallUrl: string;
  darkModeLogoUrl: string;
  darkModeLogoSmallUrl: string;
  appName: string;
  logoClassName?: string;
  defaultCollapsed?: boolean;
};

export function SidebarLogo({
  logoUrl,
  logoSmallUrl,
  darkModeLogoUrl,
  darkModeLogoSmallUrl,
  appName,
  defaultCollapsed,
}: Props) {
  const { isCollapsed } = useResizableLayout(defaultCollapsed);
  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;

  return (
    <Logo
      href={PAGES.DASHBOARD.ROOT}
      isSmall={IS_COLLAPSED}
      logoUrl={logoUrl as string}
      logoUrlSmall={logoSmallUrl as string}
      darkModeLogoUrl={darkModeLogoUrl as string}
      darkModeLogoUrlSmall={darkModeLogoSmallUrl as string}
      appName={appName}
      logoClassName={cn(IS_COLLAPSED ? 'w-7' : '2xl:w-28')}
    />
  );
}
