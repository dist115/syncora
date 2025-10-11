import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CompleteFile, Folder } from '@/db/schema';
import {
  duplicateFile,
  makeFileFavourite,
  makeFilePrivate,
  shareFile,
} from '@/server/actions/files.action';
import {
  decreaseFolderSize,
  increaseFolderSize,
  moveFolder,
  moveToTrash,
} from '@/server/actions/folders.action';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { User } from 'lucia';
import { CopyIcon } from 'lucide-react';
import { PiWarningFill } from 'react-icons/pi';
import {
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiFoldersLine,
  RiFolderTransferLine,
  RiMore2Line,
  RiShareLine,
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
import { create } from 'zustand';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { getS3FileLink } from '@/lib/utils/file';
import { fileDownloader } from '@/lib/utils/file-downloader';
import { copyToClipboard } from '@/lib/utils/index';
import Allow from '@/components/atoms/allow';
import { Box, Flex } from '@/components/atoms/layout';
import { FolderTree } from '@/components/organisms/folder-tree';
import { RenameFile } from '@/components/organisms/forms/rename-file';

type MoveFolderProps = {
  folderID: string | null;
  setFolderID: (folderID: string | null) => void;
};

export const useMoveFolder = create<MoveFolderProps>()((set) => ({
  folderID: '',
  setFolderID: (folderID) => set({ folderID }),
}));

interface FolderActionProps {
  file: CompleteFile;
  folders: Folder[];
  parentFolder: Folder | null;
  user?: User;
  excludeOptions?: string[];
  permissions?: any;
  currentTeam?: any;
}

export function FolderAction({
  file,
  folders,
  parentFolder,
  excludeOptions = [],
  permissions,
  user,
  currentTeam,
}: FolderActionProps) {
  const [isPublicState, setIsPublicState] = useState(file.isPublic);
  const [shareLoading, setShareLoading] = useState(false);
  const [isMovePending, setIsMovePending] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    modalType: '',
  });
  const { openDrawer } = useDrawer();
  const { isOpen, modalType } = modalState;
  const moveFromFolderID = useParams();
  const { folderID, setFolderID } = useMoveFolder();

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

  const handleMoveTo = () => {
    setModalState({ isOpen: true, modalType: 'move' });
    setFolderID(parentFolder?.id ?? null);
  };

  const handleDuplicate = () => {
    toast.promise(() => duplicateFile(file), {
      loading: `${file?.type === 'folder' ? 'Folder' : 'File'} duplicating...`,
      success: (file: any) => {
        return `${
          file?.type === 'folder' ? 'Folder' : 'File'
        } duplicated successfully.`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  };

  const handleMove = async () => {
    setIsMovePending(true);
    try {
      await moveFolder(
        file.id,
        folderID,
        moveFromFolderID.id as string,
        file.fileSize
      );
      toast.success('Successfully Moved!');
      setModalState({ isOpen: false, modalType: '' });
      setFolderID('');
    } catch (error) {
      handleError(error);
    } finally {
      // loading state should be handle here.
      setIsMovePending(false);
    }
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
    copyToClipboard(sharableLink, MESSAGES.SHARABLE_LINK_COPIED);
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
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
  };

  const fileUrl = getS3FileLink(file.fileName);

  return (
    <>
      <Dropdown shadow="xl" placement="bottom-end">
        <Dropdown.Trigger as="button" aria-label="Folder Action Button">
          <ActionIcon as="span" size="sm" variant="text" rounded="full">
            <RiMore2Line strokeWidth={0.5} size={20} />
          </ActionIcon>
        </Dropdown.Trigger>
        <Dropdown.Menu className="dark:bg-steel-700 w-56 grid grid-cols-1 gap-1">
          {currentTeam ? (
            <Allow
              access={PERMISSIONS.DOWNLOAD_FILES}
              mod={MODULE.FILE}
              rules={permissions}
            >
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
            </Allow>
          ) : (
            file.type !== 'folder' && (
              <Dropdown.Item
                onClick={() =>
                  setModalState({ isOpen: true, modalType: 'share' })
                }
              >
                <RiShareLine className="text-steel-400 me-1.5" size={18} />
                Share & Get Link
              </Dropdown.Item>
            )
          )}

          {!excludeOptions.includes('favourite') && (
            <Dropdown.Item onClick={handleFavourite}>
              <RiStarLine className="text-steel-400 me-1.5" size={18} />
              {file.isFavourite ? 'Remove from Favourite' : 'Add to Favourite'}
            </Dropdown.Item>
          )}
          {currentTeam ? (
            <Allow
              access={PERMISSIONS.DOWNLOAD_FILES}
              mod={MODULE.FILE}
              rules={permissions}
            >
              {file.type !== 'folder' && (
                <Dropdown.Item
                  className="flex items-center w-full"
                  onClick={() => fileDownloader(fileUrl, file.name)}
                >
                  <RiDownloadLine className="mr-1.5 text-steel-400" size={18} />
                  Download
                </Dropdown.Item>
              )}
            </Allow>
          ) : (
            file.type !== 'folder' && (
              <Dropdown.Item
                className="flex items-center w-full"
                onClick={() => fileDownloader(fileUrl, file.name)}
              >
                <RiDownloadLine className="mr-1.5 text-steel-400" size={18} />
                Download
              </Dropdown.Item>
            )
          )}

          {currentTeam ? (
            <Allow
              access={PERMISSIONS.EDIT_FILES}
              mod={MODULE.FILE}
              rules={permissions}
            >
              <Dropdown.Item onClick={handleMoveTo}>
                <RiFolderTransferLine
                  className="text-steel-400 me-1.5"
                  size={18}
                />
                Move to
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() =>
                  openDrawer(
                    RenameFile,
                    'Rename File',
                    'Change file/folder name',
                    {
                      file,
                    }
                  )
                }
              >
                <RiEditLine className="text-steel-400 me-1.5" size={18} />
                Rename
              </Dropdown.Item>

              {'folder' !== file.type ? (
                <Dropdown.Item onClick={handleDuplicate}>
                  <RiFoldersLine className="text-steel-400 me-1.5" size={18} />
                  Duplicate
                </Dropdown.Item>
              ) : null}
            </Allow>
          ) : (
            <>
              <Dropdown.Item onClick={handleMoveTo}>
                <RiFolderTransferLine
                  className="text-steel-400 me-1.5"
                  size={18}
                />
                Move to
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() =>
                  openDrawer(
                    RenameFile,
                    'Rename File',
                    'Change file/folder name',
                    {
                      file,
                    }
                  )
                }
              >
                <RiEditLine className="text-steel-400 me-1.5" size={18} />
                Rename
              </Dropdown.Item>

              {'folder' !== file.type ? (
                <Dropdown.Item onClick={handleDuplicate}>
                  <RiFoldersLine className="text-steel-400 me-1.5" size={18} />
                  Duplicate
                </Dropdown.Item>
              ) : null}
            </>
          )}
          {currentTeam ? (
            <Allow
              access={PERMISSIONS.DELETE_FILES}
              mod={MODULE.FILE}
              rules={permissions}
            >
              <Dropdown.Item onClick={handleTrash}>
                <RiDeleteBinLine className="text-steel-400 me-1.5" size={18} />
                Move to trash
              </Dropdown.Item>
            </Allow>
          ) : (
            <Dropdown.Item onClick={handleTrash}>
              <RiDeleteBinLine className="text-steel-400 me-1.5" size={18} />
              Move to trash
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setModalState({ isOpen: false, modalType: '' });
          setFolderID('');
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

        {modalType === 'move' && (
          <Box className="pt-6 pb-8 m-auto px-7">
            <Box className="flex items-center justify-between mb-7">
              <Text className="text-steel-700 dark:text-steel-100">
                Move <b>&lsquo;{file.name}&rsquo;</b>
              </Text>
              <ActionIcon
                size="sm"
                variant="text"
                onClick={() => {
                  setModalState({ isOpen: false, modalType: '' });
                  setFolderID('');
                }}
              >
                <XMarkIcon className="w-6 h-auto" strokeWidth={1.8} />
              </ActionIcon>
            </Box>
            <Box>
              <FolderTree
                folders={folders}
                parentFolder={parentFolder}
                file={file}
              />
              <Button
                isLoading={isMovePending}
                type="submit"
                size="lg"
                className="w-full mt-2"
                onClick={handleMove}
                disabled={file.parentId === folderID}
              >
                Move
              </Button>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
}
