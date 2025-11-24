'use client';

import { useState } from 'react';
import { CompleteFile, Folder } from '@/db/schema';
import { isEmpty } from 'lodash';
import { ArrowLeft, ChevronRight, SearchIcon } from 'lucide-react';
import { ActionIcon, Input, Text } from 'rizzui';

import { generateBreadcrumbs } from '@/lib/utils/generateBreadcrumbs';

import { EmptyFolderIcon } from '../atoms/icons/empty-folder';
import { FolderIcon } from '../atoms/icons/folder';
import { Box, Flex } from '../atoms/layout';
import { Breadcrumbs } from '../molecules/breadcrumbs/breadcrumbs';
import { useMoveFolder } from '../molecules/folder-action';

export function FolderTree({
  folders,
  parentFolder,
  file,
}: {
  folders: Folder[];
  parentFolder: Folder | null;
  file: CompleteFile;
}) {
  const [query, setQuery] = useState<string>('');
  const [currentFolder, setCurrentFolder] = useState<any>(parentFolder);
  const { setFolderID } = useMoveFolder();

  const subFolders = folders?.filter(
    (folder) =>
      (currentFolder?.id
        ? folder.parentId === currentFolder.id
        : folder.parentId === null) &&
      folder.name.toLowerCase().includes(query.toLowerCase()) &&
      folder.id !== file.id
  );

  const handleGoBack = () => {
    setCurrentFolder(
      folders.find((item) => item.id === currentFolder.parentId)
    );
    setFolderID(currentFolder?.parentId ?? null);
  };

  const breadcrumbs = generateBreadcrumbs(folders, currentFolder);

  return (
    <Box>
      <Input
        label="Select a destination folder."
        labelClassName="mb-3"
        placeholder="Search Folders"
        onChange={(e) => setQuery(e.target.value)}
        prefix={
          <SearchIcon strokeWidth={1.75} size={20} className="text-steel-500" />
        }
      />

      <Flex justify="start" className="mt-8">
        <ActionIcon
          variant="outline"
          onClick={handleGoBack}
          disabled={!currentFolder}
          type="button"
          className="shrink-0"
        >
          <ArrowLeft strokeWidth={1.75} size={20} />
        </ActionIcon>

        <Box className="w-[calc(100%-52px)]">
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            as="button"
            onClick={(item) => {
              setCurrentFolder(item);

              setFolderID(item?.id ?? null);
            }}
          />
        </Box>
      </Flex>

      <Box className="py-8">
        <Box className="flex flex-col gap-4 pr-1.5 -mr-1.5 overflow-x-hidden h-80 scrollbar-transparent">
          {subFolders?.map((folder) => {
            return (
              <button
                key={folder.id}
                type="button"
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => {
                  setCurrentFolder(folder);
                  setFolderID(folder.id);
                }}
              >
                <Flex justify="start">
                  <FolderIcon className="h-auto transition-all w-7 group-hover:scale-110 group-hover:brightness-105" />
                  <Text className="text-steel-700 dark:text-steel-100">
                    {folder.name}
                  </Text>
                </Flex>
                <ChevronRight
                  strokeWidth={1.75}
                  size={20}
                  className="transition-all text-steel-400 group-hover:text-steel-700 dark:group-hover:text-steel-300 group-hover:translate-x-0.5"
                />
              </button>
            );
          })}

          {isEmpty(subFolders) && (
            <Flex className="h-full grow" justify="center" direction="col">
              <EmptyFolderIcon className="w-16 h-auto" />
              <Text>No Folder Found!</Text>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}
