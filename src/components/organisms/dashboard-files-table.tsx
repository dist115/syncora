'use client';

import { useLayoutEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { CompleteFile } from '@/db/schema';
import {
  makeFileFavourite,
  makeFilePrivate,
  shareFile,
} from '@/server/actions/files.action';
import { moveToTrash } from '@/server/actions/folders.action';
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { CopyIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { PiWarningFill } from 'react-icons/pi';
import {
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiMore2Line,
  RiShareLine,
  RiStarFill,
  RiStarLine,
} from 'react-icons/ri';
import {
  ActionIcon,
  Button,
  Dropdown,
  Input,
  Loader,
  Modal,
  Switch,
  Text,
  Title,
} from 'rizzui';
import { toast } from 'sonner';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { PAGES } from '@/config/pages';
import { useDrawer } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { getS3FileLink } from '@/lib/utils/file';
import { copyToClipboard } from '@/lib/utils/index';
import useQueryParams from '@/hooks/useQueryParam';
import { FilesTableNoFileIllustration } from '@/components/atoms/illustrations/fallbacks/files-table-no-file-illustration';
import { Box, Flex } from '@/components/atoms/layout';
import { Table } from '@/components/atoms/table/table';
import { Fallback } from '@/components/molecules/Fallback';
import { RenameFile } from '@/components/organisms/forms/rename-file';

import { DynamicFileIcon, FileIconType } from '../atoms/dynamic-file-icon';

export const DashboardFilesTable = ({ files }: { files: any[] }) => {
  const { setQueryParams, queryParams } = useQueryParams();

  const [sorting, setSorting] = useState<SortingState>([]);

  useLayoutEffect(() => {
    if (sorting.length) {
      setQueryParams(
        {
          sort: sorting?.[0]?.id,
          order: sorting?.[0]?.desc === true ? 'desc' : 'asc',
        },
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const columns = useMemo<ColumnDef<CompleteFile>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        maxSize: 350,
        enableSorting: true,
        cell: ({ row }) => {
          const iconType = row.original.type as FileIconType | null;
          return (
            <Link href={`/preview/${row.original.id}`}>
              <Flex justify="start" className="gap-2.5 pl-3.5 py-1.5">
                <DynamicFileIcon
                  className="w-8 h-auto shrink-0"
                  iconType={iconType}
                />
                <Text className="max-w-[30ch] truncate text-custom-black dark:text-slate-300 font-medium ">
                  {row.original.name}
                </Text>
              </Flex>
            </Link>
          );
        },
      },
      {
        header: 'File Size',
        accessorKey: 'size',
        maxSize: 130,
        enableSorting: true,
        cell: ({ row }) => (
          <Text className="text-steel-400 dark:text-steel-400">
            {prettyBytes(row.original.fileSize || 0)}
          </Text>
        ),
      },
      {
        header: 'Type',
        accessorKey: 'type',
        maxSize: 100,
        enableSorting: false,
        cell: ({ row }) => (
          <Flex justify="start" className="gap-2">
            <Text className="text-steel-400 dark:text-steel-400">
              {row.original.type}
            </Text>
          </Flex>
        ),
      },
      {
        header: 'Modified',
        accessorKey: 'updatedAt',
        maxSize: 150,
        enableSorting: true,
        cell: ({ row }) => (
          <Flex direction="col" align="start" className="gap-1">
            <Text className="text-custom-black dark:text-slate-300 font-medium">
              {format(row.original.updatedAt, 'MMM dd, yyyy')}
            </Text>
            <Text className="text-steel-400 dark:text-steel-400 text-[13px]">
              {format(row.original.updatedAt, 'h:mm aaa')}
            </Text>
          </Flex>
        ),
      },
      {
        header: '',
        meta: {
          columnName: 'Operations',
        },
        accessorKey: 'id',
        maxSize: 100,
        enableSorting: false,
        cell: ({ row }) => (
          <Flex justify="end" className="pe-2 gap-2.5">
            <Action file={row.original} />
          </Flex>
        ),
      },
    ],
    []
  );

  // This state is for controlling the column visibility. default key is the keys of actual data (accessorKey)
  // Please save this object in DB and use it as columns initial state.
  // We also need to fire server action for column save btn (ui not implemented yet) on column control to save the columns
  // we will pass down the onClick method to the table as props so that on click the btn this object will save on the server
  const [columnVisibility, setColumnVisibility] = useState<{
    [key: string]: boolean;
  }>({
    createdAt: true,
    id: true,
    role: true,
    status: true,
    user_email: true,
    user_name: true,
  });

  const table = useReactTable({
    data: files,
    columns,
    manualSorting: true,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <Box>
      <Flex justify="between" align="center" className="mb-3 lg:mb-6">
        <Text className="font-bold lg:text-lg text-custom-black dark:text-slate-300">
          All Files
        </Text>
        <Button
          size="sm"
          className={cn(
            'duration-200 opacity-0 invisible ml-auto mr-1',
            !!table.getSelectedRowModel().rows.length && 'opacity-100 visible'
          )}
        >
          Delete {table.getSelectedRowModel().rows.length}{' '}
          {table.getSelectedRowModel().rows.length > 1 ? 'Files' : 'File'}
        </Button>
        <Text className="font-medium dark:text-gray-300">
          <Link href={PAGES.DASHBOARD.FILES}>See All</Link>
        </Text>{' '}
      </Flex>
      <Flex direction="col" align="stretch" className="w-full gap-0">
        <Box
          className={cn(
            '[&_table_thead]:border-0 first-of-type:[&_table_thead_tr_th]:px-6 first-of-type:[&_table_thead_tr_th]:py-5 [&_table_thead_tr_th]:font-semibold [&_table_thead]:border-b [&_table_thead]:border-steel-100 dark:[&_table_thead]:border-steel-600/60 [&_table_thead]:bg-[#F1F5F9]/0 dark:[&_table_thead]:bg-[#F1F5F9]/0 rounded-xl overflow-hidden border border-steel-100 dark:border-steel-600/60 [&_table]:border-0 [&_table_tbody]:divide-y-0 [&_table_tbody_tr_td]:py-[9.5px] [&_table_tbody_tr:hover]:bg-[#F1F5F9]/50 dark:[&_table_tbody_tr:hover]:bg-gray-600/10 [&_.table-control-wrapper]:hidden',
            !files.length && '[&_table_thead]:hidden'
          )}
        >
          <Table
            table={table}
            total={files.length}
            noDataFallback={
              <Fallback
                className="p-12"
                illustration={FilesTableNoFileIllustration}
                illustrationClassName="w-80 h-auto"
                title="No Files"
                subtitle="Please start uploading files"
              />
            }
          />
        </Box>
      </Flex>
    </Box>
  );
};

function Action({ file }: { file: CompleteFile }) {
  const [isPublicState, setIsPublicState] = useState(file.isPublic);
  const [shareLoading, setShareLoading] = useState(false);
  const [isPendingTrash, startTrashTransition] = useTransition();
  const [modalState, setModalState] = useState({
    isOpen: false,
    modalType: '',
  });
  const { openDrawer } = useDrawer();
  const { isOpen, modalType } = modalState;

  const handleTrash = () => {
    toast.promise(() => moveToTrash(file.id), {
      loading: `${
        file?.type === 'folder' ? 'Folder' : 'File'
      } moving to trash...`,
      success: (file: any) => {
        return `${file?.type === 'folder' ? 'Folder' : 'File'} moved to trash.`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  };
  const [sharableLink, setSharableLink] = useState(
    file.hash ? `${env.NEXT_PUBLIC_BASE_URL}/share/${file.hash}` : ``
  );

  const toggleFileShare = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setShareLoading(true);
    if (e.target.checked) {
      setIsPublicState(true);
      const sharedFile = await shareFile(file.id);
      if (sharedFile) {
        setSharableLink(
          sharedFile.hash
            ? `${env.NEXT_PUBLIC_BASE_URL}/share/${sharedFile.hash}`
            : ``
        );
      }
    } else {
      setIsPublicState(false);
      const privateFile = await makeFilePrivate(file.id);
      if (privateFile) {
        setSharableLink(``);
      }
    }

    setShareLoading(false);
  };

  const copySharableLink = () => {
    copyToClipboard(sharableLink, 'Sharable Link copied!');
  };

  const handleFavourite = async () => {
    const currentFavStatus = file.isFavourite;
    toast.promise(() => makeFileFavourite(file.id, !file.isFavourite), {
      loading: currentFavStatus
        ? `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } removing from favourite...`
        : `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } adding to favourite...`,
      success: () => {
        return currentFavStatus
          ? `${
              file?.type === 'folder' ? 'Folder' : 'File'
            } removed from favourite`
          : `${file?.type === 'folder' ? 'Folder' : 'File'} added to favourite`;
      },
      error: 'Something went wrong. Please Try again Later',
    });
  };

  const fileUrl = getS3FileLink(file.fileName);

  return (
    <>
      <ActionIcon
        aria-label="Favourite File Button"
        size="sm"
        variant="text"
        rounded="full"
        onClick={handleFavourite}
      >
        {file.isFavourite ? <RiStarFill size={20} /> : <RiStarLine size={20} />}
      </ActionIcon>
      <Dropdown shadow="xl" placement="bottom-end">
        <Dropdown.Trigger as="button" aria-label="File Actions Button">
          <ActionIcon as="span" size="sm" variant="text" rounded="full">
            <RiMore2Line strokeWidth={0.5} size={20} />
          </ActionIcon>
        </Dropdown.Trigger>
        <Dropdown.Menu className="dark:bg-steel-700 w-52 grid grid-cols-1 gap-1">
          {file.type !== 'folder' && (
            <Dropdown.Item
              onClick={() =>
                setModalState({ isOpen: true, modalType: 'share' })
              }
            >
              <RiShareLine className="text-steel-400 me-1.5" size={18} />
              Share & Get Link
            </Dropdown.Item>
          )}
          {file.type !== 'folder' && (
            <Dropdown.Item>
              <Link className="flex items-center w-full" href={fileUrl}>
                <RiDownloadLine className="mr-2 text-steel-400" size={18} />
                Download
              </Link>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            onClick={() =>
              openDrawer(RenameFile, 'Rename File', 'Change file/folder name', {
                file,
              })
            }
          >
            <RiEditLine className="text-steel-400 me-1.5" size={18} />
            Rename
          </Dropdown.Item>

          <Dropdown.Item onClick={handleTrash}>
            <RiDeleteBinLine className="text-steel-400 me-1.5" size={18} />
            Move to trash
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setModalState({ isOpen: false, modalType: '' });
        }}
        containerClassName="bg-white dark:bg-steel-800"
      >
        {modalType === 'share' && (
          <Box className="pt-6 pb-8 m-auto px-7">
            <Title className="mb-6 text-base">File Share</Title>
            <Text className="mb-4">
              Sharing this file will make it accessible to the public.
            </Text>
            <Switch
              label={
                <Flex>
                  Share <>{shareLoading && <Loader size="sm" />}</>
                </Flex>
              }
              checked={!!isPublicState}
              onChange={toggleFileShare}
            />
            {sharableLink && (
              <div className="flex gap-2 mt-4">
                <Input
                  className="w-full"
                  color="success"
                  type="url"
                  value={sharableLink}
                  disabled
                />
                <Button onClick={copySharableLink}>
                  <CopyIcon size="18px" />
                </Button>
              </div>
            )}
          </Box>
        )}

        {modalType === 'trash' && (
          <Box className="p-8 rounded-xl">
            <Flex justify="start" className="gap-4">
              <Flex
                justify="center"
                className="aspect-square w-[60px] bg-[#FFE2E4] rounded-full"
              >
                <PiWarningFill className="text-[#EE404C] w-8 h-8" />
              </Flex>
              <Box className="w-[calc(100%_-_76px)]">
                <Text className="capitalize text-xl font-bold text-custom-black mb-2">
                  Delete {file.type == 'folder' ? 'Folder' : 'File'}
                </Text>
                <Text className="text-[#475569] text-base">
                  Are you sure you want to delete this{' '}
                  {file.type == 'folder' ? 'Folder' : 'File'}?{' '}
                </Text>
              </Box>
            </Flex>
            <Flex justify="end" className="mt-8">
              <Button
                className="bg-[#F1F5F9] hover:bg-[#e8ecee]  text-black"
                onClick={() => setModalState({ isOpen: false, modalType: '' })}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#EE404C] hover:bg-[#dd3b46] text-white"
                isLoading={isPendingTrash}
                onClick={() => startTrashTransition(handleTrash)}
              >
                Delete
              </Button>
            </Flex>
          </Box>
        )}
      </Modal>
    </>
  );
}
