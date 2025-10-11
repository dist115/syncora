import { useState, useTransition } from 'react';
import { CompleteFile } from '@/db/schema';
import { folderDelete, folderRestore } from '@/server/actions/folders.action';
import { HistoryIcon, Trash2Icon } from 'lucide-react';
import { PiWarningFill } from 'react-icons/pi';
import { RiMore2Line } from 'react-icons/ri';
import { ActionIcon, Button, Dropdown, Modal, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';

import { Box, Flex } from '../atoms/layout';

interface TrashFileActionProps {
  file: CompleteFile;
}

export function TrashFileAction({ file }: TrashFileActionProps) {
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [modalState, setModalState] = useState(false);
  const handleRestore = () => {
    toast.promise(() => folderRestore(file.id), {
      loading: `${file?.type === 'folder' ? 'Folder' : 'File'} restoring...`,
      success: (file: any) => {
        return `${
          file?.type === 'folder' ? 'Folder' : 'File'
        } restored successfully.`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  };
  const handleDelete = async () => {
    try {
      await folderDelete(file.id);
      toast.success(
        `${file.type === 'folder' ? 'Folder' : 'File'} deleted permanently.`
      );
    } catch (error) {
      handleError(error);
    } finally {
      setModalState(false);
    }
  };

  return (
    <>
      <Dropdown shadow="xl" placement="bottom-end">
        <Dropdown.Trigger>
          <ActionIcon size="sm" variant="text" rounded="full">
            <RiMore2Line strokeWidth={0.5} size={20} />
          </ActionIcon>
        </Dropdown.Trigger>
        <Dropdown.Menu className="dark:bg-steel-700 grid grid-cols-1 gap-1">
          <Dropdown.Item onClick={handleRestore}>
            <HistoryIcon className="text-steel-400 me-1.5" size={18} />
            Restore
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setModalState(true)}>
            <Trash2Icon className="text-steel-400 me-1.5" size={20} />
            Delete forever
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        isOpen={modalState}
        onClose={() => {
          setModalState(false);
        }}
        containerClassName="bg-white dark:bg-steel-800"
      >
        <Box className="p-8 rounded-xl">
          <Flex justify="start" className="gap-4">
            <Flex
              justify="center"
              className="aspect-square w-[60px] bg-[#FFE2E4] rounded-full"
            >
              <PiWarningFill className="text-[#EE404C] w-8 h-8" />
            </Flex>
            <Box>
              <Text className="capitalize text-xl font-bold text-custom-black dark:text-white mb-2">
                Delete {file.type == 'folder' ? 'Folder' : 'File'} Permanently
              </Text>
              <Text className="text-[#475569] dark:text-gray-300 text-base">
                Are you sure to want to permanently delete this{' '}
                {file.type == 'folder' ? 'folder' : 'file'}?{' '}
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
              isLoading={isPendingDelete}
              onClick={() => startDeleteTransition(handleDelete)}
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}
