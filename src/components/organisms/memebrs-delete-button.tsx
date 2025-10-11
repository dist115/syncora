'use client';

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { removeAllMembers } from '@/server/actions/team.action';
import { Placement } from '@floating-ui/react';
import { isEmpty } from 'lodash';
import { Button, Modal, Popover, Text, Title } from 'rizzui';
import { toast } from 'sonner';

import { handleError } from '@/lib/utils/error';
import { useIsClient } from '@/hooks/useIsClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Box, Flex } from '@/components/atoms/layout';

export const MembersDeleteButton = ({ members }: { members: any[] }) => {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExtraSmall = useMediaQuery('(max-width:600px )');
  const isClient = useIsClient();

  function handleDelete(setOpen: Dispatch<SetStateAction<boolean>>) {
    startTransition(async () => {
      try {
        await removeAllMembers(members);
        toast.success('All members deleted successfully');
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    });
  }

  if (!isClient) return null;

  if (isExtraSmall) {
    return (
      <>
        <Button
          className="h-[42px] whitespace-nowrap"
          disabled={isEmpty(members)}
          color="danger"
          onClick={() => setIsModalOpen(true)}
        >
          Delete All
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          containerClassName="bg-white dark:bg-steel-800"
        >
          <Box className="p-4">
            <Title className="mb-2 text-lg font-semibold">
              Delete all members?
            </Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete all members?
            </Text>
            <Flex className="gap-3 mt-6" justify="end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={() => handleDelete(setIsModalOpen)}
                variant="flat"
                color="danger"
              >
                Delete
              </Button>
            </Flex>
          </Box>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Popover placement={'left-center' as Placement}>
        <Popover.Trigger>
          <Button
            className="h-[42px] whitespace-nowrap"
            disabled={isEmpty(members)}
            color="danger"
          >
            Delete All
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          {({ setOpen }) => (
            <div className="w-56">
              <Title className="mb-2 text-xl"> Delete all members?</Title>
              <Text> Are you sure you want to delete all members?</Text>
              <div className="flex justify-end gap-3 mb-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  No
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  isLoading={isPending}
                  onClick={() => handleDelete(setOpen)}
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover>
    </>
  );
};
