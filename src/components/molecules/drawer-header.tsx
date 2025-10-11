'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ActionIcon, Text, Title } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { Box } from '@/components/atoms/layout';

export function DrawerHeader({
  title,
  description,
  className,
  onClose,
}: {
  title: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}) {
  const { closeDrawer } = useDrawer();

  function close() {
    closeDrawer();
    onClose?.();
  }

  return (
    <Box
      className={cn(
        'flex w-full flex-col py-2.5 lg:py-5 px-3 lg:px-6 border-b border-steel-100 dark:border-steel-600 gap-5 sticky top-0 left-0',
        className
      )}
    >
      <Box className="flex items-center justify-between">
        <Title as="h2" className="text-xl font-semibold">
          {title}
        </Title>
        <ActionIcon variant="text" onClick={close}>
          <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-700 dark:text-gray-500 duration-150 dark:hover:text-gray-300" />
        </ActionIcon>
      </Box>
      {!!description && (
        <Text className="text-sm text-gray-800">{description}</Text>
      )}
    </Box>
  );
}
