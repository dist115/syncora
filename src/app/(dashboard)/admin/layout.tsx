import { redirect } from 'next/navigation';
import { me } from '@/server/actions/user.action';

import { AdminPageMenus } from '@/config/menus';
import { PAGES } from '@/config/pages';
import { USER_ROLES } from '@/config/roles';
import { Box } from '@/components/atoms/layout';
import LineNavigationMenu from '@/components/organisms/line-navigation-menu';

export default async function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = await me();

  if (user?.roleNames?.includes(USER_ROLES.OWNER) == false) {
    return redirect(PAGES.DASHBOARD.ROOT);
  }

  return (
    <>
      <LineNavigationMenu menus={AdminPageMenus} />
      <Box>{children}</Box>
    </>
  );
}
