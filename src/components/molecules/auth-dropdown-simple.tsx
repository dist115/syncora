'use client';

import React from 'react';
import { signOut } from '@/server/actions/auth.action';
import { useRouter } from 'next-nprogress-bar';
import {
  RiArrowDownSLine,
  RiFolderChartLine,
  RiLogoutBoxLine,
} from 'react-icons/ri';
import { Avatar, Button, Dropdown, Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import { Separator } from '@/components/atoms/separator';

const AuthDropDownMenus = [
  {
    name: 'Dashboard',
    href: PAGES.DASHBOARD.ROOT,
    icon: RiFolderChartLine,
  },
];

export function AuthDropdownLanding({
  user,
  isScrolled,
  arrowClassName,
}: {
  user: any;
  arrowClassName?: string;
  isScrolled?: boolean;
}) {
  const router = useRouter();

  const onMenuClick = (href: string) => {
    router.push(href);
  };

  const userImage = user?.image
    ? getR2FileLink(user?.image)
    : '/assets/avatars/avatar7.webp';

  return (
    <Dropdown
      inPortal={false}
      placement="bottom-end"
      shadow="xl"
      className="pb-2 mt-2"
    >
      <Dropdown.Trigger as="button" aria-label="Avatar dropdown button">
        <Button
          as="span"
          variant="text"
          className="h-auto p-0 mt-0.5  flex items-center gap-3 group [&_.rizzui-avatar-initials]:rounded-full"
        >
          <Avatar
            customSize={34}
            rounded="full"
            name={`Profile picture of ${user?.name}` as string}
            src={userImage}
            className={cn(
              'rounded-full duration-200 border-1 ring-1 ring-offset-2 ring-[#40C17B] ring-offset-[#141D25] border-[red]',
              isScrolled ? 'ring-offset-white' : 'ring-offset-[#141D25]'
            )}
          />
          <Text
            as="span"
            className={cn(
              'duration-200 font-medium',
              isScrolled ? 'text-[#141D25]' : 'text-white'
            )}
          >
            {user?.name}
          </Text>
          <RiArrowDownSLine
            size={20}
            className={cn(
              ' opacity-60 -ml-0.5 duration-200 group-hover:opacity-100',
              isScrolled ? 'text-[#141D25]' : 'text-white',
              arrowClassName
            )}
          />
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Menu className="space-y-1 border dark:border-steel-600/60 w-52 dark:bg-steel-700 dark:text-steel-300 border-steel-200/60">
        {AuthDropDownMenus.map((menu) => (
          <Dropdown.Item
            key={menu.href}
            onClick={() => onMenuClick(menu.href)}
            activeClassName="text-steel-900 dark:text-white"
          >
            <menu.icon className="w-[18px] me-2 text-steel-400 h-auto" />
            <span className="truncate">{menu.name}</span>
          </Dropdown.Item>
        ))}
        <Separator className="-mx-1.5" />
        <Dropdown.Item
          onClick={() => {
            signOut();
          }}
          activeClassName="text-steel-900 dark:text-white"
        >
          <RiLogoutBoxLine className="w-[18px] me-2 text-steel-400 h-auto" />
          <span className="truncate">Sign Out 🏃‍♂️</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
