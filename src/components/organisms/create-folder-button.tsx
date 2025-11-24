'use client';

import { RiFolderAddLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { CreateFolderForm } from '@/components/organisms/forms/create-folder-form';

const title = 'Add new folder';
const description = 'Add your folder.';

export const CreateFolderButton = ({
  parentId,
}: {
  parentId?: string | null;
}) => {
  const { openDrawer } = useDrawer();

  return (
    <Button
      as="span"
      variant="text"
      aria-label="Create Folder Button"
      onClick={() => {
        openDrawer(CreateFolderForm, title, description, { parentId });
      }}
      className="justify-start w-full h-auto px-0 py-0.5 text-sm font-normal  dark:text-steel-100"
    >
      <RiFolderAddLine className="w-[18px] me-2 text-steel-400 h-auto" />
      Create Folder
    </Button>
  );
};
