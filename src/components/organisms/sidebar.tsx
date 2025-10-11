import { CONFIG } from '@/config';
import { type CompleteTeam } from '@/db/schema';
import { getAnalyticsData } from '@/server/actions/analytics.action';
import {
  formatTeamStorageCapacity,
  formatUserStorageCapacity,
} from '@/server/actions/billing.action';
import { getSetting } from '@/server/actions/settings.action';
import { getCurrentTeam, getMyTeams } from '@/server/actions/team.action';
import { me } from '@/server/actions/user.action';

import { cn } from '@/lib/utils/cn';
import {
  calculatePercentage,
  formatFileSize,
} from '@/lib/utils/formatFileSize';
import { Flex } from '@/components/atoms/layout';
import SimpleBar from '@/components/atoms/simplebar';
import { SidebarLogo } from '@/components/molecules/logo/sidebar-logo';
import { SidebarMenu } from '@/components/organisms/sidebar-menu';

import { DrawerCloseButton } from './drawer-close-button';
import { SidebarDocButton } from './sidebar-doc-button';
import { SidebarStorage } from './sidebar-storage';
import { SidebarSwitchTeam } from './sidebar-switch-team';

export async function Sidebar({
  className,
  isDrawer,
  defaultCollapsed = false,
}: {
  className?: string;
  isDrawer?: boolean;
  defaultCollapsed?: boolean;
}) {
  const teams = await getMyTeams();
  const currentTeam = await getCurrentTeam();
  const user = await me();
  const { totalUsed } = await getAnalyticsData(currentTeam?.id, user?.id);

  const STORAGE_CAPACITY = currentTeam
    ? ((await formatTeamStorageCapacity()) as number)
    : ((await formatUserStorageCapacity()) as number);
  const convertTotalStorage = formatFileSize(STORAGE_CAPACITY as number);
  const currentStorage = formatFileSize(totalUsed.bytes);
  const logo = await getSetting('logo');
  const lightModeLogoUrl = logo?.value;
  const logoSmall = await getSetting('logo_small');
  const logoSmallUrl = logoSmall?.value;
  const darkModeLogo = await getSetting('dark_mode_logo');
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmall = await getSetting('dark_mode_logo_small');
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;
  const appName = CONFIG.APP_NAME;

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        'z-30 h-full shrink-0 start-0 top-0 fixed w-[300px] py-1.5 pl-1.5',
        className
      )}
    >
      <Flex
        direction="col"
        className="border h-full rounded-md bg-steel-50/70 border-steel-100/50 dark:bg-steel-700 dark:border-steel-500/20"
      >
        <Flex
          justify="between"
          className="sticky gap-0 left-0 top-0 h-14 w-full pt-2 items-center justify-start px-6 bg-steel-50/70 dark:bg-steel-700 [&_.dark-mode-logo]:!opacity-0 dark:[&_.dark-mode-logo]:!opacity-100 dark:[&_.light-mode-logo]:!opacity-0 [&_.light-mode-logo]:!opacity-100 pl-[26px]"
        >
          <SidebarLogo
            defaultCollapsed={defaultCollapsed}
            logoUrl={lightModeLogoUrl as string}
            logoSmallUrl={logoSmallUrl as string}
            darkModeLogoUrl={darkModeLogoUrl as string}
            darkModeLogoSmallUrl={darkModeLogoSmallUrl as string}
            appName={appName}
            logoClassName="2xl:w-28"
          />
          {!!isDrawer && <DrawerCloseButton />}
        </Flex>

        <nav className="flex flex-col self-start flex-1 w-full h-full pt-4 overflow-x-hidden shrink-0 grow">
          <SimpleBar className="h-full w-full">
            <SidebarMenu
              defaultCollapsed={defaultCollapsed}
              currentTeam={currentTeam}
            />

            <SidebarStorage
              currentStorage={currentStorage}
              convertTotalStorage={convertTotalStorage}
              defaultCollapsed={defaultCollapsed}
              currentTeam={currentTeam}
              progressValue={calculatePercentage(
                totalUsed.bytes,
                STORAGE_CAPACITY
              )}
            />
            <SidebarDocButton defaultCollapsed={defaultCollapsed} />
          </SimpleBar>
        </nav>

        {process.env.NEXT_PUBLIC_ENABLE_TEAMS !== 'false' && (
          <SidebarSwitchTeam
            defaultCollapsed={defaultCollapsed}
            user={user}
            currentTeam={currentTeam}
            teams={teams as CompleteTeam[]}
          />
        )}
      </Flex>
    </aside>
  );
}
