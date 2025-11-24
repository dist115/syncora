import { me } from '@/server/actions/user.action';

import { SettingsPageMenus } from '@/config/menus';
import { Box } from '@/components/atoms/layout';
import LineNavigationMenu from '@/components/organisms/line-navigation-menu';
import { NoTeamFallback } from '@/components/organisms/no-team-fallback';

export default async function Layout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = await me();
  const isUserHasTeam = user.currentTeamId !== null;

  if (!isUserHasTeam) {
    return <NoTeamFallback />;
  }

  return (
    <>
      <LineNavigationMenu menus={SettingsPageMenus} />
      <Box>{children}</Box>
    </>
  );
}
