'use client';

import { RiUploadLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { UploadFileForm } from '@/components/organisms/forms/upload-file-form';

const title = 'Upload file';
const description = 'Add your files to upload';

export const UploadFileButton = ({
  parentId,
  availableStorage,
}: {
  parentId?: string | null;
  availableStorage?: number;
}) => {
  const { openDrawer } = useDrawer();

  return (
    <Button
      as="span"
      variant="text"
      aria-label='Upload File Button'
      onClick={() => {
        openDrawer(UploadFileForm, title, description, {
          parentId,
          availableStorage,
        });
      }}
      className="justify-start w-full h-auto px-0 py-0.5 text-sm font-normal dark:text-steel-100"
    >
      <RiUploadLine className="w-[18px] me-2 text-steel-400 h-auto" />
      Upload File
    </Button>
  );
};
