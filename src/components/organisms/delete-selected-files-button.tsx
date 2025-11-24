'use client';

import { useState, useTransition } from 'react';
import { deleteAllTrashedFiles } from '@/server/actions/files.action';
import { PiWarningFill } from 'react-icons/pi';
import { Button, Modal, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Box } from '@/components/atoms/layout/box';
import { Flex } from '@/components/atoms/layout/flex';

type Props = {
  selectedFileFolderIds: string[];
  onSuccess?: () => void;
};
export function DeleteSelectedFilesButton({
  selectedFileFolderIds,
  onSuccess,
}: Props) {
  const [modalState, setModalState] = useState(false);
  const isMd = useMediaQuery('(min-width:768px)');
  const isMultiple = selectedFileFolderIds.length > 1;

  const buttonSize = isMd ? 'md' : 'sm';

  const [isPending, startTransition] = useTransition();

  function handleDeleteSelected() {
    startTransition(async () => {
      try {
        await deleteAllTrashedFiles(selectedFileFolderIds);
        onSuccess?.();
        toast.success(MESSAGES.TRASH_SELECTED_FILES_DELETED);
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
        size={buttonSize}
        color="danger"
        variant="outline"
        onClick={() => setModalState(true)}
      >
        Delete Selected
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
                Delete Selected Files
              </Text>
              <Text className="text-[#475569] dark:text-gray-300 text-base">
                Are you sure to want to delete selected{' '}
                {isMultiple ? 'files' : 'file'}? This action will permanently
                delete {isMultiple ? 'all' : ''} {isMultiple ? 'these' : 'the'}{' '}
                selected {isMultiple ? 'files' : 'file'}{' '}
                {isMultiple ? 'and' : 'or'} {isMultiple ? 'folders' : 'folder'}{' '}
                forever from trash.
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
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
