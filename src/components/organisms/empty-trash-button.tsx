'use client';

import { useState, useTransition } from 'react';
import { emptyTrash } from '@/server/actions/folders.action';
import { PiWarningFill } from 'react-icons/pi';
import { Button, Modal, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { cn } from '@/lib/utils/cn';
import { handleError } from '@/lib/utils/error';
import { Box } from '@/components/atoms/layout/box';
import { Flex } from '@/components/atoms/layout/flex';

type Props = {
  selectedFileFoldersIds: string[];
};

export function EmptyTrashButton({ selectedFileFoldersIds }: Props) {
  const [isPending, startTransition] = useTransition();
  const [modalState, setModalState] = useState(false);

  function handleEmptyTrash() {
    startTransition(async () => {
      try {
        await emptyTrash();
        toast.success(MESSAGES.TRASH_EMPTY_SUCCESS);
      } catch (error) {
        handleError(error);
      } finally {
        setModalState(false);
      }
    });
  }

  return (
    <>
      <Button
        color="danger"
        variant="outline"
        className={cn('px-2.5 py-1 text-xs h-8 md:px-4 md:py-2 md:text-sm md:h-10' ,
          selectedFileFoldersIds.length ? 'col-span-1' : 'col-span-full'
        )}
        onClick={() => setModalState(true)}
      >
        Empty Trash
      </Button>
      <Modal
        isOpen={modalState}
        onClose={() => {
          setModalState(false);
        }}
        containerClassName="bg-white dark:bg-steel-800"
      >
        <Box className="p-8 rounded-xl">
          <Flex justify="start" align="start" className="gap-4">
            <Flex
              justify="center"
              className="aspect-square w-[60px] shrink-0 bg-[#FFE2E4] rounded-full"
            >
              <PiWarningFill className="text-[#EE404C] w-8 h-8" />
            </Flex>
            <Box>
              <Text className="capitalize text-xl font-bold text-custom-black dark:text-white mb-2">
                Empty Trash
              </Text>
              <Text className="text-[#475569] dark:text-gray-300 text-base">
                Are you sure to want to empty the trash? This action will
                permanently delete all files and folders forever from trash.
              </Text>
            </Box>
          </Flex>
          <Flex justify="end" className="mt-8">
            <Button
              className="bg-[#F1F5F9] hover:bg-[#e8ecee]  text-black"
              onClick={() => setModalState(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#EE404C] hover:bg-[#dd3b46] dark:bg-[#EE404C] dark:hover:bg-[#dd3b46] text-white"
              isLoading={isPending}
              onClick={handleEmptyTrash}
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
