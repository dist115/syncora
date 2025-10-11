'use client';

import { Tooltip } from 'rizzui';

import { Menu, SidebarMenus } from '@/config/menus';
import { cn } from '@/lib/utils/cn';
import { useResizableLayout } from '@/components/atoms/resizable-layout/resizable-layout.utils';
import { SidebarLink } from '@/components/atoms/sidebar-link';

export function SidebarMenu({
  currentTeam,
  defaultCollapsed = false,
}: {
  currentTeam: any;
  defaultCollapsed?: boolean;
}) {
  const { isCollapsed } = useResizableLayout(defaultCollapsed);

  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;

  return (
    <ul
      className={cn('duration-300 space-y-2', IS_COLLAPSED ? 'px-3' : 'px-5')}
    >
      {SidebarMenus.map((menu: Menu) => {
        if (currentTeam) {
          return (
            <Tooltip
              key={menu.href}
              placement="right"
              content={menu.name}
              className={cn(!IS_COLLAPSED && 'opacity-0')}
            >
              <li>
                <SidebarLink
                  className={cn(
                    'whitespace-nowrap',
                    IS_COLLAPSED && 'px-1 gap-0 justify-center'
                  )}
                  {...menu}
                >
                  {menu.icon && (
                    <menu.icon className="flex-shrink-0 w-5 h-auto text-custom-gray/90" />
                  )}
                  {!IS_COLLAPSED && menu.name}
                </SidebarLink>
              </li>
            </Tooltip>
          );
        } else if (menu.name !== 'Manage Team') {
          return (
            <Tooltip
              key={menu.href}
              placement="right"
              content={menu.name}
              className={cn(!IS_COLLAPSED && 'opacity-0')}
            >
              <li>
                <SidebarLink
                  className={cn(
                    'whitespace-nowrap',
                    IS_COLLAPSED && 'px-1 gap-0 justify-center'
                  )}
                  {...menu}
                >
                  {menu.icon && (
                    <menu.icon className="flex-shrink-0 w-5 h-auto text-custom-gray/90" />
                  )}
                  {!IS_COLLAPSED && menu.name}
                </SidebarLink>
              </li>
            </Tooltip>
          );
        }
      })}
    </ul>
  );
}
