import { DashboardIcon } from '@/components/atoms/icons/dashboard/dashboard';
import { FavouriteIcon } from '@/components/atoms/icons/dashboard/favourite';
import { FilesIcon } from '@/components/atoms/icons/dashboard/files';
import { SettingIcon } from '@/components/atoms/icons/dashboard/setting';
import { TrashIcon } from '@/components/atoms/icons/dashboard/trash';

import { PAGES } from './pages';
import { TEAM_PAGES } from './teams';

export type Menu = {
  name: string;
  href: any;
  icon?: any;
};

export const StaticMenuItems: Menu[] = [
  {
    name: 'Home',
    href: PAGES.STATIC.LANDING,
  },
  {
    name: 'FAQ',
    href: PAGES.STATIC.FAQ,
  },
  {
    name: 'Privacy Policy',
    href: PAGES.STATIC.PRIVACY_POLICY,
  },
  {
    name: 'Terms and Conditions',
    href: PAGES.STATIC.TERMS,
  },
  {
    name: 'Contact Us',
    href: PAGES.STATIC.CONTACT_US,
  },
];

const SidebarMenuItems: Menu[] = [
  {
    name: 'Dashboard',
    href: PAGES.DASHBOARD.ROOT,
    icon: DashboardIcon,
  },
  {
    name: 'Files',
    href: PAGES.DASHBOARD.FILES,
    icon: FilesIcon,
  },
  {
    name: 'Favourites',
    href: PAGES.DASHBOARD.FAVOURITES,
    icon: FavouriteIcon,
  },
  {
    name: 'Trash',
    href: PAGES.DASHBOARD.TRASH,
    icon: TrashIcon,
  },
  {
    name: 'Manage Team',
    href: PAGES.SETTINGS.TEAM.ROOT,
    icon: SettingIcon,
  },
];

export const SidebarMenus =
  process.env.NEXT_PUBLIC_ENABLE_TEAMS === 'false'
    ? SidebarMenuItems.filter((item) => !TEAM_PAGES.includes(item.href))
    : SidebarMenuItems;

export const SettingsPageMenus: Menu[] = [
  {
    name: 'General',
    href: PAGES.SETTINGS.TEAM.ROOT,
  },
  {
    name: 'Members',
    href: PAGES.SETTINGS.TEAM.MEMBERS,
  },
  {
    name: 'Roles',
    href: PAGES.SETTINGS.TEAM.ROLES,
  },
  {
    name: 'Billing',
    href: PAGES.SETTINGS.TEAM.BILLING,
  }
];

export const UserSettingsPageMenus: Menu[] = [
  {
    name: 'Profile',
    href: PAGES.SETTINGS.USER.PROFILE,
  },
  {
    name: 'Teams',
    href: PAGES.SETTINGS.USER.TEAMS,
  },
  {
    name: 'Billing',
    href: PAGES.SETTINGS.USER.BILLING,
  }
];

export const AdminPageMenus: Menu[] = [
  {
    name: 'Users',
    href: PAGES.ADMIN.USER,
  },
  {
    name: 'Files',
    href: PAGES.ADMIN.FILE,
  },
  {
    name: 'Teams',
    href: PAGES.ADMIN.TEAMS,
  },
  {
    name: 'Site Settings',
    href: PAGES.ADMIN.SETTINGS,
  },
  {
    name: 'Contacts',
    href: PAGES.ADMIN.CONTACT,
  },
  {
    name: 'FAQ',
    href: PAGES.ADMIN.FAQ,
  },
  {
    name: 'Privacy Policy',
    href: PAGES.ADMIN.PRIVACY_POLICY,
  },
  {
    name: 'Terms and Conditions',
    href: PAGES.ADMIN.TERMS,
  },
];
