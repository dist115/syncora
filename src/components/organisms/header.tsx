import { CONFIG } from '@/config';
import { getSetting } from '@/server/actions/settings.action';
import { me } from '@/server/actions/user.action';

import { PAGES } from '@/config/pages';
import { Box, Flex } from '@/components/atoms/layout';
import { AuthDropdown } from '@/components/molecules/auth-dropdown';
import { Logo } from '@/components/molecules/logo';
import PageName from '@/components/molecules/page-name';
import { TopBarPanel } from '@/components/molecules/topbar-panel';
import { HamburgerButton } from '@/components/organisms/hamburger-button';

import { Sidebar } from './sidebar';

export default async function Header() {
  const user = await me();
  const logo = await getSetting('logo');
  const logoSmall = await getSetting('logo_small');
  const darkModeLogo = await getSetting('dark_mode_logo');
  const darkModeLogoSmall = await getSetting('dark_mode_logo_small');
  const lightModeLogoUrl = logo?.value;
  const logoModeSmallUrl = logoSmall?.value;
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;
  return (
    <Box className="sticky top-0 px-0 right-0 z-50 w-full bg-white dark:bg-steel-900 h-16 min-h-16 lg:h-[76px] lg:min-h-[76px]">
      <Flex
        justify="between"
        className="w-full h-full gap-0 border-b border-steel-100 dark:border-steel-600/60"
      >
        <HamburgerButton
          drawerCloseDeps={[user]}
          className="inline-block xl:hidden"
        >
          <Box className="h-[100dvh]">
            <Sidebar
              isDrawer
              className="pr-0 pl-0 py-0 h-full [&>.flex]:h-[100dvh]"
            />
          </Box>
        </HamburgerButton>
        <Logo
          href={PAGES.DASHBOARD.ROOT}
          isSmall={false}
          appName={CONFIG.APP_NAME}
          logoUrl={lightModeLogoUrl as string}
          logoUrlSmall={logoModeSmallUrl as string}
          darkModeLogoUrl={darkModeLogoUrl as string}
          darkModeLogoUrlSmall={darkModeLogoSmallUrl as string}
          className="ms-2 flex items-center xl:hidden [&_.dark-mode-logo]:!opacity-0 dark:[&_.dark-mode-logo]:!opacity-100 dark:[&_.light-mode-logo]:!opacity-0 [&_.light-mode-logo]:!opacity-100"
        />
        <Flex justify="between" className="flex items-center w-full gap-6">
          <PageName />
          <Flex justify="end" className="items-center gap-3 lg:gap-5">
            <TopBarPanel notificationCount={'0'} />
            <div className="flex items-center justify-center gap-1.5">
              <AuthDropdown user={user} />
            </div>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
