import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import Link from '@/components/atoms/next/link';

import { Preview } from './preview';

export const Logo = ({
  logoUrl,
  logoUrlSmall,
  darkModeLogoUrl,
  darkModeLogoUrlSmall,
  appName,
  logoClassName,
  logoTextClassName,
  className,
  isSmall,
  href,
}: {
  logoUrl: string;
  logoUrlSmall?: string;
  darkModeLogoUrl: string;
  darkModeLogoUrlSmall?: string;
  appName: string;
  href?: string;
  logoClassName?: string;
  logoTextClassName?: string;
  className?: string;
  isSmall?: boolean;
}) => {
  return (
    <Link
      aria-label="Syncora Logo"
      href={href ?? PAGES.STATIC.LANDING}
      className={cn(
        'relative inline-flex max-h-full text-2xl font-semibold shrink-0 outline-none focus-visible:opacity-90',
        className
      )}
    >
      <Preview
        isSmall={isSmall}
        logo={logoUrl}
        logoSmall={logoUrlSmall}
        darkModeLogo={darkModeLogoUrl}
        darkModeLogoSmall={darkModeLogoUrlSmall}
        appName={appName as string}
        logoClassName={logoClassName}
        logoTextClassName={logoTextClassName}
      />
    </Link>
  );
};
