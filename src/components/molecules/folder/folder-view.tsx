import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { CompleteFile, Folder } from '@/db/schema';
import { format } from 'date-fns';
import { LockIcon, UsersIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { Draggable } from '@/components/atoms/draggable';
import { Checkbox } from '@/components/atoms/forms';
import { FolderIcon } from '@/components/atoms/icons/folder';
import { FolderOpenIcon } from '@/components/atoms/icons/folder-open';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';
import { FolderAction } from '@/components/molecules/folder-action';

export const FolderView = ({
  file,
  folders,
  isDropping,
  layout = 'grid',
  permissions,
  currentTeam,
  selectedFileFolderIds,
  setSelectedFileFolderIds,
}: {
  file: CompleteFile;
  isDropping?: boolean;
  layout?: string;
  folders: Folder[];
  permissions?: any;
  currentTeam?: any;
  selectedFileFolderIds: string[];
  setSelectedFileFolderIds: Dispatch<SetStateAction<string[]>>;
}) => {
  const folderSlug = PAGES.DASHBOARD.FOLDERS + '/' + file.id;

  const parentFolder =
    folders.find((item) => item.id === file.parentId) ?? null;

  const isSelected = selectedFileFolderIds.includes(file.id);

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedFileFolderIds([...selectedFileFolderIds, file.id]);
    } else {
      setSelectedFileFolderIds(
        selectedFileFolderIds.filter((id: string) => id !== file.id)
      );
    }
  }

  return (
    <Draggable id={file.id} data={file}>
      {layout === 'grid' ? (
        <Box
          className={cn(
            'relative flex flex-col items-center justify-center p-4 transition-all rounded-md group hover:bg-steel-50 dark:hover:bg-steel-700',
            isSelected && 'bg-steel-50 dark:bg-steel-700'
          )}
        >
          <Checkbox
            className={cn(
              'absolute top-4 left-4  duration-150',
              !isSelected && 'group-hover:opacity-100 xl:opacity-0'
            )}
            onChange={handleSelect}
            checked={isSelected}
          />
          <Link
            href={folderSlug}
            className="flex flex-col items-center justify-center w-full text-center"
          >
            {isDropping ? (
              <FolderOpenIcon className="w-14 h-auto scale-110" />
            ) : (
              <FolderIcon className="w-14 h-auto" />
            )}

            <Text className="w-full mt-5 text-center truncate text-steel-700 dark:text-steel-300">
              {file.name}
            </Text>
          </Link>
          <Box
            className={cn(
              'absolute transition-all pointer-events-none group-hover:pointer-events-auto  top-3 right-2',
              !isSelected && 'xl:opacity-0 group-hover:opacity-100'
            )}
          >
            <FolderAction
              file={file}
              folders={folders}
              parentFolder={parentFolder}
              permissions={permissions}
              currentTeam={currentTeam}
            />
          </Box>
        </Box>
      ) : (
        <Box
          className={cn(
            'grid grid-cols-[1fr_200px_200px_200px_200px_50px] gap-0 transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60 rounded',
            isSelected && 'bg-steel-50 dark:bg-steel-700'
          )}
        >
          <Flex>
            <Text as="span" className="w-6 pl-3">
              <Checkbox onChange={handleSelect} checked={isSelected} />
            </Text>
            <Link
              href={folderSlug}
              className="flex px-2.5 items-center w-full gap-4 transition-all hover:underline underline-offset-2"
            >
              <Box className="w-6 relative -left-0.5">
                {isDropping ? (
                  <FolderOpenIcon className="h-auto scale-110 w-6" />
                ) : (
                  <FolderIcon className="h-auto w-6" />
                )}
              </Box>
              <Text className="w-full max-w-[35ch] truncate text-steel-700 dark:text-steel-300">
                {file.name}
              </Text>
            </Link>
          </Flex>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {file?.user?.name}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file?.updatedAt, 'MMM dd, yyyy') || ' '}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number) || ' '}
          </Text>
          {file?.isPublic ? (
            <Flex
              justify="start"
              className="gap-1.5 px-2.5 border-l border-r border-steel-100 text-steel-700 dark:text-steel-300 py-1.5"
            >
              <UsersIcon
                className="text-steel-500 dark:text-steel-400"
                size={15}
                strokeWidth={2}
              />
              <Text>Shared</Text>
            </Flex>
          ) : (
            <Flex
              justify="start"
              className="gap-1.5 px-2.5 border-l border-r border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-2.5"
            >
              <LockIcon
                className="text-steel-500 dark:text-steel-400"
                size={15}
                strokeWidth={2}
              />
              <Text>Private</Text>
            </Flex>
          )}
          <Flex
            justify="end"
            className="px-2.5 text-steel-700 dark:text-steel-300 py-1.5"
          >
            <FolderAction
              file={file}
              folders={folders}
              parentFolder={parentFolder}
            />
          </Flex>
        </Box>
      )}
    </Draggable>
  );
};
