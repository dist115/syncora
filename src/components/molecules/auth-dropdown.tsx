'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from '@/server/actions/auth.action';
import {
  RiFileCopy2Line,
  RiFolderChartLine,
  RiHome8Line,
  RiLogoutBoxLine,
  RiSettings3Line,
  RiUserLine,
} from 'react-icons/ri';
import { Avatar, Button, Dropdown } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { PAGES } from '@/config/pages';
import { usePathname } from '@/components/atoms/next/navigation';
import { Separator } from '@/components/atoms/separator';

type AuthDropDownMenuType = {
  name: string;
  href: string;
  icon: typeof RiUserLine;
};

type AuthDropDownMenuTree = {
  static: AuthDropDownMenuType[];
  account: AuthDropDownMenuType[];
};

const AuthDropDownMenus: AuthDropDownMenuTree = {
  static: [
    {
      name: 'Dashboard',
      href: PAGES.DASHBOARD.ROOT,
      icon: RiFolderChartLine,
    },
    {
      name: 'Landings',
      href: PAGES.STATIC.LANDING,
      icon: RiHome8Line,
    },
    {
      name: 'Documentation',
      href: PAGES.DOC.LINK,
      icon: RiFileCopy2Line,
    },
  ],
  account: [
    {
      name: 'User Settings',
      href: PAGES.SETTINGS.USER.PROFILE,
      icon: RiUserLine,
    },
    {
      name: 'Admin',
      href: PAGES.ADMIN.ROOT,
      icon: RiSettings3Line,
    },
  ],
};

export function AuthDropdown({ user }: { user: any }) {
  const pathname = usePathname();

  const userImage = user?.image ? user?.image : '/assets/avatars/avatar7.webp';

  function handleSignOut() {
    toast.promise(signOut, {
      loading: 'Signing out...',
      success: 'Sign out successful!',
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  }

  return (
    // here the pathname is used as key to toggle ( re-render ) the dropdown on route change
    <Dropdown
      className="!h-8 md:!h-9"
      placement="bottom-end"
      shadow="xl"
      key={pathname}
    >
      <Dropdown.Trigger
        className="h-8 md:h-9"
        role="button"
        aria-label="auth dropdown button"
        as="button"
      >
        <Button as="span" variant="text" className="h-8 md:h-9 p-0">
          <Avatar
            name={`Profile picture of ${user?.name}` as string}
            src={userImage}
            className="ring-1 ring-muted rounded-md md:rounded-lg ring-offset-background flex ring-offset-2 [&_img]:ring-steel-100 !w-8 !h-8 md:!w-9 md:!h-9"
          />
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Menu className="space-y-1 border dark:border-steel-600/60 w-52 dark:bg-steel-700 dark:text-steel-300 border-steel-200/60">
        {AuthDropDownMenus.account.map((menu: AuthDropDownMenuType) => {
          if (menu.name === 'Admin' && user.roleNames[0] !== 'OWNER')
            return null;
          return (
            <Dropdown.Item
              disabled={user.roleNames[0] !== 'OWNER' && menu.name === 'Admin'}
              disabledClassName="bg-zinc-100"
              key={menu.href}
              activeClassName="text-steel-900 dark:text-white"
            >
              <menu.icon className="w-[18px] me-2 text-steel-400 h-auto" />
              <Link href={menu.href} className="w-full block text-start">
                <span className="truncate ">{menu.name}</span>
              </Link>
            </Dropdown.Item>
          );
        })}

        <Separator className="-mx-1.5" />

        {AuthDropDownMenus.static.map((menu: AuthDropDownMenuType) => (
          <Dropdown.Item
            key={menu.href}
            activeClassName="text-steel-900 dark:text-white"
          >
            <menu.icon className="w-[18px] me-2 text-steel-400 h-auto" />
            <Link href={menu.href} className="w-full block text-start">
              <span className="truncate">{menu.name}</span>
            </Link>
          </Dropdown.Item>
        ))}
        <Separator className="-mx-1.5" />
        <Dropdown.Item
          onClick={handleSignOut}
          activeClassName="text-steel-900 dark:text-white"
        >
          <RiLogoutBoxLine className="w-[18px] me-2 text-steel-400 h-auto" />
          <span className="truncate">Sign Out 🏃‍♂️</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
