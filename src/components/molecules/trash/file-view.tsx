import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { CompleteFile } from '@/db/schema';
import { Text } from 'rizzui';

import { env } from '@/env.mjs';
import { cn } from '@/lib/utils/cn';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Checkbox } from '@/components/atoms/forms';
import { Box } from '@/components/atoms/layout';
import { TrashFileAction } from '@/components/molecules/trash-file-action';

export const TrashFileView = ({
  file,
  selectedFileFoldersIds,
  setSelectedFileFoldersIds,
}: {
  file: CompleteFile;
  selectedFileFoldersIds: string[];
  setSelectedFileFoldersIds: Dispatch<SetStateAction<string[]>>;
}) => {
  let fileUrl = file.fileName;
  if (file.fileName) {
    if (
      file.fileName?.startsWith('http') === false &&
      env.NEXT_PUBLIC_UPLOAD_URL
    ) {
      fileUrl = `${env.NEXT_PUBLIC_UPLOAD_URL}/${file.fileName}`;
    }
  }

  const fileType = file?.type as FileIconType | null;

  const isSelected = selectedFileFoldersIds.includes(file.id);

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedFileFoldersIds([...selectedFileFoldersIds, file.id]);
    } else {
      setSelectedFileFoldersIds(
        selectedFileFoldersIds.filter((id) => id !== file.id)
      );
    }
  }

  return (
    <Box
      className={cn(
        'relative flex flex-col items-center justify-center p-4 transition-all rounded-md group ',
        isSelected
          ? 'bg-steel-50 dark:bg-steel-700'
          : 'hover:bg-steel-50 dark:hover:bg-steel-700'
      )}
    >
      <Checkbox
        className={cn(
          'absolute top-4 left-4  duration-150 ',
          !isSelected && 'group-hover:opacity-100 xl:opacity-0'
        )}
        onChange={handleSelect}
      />
      <DynamicFileIcon className="h-14 w-auto" iconType={fileType} />
      <Text className="w-full mt-5 text-center truncate text-steel-700 dark:text-steel-100">
        {file.name}.{file.extension}
      </Text>

      <Box
        className={cn(
          'absolute  duration-150  top-3 right-2',
          !isSelected && 'group-hover:opacity-100 xl:opacity-0'
        )}
      >
        <TrashFileAction file={file} />
      </Box>
    </Box>
  );
};
