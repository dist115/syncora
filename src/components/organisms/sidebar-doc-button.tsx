'use client';

import Link from 'next/link';
import { RiFileCopy2Fill } from 'react-icons/ri';
import { Button, Tooltip } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { useResizableLayout } from '@/components/atoms/resizable-layout/resizable-layout.utils';

import { Box } from '../atoms/layout/box';

export function SidebarDocButton({
  defaultCollapsed,
}: {
  defaultCollapsed?: boolean;
}) {
  const { isCollapsed } = useResizableLayout();

  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;

  return (
    <Tooltip
      content="Documentation"
      placement="right"
      className={cn(!IS_COLLAPSED && 'opacity-0')}
    >
      <Box
        className={cn(
          'w-full px-7 flex items-center justify-center',
          IS_COLLAPSED && 'px-2.5 mt-5'
        )}
      >
        <Link
          legacyBehavior
          // href="https://filekit-doc.vercel.app/"
          href="https://test.com"
          passHref
          className="outline-none inline-flex justify-center w-full"
        >
          <a target="_blank" className="inline-flex w-full">
            <Button
              variant="flat"
              as="span"
              className={cn(
                'w-full hover:bg-gray-300/70 dark:bg-gray-800/80 dark:hover:bg-gray-800 font-medium rounded-lg h-10 lg:h-12 px-4 whitespace-nowrap flex justify-center gap-2',
                IS_COLLAPSED && 'px-0 gap-0'
              )}
            >
              <RiFileCopy2Fill
                className={cn(
                  'w-4 h-auto text-custom-gray/90',
                  IS_COLLAPSED && 'w-5'
                )}
              />
              {!IS_COLLAPSED && <span>Documentation</span>}
            </Button>
          </a>
        </Link>
      </Box>
    </Tooltip>
  );
}
