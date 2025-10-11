'use client';

import { XIcon } from 'lucide-react';
import { ActionIcon, Modal as RizzModal } from 'rizzui';

import { useModal } from '@/lib/store/modal.store';
import { Text, Title } from 'rizzui';
import { Flex } from '@/components/atoms/layout';

export function Modal() {
  const { open, closeModal, component, title, description, props } = useModal();

  const Component = component;
  const hasProps = props && Object.keys(props).length > 0;

  return (
    <RizzModal
      isOpen={open}
      onClose={closeModal}
      overlayClassName="!opacity-30 dark:!opacity-50"
      containerClassName="dark:bg-steel-800 !max-w-xl"
    >
      <Flex
        direction="col"
        align="stretch"
        justify="start"
        className="w-full relative gap-0"
      >
        <Flex
          align="start"
          justify="start"
          className="sticky w-full p-5 border-b rounded-t-xl dark:border-steel-600 bg-steel-50/30 dark:bg-steel-700 relative"
        >
          <Flex
            className="gap-0.5"
            direction="col"
            justify="center"
            align="center"
          >
            <Title className="text-sm font-medium text-steel-700">
              {title}
            </Title>
            {description && <Text>{description}</Text>}
          </Flex>

          <ActionIcon
            variant="text"
            onClick={closeModal}
            className="w-auto h-auto py-0 absolute end-5 top-5"
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
    </RizzModal>
  );
}