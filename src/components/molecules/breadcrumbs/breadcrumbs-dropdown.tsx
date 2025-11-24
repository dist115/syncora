'use client';

import { Fragment } from 'react';
import { CompleteBreadcrumbs } from '@/db/schema';
import { Menu, Transition } from '@headlessui/react';
import { FolderIcon, HardDriveIcon, MoreHorizontal } from 'lucide-react';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { Box } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';

import { BreadcrumbsType } from './breadcrumbs';

function DropdownItems({
  as,
  onClick,
  children,
  href,
}: {
  as?: BreadcrumbsType;
  onClick?: () => void;
  children: React.ReactNode;
  href?: any;
}) {
  if (as === 'link') {
    return (
      <Menu.Item>
        {({ active }) => (
          <Link
            href={href}
            className={cn(
              'relative flex cursor-pointer select-none items-center justify-start space-x-2 px-4 py-2.5 text-sm text-steel-500 dark:text-steel-300 transition-colors',
              { 'bg-steel-50 dark:bg-steel-700': active }
            )}
          >
            {children}
          </Link>
        )}
      </Menu.Item>
    );
  }

  if (as === 'button') {
    return (
      <Menu.Item as="button" type="button" onClick={onClick}>
        {({ active }) => (
          <Box
            className={cn(
              'relative flex cursor-pointer select-none items-center justify-start space-x-2 px-4 py-2.5 text-sm text-steel-500 dark:text-steel-300 transition-colors',
              { 'bg-steel-50 dark:bg-steel-700': active }
            )}
          >
            {children}
          </Box>
        )}
      </Menu.Item>
    );
  }

  return null;
}

export function BreadcrumbsDropDown({
  breadcrumbs,
  as = 'link',
  onClick,
}: {
  breadcrumbs: CompleteBreadcrumbs[];
  as?: BreadcrumbsType;
  onClick?: (value?: any) => void;
}) {
  return (
    <Menu as="div" className="relative flex">
      <Menu.Button
        className="px-1 -mr-1 transition-all rounded cursor-pointer text-steel-700 dark:text-steel-100 hover:bg-steel-50 dark:hover:bg-steel-700"
        title="Show Folders"
      >
        <MoreHorizontal strokeWidth={1.5} size={24} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 flex flex-col mt-2 overflow-hidden origin-top-right bg-white border rounded-md w-52 top-full dark:bg-steel-800 focus:outline-none border-steel-200 dark:border-steel-600">
          <DropdownItems
            as={as}
            {...(as === 'button'
              ? { onClick: onClick ? () => onClick(null) : undefined }
              : { href: PAGES.DASHBOARD.FILES })}
          >
            <HardDriveIcon className="shrink-0" strokeWidth={1.5} size={20} />
            <span className="truncate">File Manager</span>
          </DropdownItems>

          {breadcrumbs.slice(0, -3).map((item, index) => (
            <DropdownItems
              key={index}
              as={as}
              {...(as === 'button'
                ? { onClick: onClick ? () => onClick(item) : undefined }
                : { href: PAGES.DASHBOARD.FOLDERS + '/' + item.id })}
            >
              <FolderIcon className="shrink-0" strokeWidth={1.5} size={20} />
              <span className="truncate">{item.name}</span>
            </DropdownItems>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
