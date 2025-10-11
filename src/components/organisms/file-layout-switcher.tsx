'use client';

import { motion } from 'framer-motion';
import { RiLayoutGridLine, RiListCheck2 } from 'react-icons/ri';
import { ActionIcon } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { useFilesLayout } from '@/hooks/useFilesLayout';
import { Box } from '@/components/atoms/layout';

export type FilesLayoutType = 'grid' | 'list';

export function FileLayoutSwitcher({
  defaultLayout,
}: {
  defaultLayout: FilesLayoutType;
}) {
  const { layout, toggleLayout } = useFilesLayout();

  const LAYOUT = layout ?? defaultLayout;

  return (
    <Box className="flex items-center h-10 gap-2 p-1 border rounded-md border-muted">
      <ActionIcon
        aria-label="File list layout"
        size="sm"
        variant="text"
        className="relative"
        onClick={() => toggleLayout('list')}
      >
        {LAYOUT === 'list' && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 w-full h-full rounded shadow bg-primary md:z-0"
            layoutId="file_layout_active"
          />
        )}
        <RiListCheck2
          className={cn(
            'relative transition-all',
            LAYOUT === 'list'
              ? 'text-primary-foreground'
              : 'text-steel-700 dark:text-steel-400'
          )}
          size={18}
        />
      </ActionIcon>
      <ActionIcon
        aria-label="File grid layout"
        size="sm"
        variant="text"
        className="relative"
        onClick={() => toggleLayout('grid')}
      >
        {LAYOUT !== 'list' && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 w-full h-full rounded shadow bg-primary md:z-0"
            layoutId="file_layout_active"
          />
        )}
        <RiLayoutGridLine
          className={cn(
            'relative transition-all',
            LAYOUT !== 'list'
              ? 'text-primary-foreground'
              : 'text-steel-700 dark:text-steel-400'
          )}
          size={18}
        />
      </ActionIcon>
    </Box>
  );
}
