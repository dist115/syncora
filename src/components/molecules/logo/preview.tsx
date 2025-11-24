import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import Image from '@/components/atoms/next/image';

export function Preview({
  logo,
  logoSmall,
  darkModeLogo,
  darkModeLogoSmall,
  appName,
  logoClassName,
  logoTextClassName,
  isSmall,
}: {
  logo?: string | null;
  logoSmall?: string | null;
  darkModeLogo?: string | null;
  darkModeLogoSmall?: string | null;
  appName: string;
  logoClassName?: string;
  logoTextClassName?: string;
  isSmall?: boolean;
}) {
  const APP_NAME = isSmall ? appName.charAt(0) : appName;

  if (darkModeLogo && logo && logoSmall && darkModeLogoSmall)
    return (
      <span
        className={cn(
          'inline-block relative ',
          isSmall ? 'aspect-square' : 'aspect-[20/7] w-20 xl:w-[137px]',
          logoClassName
        )}
      >
        <Image
          src={getR2FileLink(logoSmall)}
          alt={appName}
          width={70}
          height={70}
          priority={true}
          className={cn(
            'object-contain absolute w-7 aspect-square top-0 -left-2  h-auto light-mode-logo-small dark:opacity-0',
            isSmall ? 'visible' : 'invisible'
          )}
          loading="eager"
          quality={100}
        />
        <Image
          src={getR2FileLink(darkModeLogoSmall)}
          alt={appName}
          width={70}
          height={70}
          priority={true}
          className={cn(
            'object-contain absolute w-7 aspect-square top-0 -left-2  h-auto dark-mode-logo-small opacity-0 dark:opacity-100',
            isSmall ? 'visible' : 'invisible'
          )}
          loading="eager"
          quality={100}
        />
        <Image
          src={getR2FileLink(logo)}
          alt={appName}
          width={200}
          height={70}
          priority={true}
          className={cn(
            'object-contain absolute w-full aspect-[20/7] top-0 left-0  h-auto light-mode-logo',
            isSmall ? 'invisible' : 'visible'
          )}
          loading="eager"
          quality={100}
        />
        <Image
          src={getR2FileLink(darkModeLogo)}
          alt={appName}
          width={200}
          height={70}
          priority={true}
          className={cn(
            'object-contain absolute w-full aspect-[20/7] top-0 left-0  h-auto dark-mode-logo',
            isSmall ? 'invisible' : 'visible'
          )}
          loading="eager"
          quality={100}
        />
      </span>
    );

  return (
    <span
      className={cn('dark:text-steel-100 text-steel-700', logoTextClassName)}
    >
      {APP_NAME}
    </span>
  );
}
