import { User } from 'lucia';
import { ActionIcon } from 'rizzui';

import { Box, Flex } from '@/components/atoms/layout';
import { AuthDropdownLanding } from '@/components/molecules/auth-dropdown-simple';
import { LoginButton } from '@/components/molecules/landing/login-button';
import NavItems from '@/components/molecules/landing/nav-items';
import { Logo } from '@/components/molecules/logo/';

type Props = {
  logoUrl?: string;
  logoSmallUrl?: string;
  darkModeLogoUrl?: string;
  darkModeLogoSmallUrl?: string;
  appName?: string;
  href?: string;
  logoClassName?: string;
  logoTextClassName?: string;
  onClose: () => void;
  user: User | null;
};
export function MobileMenu({
  onClose,
  logoUrl,
  logoSmallUrl,
  darkModeLogoUrl,
  darkModeLogoSmallUrl,
  appName,
  user,
}: Props) {
  return (
    <Flex
      direction="col"
      justify="start"
      align="start"
      className="h-full font-geist"
    >
      <Flex className="border-b bg-white px-4 py-3 sticky top-0">
        <Logo
          isSmall={false}
          appName={appName as string}
          logoUrl={logoUrl as string}
          logoUrlSmall={logoSmallUrl as string}
          darkModeLogoUrl={darkModeLogoUrl as string}
          darkModeLogoUrlSmall={darkModeLogoSmallUrl as string}
          logoClassName="w-28"
        />
        <ActionIcon onClick={onClose} variant="text" className="-mr-2">
          <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="m25 512a25 25 0 0 1 -17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462a24.93 24.93 0 0 1 -17.68 7.32z" />
            <path d="m487 512a24.93 24.93 0 0 1 -17.68-7.32l-462-462a25 25 0 0 1 35.36-35.36l462 462a25 25 0 0 1 -17.68 42.68z" />
          </svg>
        </ActionIcon>
      </Flex>
      <Box className="grow px-4 w-full">
        <NavItems
          onClose={onClose}
          className="[&_ul]:flex-col [&_ul]:gap-5 [&_ul]:w-full [&_ul]:items-start w-full"
          linkClassName="text-base text-[#141D25] text-left"
        />
      </Box>
      <Box className="py-5 px-4 w-full sticky bottom-0 bg-white space-y-3">
        {!user ? (
          <>
            <LoginButton
              iconClassName="w-5 h-5"
              className="border text-[#141D25] hover:text-[#141D25] border-[#141D25]/50 text-sm flex rounded-lg justify-center p-2 "
            />
          </>
        ) : (
          <AuthDropdownLanding
            user={user}
            isScrolled
            arrowClassName="rotate-180"
          />
        )}
      </Box>
    </Flex>
  );
}
