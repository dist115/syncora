import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { CompleteFile } from '@/db/schema';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Checkbox } from '@/components/atoms/forms';
import { FolderIcon } from '@/components/atoms/icons/folder';
import { Box } from '@/components/atoms/layout';
import { TrashFileAction } from '@/components/molecules/trash-file-action';

export const TrashFolderView = ({
  file,
  selectedFileFoldersIds,
  setSelectedFileFoldersIds,
}: {
  file: CompleteFile;
  selectedFileFoldersIds: string[];
  setSelectedFileFoldersIds: Dispatch<SetStateAction<string[]>>;
}) => {
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
        'relative flex flex-col items-center justify-center p-4 transition-all rounded-md group',
        isSelected
          ? ' bg-steel-50 dark:bg-steel-700'
          : ' hover:bg-steel-50 dark:hover:bg-steel-700'
      )}
    >
      <Checkbox
        className={cn(
          'absolute top-4 left-4  duration-150 ',
          !isSelected && 'group-hover:opacity-100 xl:opacity-0'
        )}
        onChange={handleSelect}
      />
      <Box className="flex flex-col items-center justify-center w-full text-center">
        <FolderIcon className="w-14 h-auto" />

        <Text className="w-full mt-5 text-center truncate text-steel-700 dark:text-steel-100">
          {file.name}
        </Text>
      </Box>
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
