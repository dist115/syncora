import { UserSettingsPageMenus } from '@/config/menus';
import { Box } from '@/components/atoms/layout';
import LineNavigationMenu from '@/components/organisms/line-navigation-menu';

export default async function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <LineNavigationMenu menus={UserSettingsPageMenus} />
      <Box>{children}</Box>
    </>
  );
}
