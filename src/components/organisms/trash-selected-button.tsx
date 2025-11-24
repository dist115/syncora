'use client';

import { useTransition } from 'react';
import { moveMultipleToTrash } from '@/server/actions/folders.action';
import { Button } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';

type Props = {
  selectedFileFolderIds: string[];
};

export function TrashSelectedButton({ selectedFileFolderIds }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleMultipleTrash() {
    startTransition(async () => {
      try {
        await moveMultipleToTrash(selectedFileFolderIds);
        toast.success(MESSAGES.TRASH_SELECTED_SUCCESS);
      } catch (error) {
        handleError(error);
      }
    });
  }
  return (
    <Button
      isLoading={isPending}
      onClick={handleMultipleTrash}
      variant="outline"
      color="danger"
    >
      Trash Selected
    </Button>
  );
}
