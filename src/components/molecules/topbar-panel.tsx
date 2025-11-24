'use client';

import { Flex } from '@/components/atoms/layout';
import ThemeSwitcher from '@/components/molecules/theme-switcher';

export function TopBarPanel({}: { notificationCount?: string }) {
  return (
    <Flex justify="start" className="w-auto gap-5">
      <ThemeSwitcher />
    </Flex>
  );
}
