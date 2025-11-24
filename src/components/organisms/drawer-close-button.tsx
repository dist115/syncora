'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ActionIcon } from 'rizzui';

import { useDrawerState } from '@/lib/store/drawer.store';

export function DrawerCloseButton() {
  const { closeDrawer } = useDrawerState();
  return (
    <ActionIcon
      as="button"
      onClick={closeDrawer}
      variant="text"
      className="px-0 ms-auto"
    >
      <XMarkIcon className="ms-auto w-6 h-auto" />
    </ActionIcon>
  );
}
