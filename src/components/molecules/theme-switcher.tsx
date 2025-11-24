'use client';

import { useTheme } from 'next-themes';
import { RiComputerLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import { ActionIcon, Dropdown } from 'rizzui';

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <Dropdown
      placement="bottom-end"
      shadow="xl"
      className="flex items-center justify-center w-8 md:w-9 h-8 md:h-9 border rounded-md md:rounded-lg border-steel-100 dark:border-steel-600"
    >
      <Dropdown.Trigger
        as="button"
        aria-label="Switch theme Button"
        className="flex items-center justify-center"
      >
        <ActionIcon as="span" variant="text">
          <RiSunLine className="w-3.5 md:w-5 h-3.5 md:h-5 dark:hidden" />
          <RiMoonLine className="absolute hidden w-3.5 md:w-5 h-3.5 md:h-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </ActionIcon>
      </Dropdown.Trigger>
      <Dropdown.Menu className="dark:bg-steel-700">
        <Dropdown.Item
          onClick={() => setTheme('light')}
          activeClassName="text-steel-900 dark:text-white"
        >
          <RiSunLine className="h-auto w-[18px] me-1.5 text-steel-400" /> Light
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setTheme('dark')}
          activeClassName="text-steel-900 dark:text-white"
        >
          <RiMoonLine className="h-auto w-[18px] me-1.5 text-steel-400" /> Dark
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setTheme('system')}
          activeClassName="text-steel-900 dark:text-white"
        >
          <RiComputerLine className="h-auto w-[18px] me-1.5 text-steel-400" />{' '}
          System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
