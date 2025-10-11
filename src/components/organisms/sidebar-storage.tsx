'use client';

import Link from 'next/link';
import { CurrentTeam } from '@/server/dto/teams.dto';
import { useTheme } from 'next-themes';
import { Button, Popover, Progressbar, Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { useIsClient } from '@/hooks/useIsClient';
import CircleProgressBar from '@/components/atoms/chart/circle-progressbar';
import { Box, Flex } from '@/components/atoms/layout';
import { useResizableLayout } from '@/components/atoms/resizable-layout/resizable-layout.utils';

export function SidebarStorage({
  progressValue,
  currentStorage,
  convertTotalStorage,
  currentTeam,
  defaultCollapsed = false,
}: {
  progressValue: number;
  currentStorage: string;
  convertTotalStorage: string;
  currentTeam: CurrentTeam | null;
  defaultCollapsed?: boolean;
}) {
  const { isCollapsed } = useResizableLayout();
  const { theme } = useTheme();
  const isClient = useIsClient();

  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;

  const isDark = isClient && theme === 'dark';

  if (IS_COLLAPSED) {
    return (
      <Popover placement="right">
        <Popover.Trigger>
          <Box className="aspect-[2/1.2] w-16 mx-auto px-2.5 mt-20 cursor-pointer">
            <CircleProgressBar
              percentage={progressValue}
              size={55}
              stroke={isDark ? '#3b404f' : '#1b1e271c'}
              strokeWidth={7}
              progressColor={isDark ? '#eaedf1' : '#1b1e27'}
              useParentResponsive={true}
              label={
                <Text
                  as="span"
                  className="font-medium text-xs text-gray-700 dark:text-gray-300"
                >
                  {progressValue.toFixed(0)}%
                </Text>
              }
            />
          </Box>
        </Popover.Trigger>
        <Popover.Content className="w-auto p-0 overflow-hidden border-0 rounded dark:bg-steel-700">
          <Box className="px-7 py-5">
            <Progressbar
              aria-label={`Usage progress`}
              value={progressValue}
              size="sm"
              barClassName="bg-steel-700 dark:bg-steel-100"
              className="bg-steel-200/60 dark:bg-steel-600/60"
            />
            <Text className="mt-3 mb-7 text-steel-700 dark:text-steel-300">
              {currentStorage} of {convertTotalStorage} used
            </Text>
            <Flex justify="center" className="w-full">
              <Link
                href={
                  currentTeam
                    ? PAGES.SETTINGS.TEAM.BILLING
                    : PAGES.SETTINGS.USER.BILLING
                }
                className="outline-none inline-flex justify-center w-auto lg:w-full"
              >
                <Button
                  as="span"
                  className="w-full font-medium rounded-lg h-10 lg:h-12 bg-custom-black dark:bg-steel-600/50 hover:dark:bg-steel-600/40 dark:text-white px-5"
                >
                  Get More Storage
                </Button>
              </Link>
            </Flex>
          </Box>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <Box className="px-7 mt-16 py-5">
      <Progressbar
        value={progressValue}
        aria-label={`Usage progress`}
        size="sm"
        barClassName="bg-steel-700 dark:bg-steel-100"
        className="bg-steel-200/60 dark:bg-steel-600/60"
      />
      <Text className="mt-3 mb-7 text-steel-700 dark:text-steel-300 whitespace-nowrap">
        {currentStorage} of {convertTotalStorage} used
      </Text>
      <Flex justify="center" className="w-full">
        <Link
          href={
            currentTeam
              ? PAGES.SETTINGS.TEAM.BILLING
              : PAGES.SETTINGS.USER.BILLING
          }
          className="outline-none inline-flex justify-center w-full"
        >
          <Button
            as="span"
            className="w-full font-medium rounded-lg h-10 lg:h-12 bg-custom-black dark:bg-steel-600/50 hover:dark:bg-steel-600/40 dark:text-white px-5 whitespace-nowrap"
          >
            Get More Storage
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}
