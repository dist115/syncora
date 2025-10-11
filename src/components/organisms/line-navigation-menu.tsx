'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Menu } from '@/config/menus';
import { TEAM_PAGES } from '@/config/teams';
import { cn } from '@/lib/utils/cn';
import { useElementRePosition } from '@/hooks/useElementReposition';
import { LineMenuLink } from '@/components/atoms/line-menu-link';

function getIndexByValue(arr: any[], value: string) {
  return arr.findIndex((item) => item.href === value);
}
export default function LineNavigationMenu({
  menus,
  className,
}: {
  menus: Menu[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useElementRePosition({
    ref,
    activeTab: activeIndex,
  });

  const pathname = usePathname();

  useEffect(() => {
    setActiveIndex(getIndexByValue(menus, pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav
      aria-label="LineNavigationMenu"
      className={cn(
        'flex w-full -mt-5 md:-mt-3 mb-4 lg:-mt-3 md:mb-6 border-b border-steel-100 dark:border-steel-600/60',
        className
      )}
    >
      <div
        ref={ref}
        className="flex items-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {menus?.map((menu: Menu) => {
          if (
            process.env.NEXT_PUBLIC_ENABLE_TEAMS === 'false' &&
            TEAM_PAGES.includes(menu.href)
          )
            return null;

          return (
            <LineMenuLink
              key={menu.href}
              className="first:-ml-3 whitespace-nowrap z-40"
              {...menu}
            >
              {menu.name}
            </LineMenuLink>
          );
        })}
      </div>
    </nav>
  );
}
