'use client';

import Link from 'next/link';
import { makeFileFavourite } from '@/server/actions/files.action';
import { RiAddCircleFill, RiStarFill, RiStarLine } from 'react-icons/ri';
import { ActionIcon, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { PAGES } from '@/config/pages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import { FolderYellowIcon } from '@/components/atoms/icons/folder-yellow';
import { Box, Flex } from '@/components/atoms/layout';
import SimpleBar from '@/components/atoms/simplebar';
import { Fallback } from '@/components/molecules/Fallback';
import { FolderAction } from '@/components/molecules/folder-action';
import { CreateFolderForm } from '@/components/organisms/forms/create-folder-form';

import { NoFolderIllustration } from '../atoms/illustrations/fallbacks/no-folder-illustration';

const drawerTitle = 'Add new folder';
const drawerDescription = 'Add your folder.';
export function DashboardFolderWidget({ folders }: { folders: any[] }) {
  const { openDrawer } = useDrawer();
  return (
    <Box className="col-span-9">
      <Flex align="center" className="mb-3 lg:mb-6">
        <Flex align="center" justify="start" className="w-auto gap-2">
          <Text className="font-bold lg:text-lg text-custom-black dark:text-slate-300">
            Folders
          </Text>
          <ActionIcon
            aria-label="Add Folder Button"
            onClick={() => {
              openDrawer(CreateFolderForm, drawerTitle, drawerDescription, {
                parentId: null,
              });
            }}
            className="p-0 bg-transparent dark:bg-transparent dark:hover:bg-transparent hover:bg-transparent w-auto h-auto text-[#F5AD1D]"
          >
            <RiAddCircleFill size={24} />
          </ActionIcon>
        </Flex>
        <Text className="font-medium dark:text-gray-300">
          <Link href={PAGES.DASHBOARD.FILES}>See All</Link>
        </Text>
      </Flex>

      {folders.length ? (
        <SimpleBar>
          <div className="flex gap-5">
            {folders.map((folder) => {
              if (!folder.parentId)
                return (
                  <FolderCard
                    folders={folders}
                    key={folder.id}
                    folder={folder}
                  />
                );
            })}
          </div>
        </SimpleBar>
      ) : (
        <Flex className="h-[162px] mt-8" justify="center" align="end">
          <Fallback
            illustration={NoFolderIllustration}
            illustrationClassName="w-[146px] h-auto"
            title="No Folders"
            subtitle="Please start creating folder"
          />
        </Flex>
      )}
    </Box>
  );
}

function FolderCard({ folder, folders }: { folder: any; folders: any[] }) {
  const folderSlug = PAGES.DASHBOARD.FOLDERS + '/' + folder.id;
  const handleFavourite = async () => {
    const currentFavStatus = folder.isFavourite;
    toast.promise(() => makeFileFavourite(folder.id, !folder.isFavourite), {
      loading: currentFavStatus
        ? `Folder removing from favourite...`
        : `Folder adding to favourite...`,
      success: () => {
        return currentFavStatus
          ? `Folder removed from favourite`
          : `Folder added to favourite`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  };

  const nestedItemsSize = formatFileSize(
    folder.totalFileCount === 0 ? 0 : folder.fileSize
  );

  return (
    <Flex
      direction="col"
      align="start"
      className="rounded-xl shrink-0 w-[267.5px] gap-0 border border-steel-100 dark:border-steel-600/60 p-6 relative"
    >
      <ActionIcon
        aria-label="Favourite Folder Button"
        size="sm"
        variant="text"
        rounded="full"
        className="absolute top-5 right-5"
        onClick={handleFavourite}
      >
        {folder.isFavourite ? (
          <RiStarFill size={20} />
        ) : (
          <RiStarLine size={20} />
        )}
      </ActionIcon>
      <Text as="span" className="absolute bottom-8 right-5">
        <FolderAction
          excludeOptions={['favourite']}
          file={folder}
          folders={folders}
          parentFolder={folder.parentId}
        />
      </Text>
      <Link href={folderSlug}>
        <Flex justify="between">
          <FolderYellowIcon className="w-10 h-auto" />
        </Flex>
        <Flex direction="col" align="start" className="gap-1 mt-7">
          <Text className="text-sm font-medium text-custom-black dark:text-slate-300 max-w-[17ch] truncate">
            {folder.name}
          </Text>
          <Text className="text-sm text-[#475569] dark:text-slate-400">
            {nestedItemsSize} - {folder.totalFileCount}{' '}
            {folder.totalFileCount > 1 ? 'items' : 'item'}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
}
