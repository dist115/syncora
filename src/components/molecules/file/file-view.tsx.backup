import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import { CompleteFile, Folder } from '@/db/schema';
import { format } from 'date-fns/format';
import { User } from 'lucia';
import {
  ArrowDownToLine,
  LockIcon,
  PanelLeftOpenIcon,
  Share2Icon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import prettyBytes from 'pretty-bytes';
import { ActionIcon, Button, Modal, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import { Draggable } from '@/components/atoms/draggable';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Checkbox } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import Image from '@/components/atoms/next/image';
import { FolderAction } from '@/components/molecules/folder-action';
import FileDetails from '@/components/organisms/file-details';

export const FileView = ({
  file,
  folders,
  user,
  layout = 'grid',
  permissions,
  currentTeam,
  selectedFileFolderIds,
  setSelectedFileFolderIds,
}: {
  file: CompleteFile;
  layout?: string;
  folders: Folder[];
  user: User;
  permissions?: any;
  currentTeam?: any;
  selectedFileFolderIds: string[];
  setSelectedFileFolderIds: Dispatch<SetStateAction<string[]>>;
}) => {
  const router = useRouter();

  const [modalState, setModalState] = useState(false);
  const [detailsState, setDetailsState] = useState(true);
  const imageUrl = getR2FileLink(file.fileName);

  const parentFolder =
    folders.find((item) => item.id === file.parentId) ?? null;

  const iconType = file.type as FileIconType | null;

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
          <button
            className="flex flex-col items-center justify-center w-full text-center"
            onClick={() => router.push(`/preview/${file.id}`)}
          >
            <Box className="relative h-14 w-auto">
              <DynamicFileIcon
                className="w-auto h-full shrink-0"
                iconType={iconType}
              />
            </Box>

            <Flex justify="center" className="w-full gap-0 mt-5">
              <Text className="text-steel-700 dark:text-steel-300 truncate">
                {file.name}.
              </Text>
              <Text className="text-steel-700 dark:text-steel-300">
                {file.extension}
              </Text>
            </Flex>
          </button>
          <Box
            className={cn(
              'absolute transition-all pointer-events-none group-hover:pointer-events-auto top-3 right-2',
              !isSelected && 'xl:opacity-0 group-hover:opacity-100'
            )}
          >
            <FolderAction
              file={file}
              folders={folders}
              parentFolder={parentFolder}
              user={user}
              permissions={permissions}
              currentTeam={currentTeam}
            />
          </Box>
        </Box>
      ) : (
        <Box
          className={cn(
            'grid grid-cols-[1fr_200px_200px_200px_200px_50px] transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60',
            isSelected && 'bg-steel-50 dark:bg-steel-700'
          )}
        >
          <Flex>
            <Text as="span" className="w-6 pl-3">
              <Checkbox onChange={handleSelect} checked={isSelected} />
            </Text>
            <button
              className="flex px-2.5 items-center w-full gap-4 text-left transition-all hover:underline underline-offset-2"
              onClick={() => router.push(`/preview/${file.id}`)}
            >
              <Box className="w-5 shrink-0 py-2">
                <DynamicFileIcon
                  className="w-full h-auto shrink-0"
                  iconType={iconType}
                />
              </Box>
              <Flex className="gap-0 w-full " justify="start">
                <Text className="max-w-[20ch] 3xl:max-w-[35ch] truncate text-steel-700 dark:text-steel-300">
                  {file.name}.
                </Text>
                <Text className="text-steel-700 dark:text-steel-300">
                  {file.extension}
                </Text>
              </Flex>
            </button>
          </Flex>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {file?.user?.name}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file.updatedAt, 'MMM dd, yyyy')}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number)}
          </Text>{' '}
          {file?.isPublic ? (
            <Flex
              justify="start"
              className="gap-1.5 px-2.5 border-l border-r border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5"
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
              className="gap-1.5 px-2.5 border-l border-r border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5"
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
              user={user}
            />
          </Flex>
        </Box>
      )}

      <Modal
        isOpen={modalState}
        onClose={() => {
          setModalState(false);
        }}
        size="full"
        containerClassName="bg-white h-[100dvh] dark:bg-steel-800"
        overlayClassName="hidden"
      >
        <Box className="flex items-center justify-between px-6 border-b border-steel-100 dark:border-steel-600/60dark:border-steel-600/60 bg-steel-50/30 dark:bg-steel-700 h-14">
          <Flex className="gap-0" justify="start">
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
            >
              <Share2Icon
                className="mr-2 text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
                size={18}
              />
              Share
            </Button>
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
            >
              <Link className="flex items-center" href={imageUrl}>
                <ArrowDownToLine
                  className="mr-2 text-steel-500 dark:text-steel-400"
                  strokeWidth={1.5}
                  size={18}
                />
                Download
              </Link>
            </Button>
          </Flex>

          <Flex className="w-auto gap-3" justify="start">
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
              onClick={() => setDetailsState((prev) => !prev)}
            >
              <PanelLeftOpenIcon
                className="mr-2 text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
                size={18}
              />
              <span>Info</span>
            </Button>

            <ActionIcon
              className="rounded hover:bg-steel-100/50 dark:hover:bg-steel-600/50"
              variant="text"
              onClick={() => {
                setModalState(false);
              }}
            >
              <XIcon
                className="text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
              />
            </ActionIcon>
          </Flex>
        </Box>

        <Box
          className={cn(
            'h-[calc(100%-56px)] w-full grid grid-cols-[1fr_400px]',
            detailsState
              ? 'grid-cols-[1fr_400px] overflow-hidden'
              : 'grid-cols-1'
          )}
        >
          {file.type === 'image' && file.mime !== 'image/svg+xml' ? (
            <Box className="relative w-full h-full bg-steel-50 dark:bg-steel-800">
              <Image
                src={imageUrl ?? ''}
                alt={file.name}
                className="object-contain !w-auto !h-auto m-auto max-w-full max-h-full"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Box>
          ) : file.type === 'video' ? (
            <Box className="flex items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <video
                controls
                className="w-auto h-auto max-w-full max-h-full m-auto"
              >
                <source src={imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : file.type === 'audio' ? (
            <Box className="flex items-center justify-center w-full h-full">
              <audio controls className="w-[420px] max-w-full">
                <source src={imageUrl} />
                Your browser does not support the audio tag.
              </audio>
            </Box>
          ) : (
            <Box className="flex flex-col items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <Flex direction="col" className="gap-4 mb-8">
                <DynamicFileIcon className="w-14 h-auto" iconType={iconType} />
                <Text>
                  {file.name}.{file.extension}
                </Text>
              </Flex>
              <Text className="mb-8">
                Hmm… looks like this file doesn&apos;t have a preview we can
                show you.
              </Text>
              <Button>
                <Link className="flex items-center" href={imageUrl}>
                  <ArrowDownToLine
                    className="mr-2"
                    strokeWidth={1.5}
                    size={18}
                  />
                  Download
                </Link>
              </Button>
            </Box>
          )}

          {detailsState && (
            <FileDetails
              file={file}
              user={user}
              setDetailsState={setDetailsState}
            />
          )}
        </Box>
      </Modal>
    </Draggable>
  );
};
