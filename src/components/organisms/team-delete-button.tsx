'use client';

import { SetStateAction, useState, useTransition } from 'react';
import { deleteAllTeams } from '@/server/actions/team.action';
import { isEmpty } from 'lodash';
import { Button, Modal, Popover, Text, Title } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Box, Flex } from '@/components/atoms/layout';

export const TeamDeleteButton = ({
  teams,
  className,
}: {
  teams: any[];
  className?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExtraSmall = useMediaQuery('(max-width:424px )');

  function handleDelete(setOpen: (value: SetStateAction<boolean>) => void) {
    startTransition(async () => {
      try {
        await deleteAllTeams(teams);
        toast.success(MESSAGES.TEAM_DELETED_SUCCESSFULLY);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    });
  }

  if (isExtraSmall) {
    return (
      <>
        <Button
          disabled={isEmpty(teams)}
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
            <Title className="mb-2 text-lg font-semibold">Delete Users?</Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete all the selected users?
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
    <Popover placement="left">
      <Popover.Trigger>
        <Button disabled={isEmpty(teams)} color="danger" className={className}>
          Delete All
        </Button>
      </Popover.Trigger>

      <Popover.Content>
        {({ setOpen }) => (
          <>
            <Title className="mb-2 text-lg font-semibold">Delete Users?</Title>
            <Text className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete all the selected users?
            </Text>
            <Flex className="gap-3 mt-6" justify="end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={() => handleDelete(setOpen)}
                variant="flat"
                color="danger"
              >
                Delete
              </Button>
            </Flex>
          </>
        )}
      </Popover.Content>
    </Popover>
  );
};
