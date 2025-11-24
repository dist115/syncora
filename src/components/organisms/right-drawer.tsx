'use client';

import { XIcon } from 'lucide-react';
import { ActionIcon, Drawer, Text, Title } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { Flex } from '@/components/atoms/layout';

export const RightDrawer = () => {
  const { open, closeDrawer, component, title, description, props } =
    useDrawer();

  const Component = component;
  const hasProps = props && Object.keys(props).length > 0;

  return (
    <Drawer
      isOpen={open}
      onClose={closeDrawer}
      overlayClassName="!opacity-30 dark:!opacity-50"
      containerClassName="dark:bg-steel-800"
    >
      <Flex
        direction="col"
        align="stretch"
        justify="start"
        className="h-[100dvh] w-full relative gap-0"
      >
        <Flex
          align="start"
          justify="start"
          className="sticky top-0 left-0 w-full px-6 py-5 border-b border-steel-100 dark:border-steel-600 bg-steel-50/30 dark:bg-steel-700"
        >
          <Flex
            className="gap-0.5"
            direction="col"
            justify="start"
            align="stretch"
          >
            <Title className="capitalize text-xl font-semibold">{title}</Title>
            {description && <Text>{description}</Text>}
          </Flex>

          <ActionIcon
            variant="text"
            onClick={closeDrawer}
            className="w-auto h-auto py-0"
          >
            <XIcon
              className="transition-all text-steel-500 dark:text-steel-400 hover:text-steel-600 dark:hover:text-steel-300"
              strokeWidth={1.5}
              size={24}
            />
          </ActionIcon>
        </Flex>
        {component && (
          <Flex
            direction="col"
            align="stretch"
            justify="start"
            className="flex-1 overflow-y-auto"
          >
            {hasProps ? <Component {...props} /> : <Component />}
          </Flex>
        )}
      </Flex>
    </Drawer>
  );
};
