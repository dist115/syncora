'use client';

import { useState } from 'react';
import { CompleteFile } from '@/db/schema';
import { makeFilePrivate, shareFile } from '@/server/actions/files.action';
import { User } from 'lucia';
import { CopyIcon } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiPlayList2Line,
  RiShareLine,
} from 'react-icons/ri';
import {
  ActionIcon,
  Button,
  Drawer,
  Input,
  Loader,
  Modal,
  Switch,
  Text,
  Title,
} from 'rizzui';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { useDrawerState } from '@/lib/store/drawer.store';
import { copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import { fileDownloader } from '@/lib/utils/file-downloader';
import { useClientWidth } from '@/hooks/useClientWidth';
import { useIsClient } from '@/hooks/useIsClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Box, Flex } from '@/components/atoms/layout';
import Image from '@/components/atoms/next/image';
import DocPreview from '@/components/molecules/doc-preview/doc-preview';
import FileDetails from '@/components/organisms/file-details';

export function FilePreview({
  file,
  user,
}: {
  file: CompleteFile;
  user: User;
}) {
  const [isPublicState, setIsPublicState] = useState(file.isPublic);
  const [shareLoading, setShareLoading] = useState(false);
  const isClient = useIsClient();
  const screenWidth = useClientWidth();
  const isLg = useMediaQuery('(min-width: 1024px)');
  const { open, openDrawer, closeDrawer } = useDrawerState();
  const router = useRouter();
  const [detailsState, setDetailsState] = useState(true);
  const [modalState, setModalState] = useState(false);
  const fileUrl = getR2FileLink(file.fileName);
  const iconType = file?.type as FileIconType | null;
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

  function toggleDetails() {
    isLg ? setDetailsState((prev) => !prev) : openDrawer();
  }

  if (!isClient) return null;

  return (
    <>
      <Box className="bg-white h-[100dvh] fixed top-0 left-0 w-full z-50">
        <Flex
          justify="between"
          className="px-4 sm:px-6 border-steel-50 bg-steel-50/70 dark:bg-steel-700  h-14"
        >
          <ActionIcon
            className="w-auto hover:bg-steel-100 px-2 sm:px-3 text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10"
            variant="text"
            onClick={() => {
              router.back();
            }}
          >
            <RiArrowLeftLine className="sm:mr-1.5" size={18} />
            <span className="hidden sm:inline-block">Back</span>
          </ActionIcon>

          <Flex className="w-auto gap-0 sm:gap-3" justify="start">
            <ActionIcon
              as="span"
              variant="text"
              className="w-auto hover:bg-steel-100 px-2 sm:px-3 text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10 cursor-pointer"
              onClick={() => fileDownloader(fileUrl, file.name)}
            >
              <RiDownloadLine className="sm:mr-2" size={18} />
              <span className="hidden sm:inline-block">Download</span>
            </ActionIcon>

            <ActionIcon
              as="span"
              variant="text"
              onClick={() => setModalState(true)}
              className="w-auto hover:bg-steel-100 px-2 sm:px-3 cursor-pointer text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10"
            >
              <RiShareLine className="sm:mr-2" size={18} />
              <span className="hidden sm:inline-block">Share</span>
            </ActionIcon>
            <ActionIcon
              variant="text"
              className="w-auto hover:bg-steel-100 px-2 sm:px-3 cursor-pointer text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10"
              onClick={toggleDetails}
            >
              <RiPlayList2Line className="sm:mr-2" size={18} />
              <span className="hidden sm:inline-block">Info</span>
            </ActionIcon>
          </Flex>
        </Flex>

        <Box className={cn('h-[calc(100%-56px)] w-full flex')}>
          {file.type === 'image' && file.mime !== 'image/svg+xml' ? (
            <Box className="relative w-full h-full bg-steel-50 dark:bg-steel-800">
              <ImagePreview file={file} fileUrl={fileUrl} />
            </Box>
          ) : file.type === 'video' ? (
            <Box className="flex items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <video
                controls
                className="w-auto h-auto max-w-full max-h-full m-auto"
              >
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : file.type === 'audio' ? (
            <Box className="flex items-center justify-center w-full h-full dark:bg-steel-800">
              <audio controls className="w-[420px] max-w-full">
                <source src={fileUrl} />
                Your browser does not support the audio tag.
              </audio>
            </Box>
          ) : file.type === 'pdf' ||
            file.type === 'xlsx' ||
            file.type === 'doc' ||
            file.type === 'docx' ||
            file.type === 'txt' ? (
            <Box
              key={screenWidth}
              className={cn(
                'flex items-center justify-center  max-w-full h-full',
                detailsState
                  ? 'w-[calc(100%-400px)] dark:bg-steel-700 pr-5'
                  : 'w-full',
                file.type === 'txt' && 'dark:!text-slate-900 p-6'
              )}
            >
              <DocPreview docUrl={fileUrl} docType={file.type} />
            </Box>
          ) : (
            <Box className="flex flex-col items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <Flex direction="col" className="gap-4 mb-8">
                <DynamicFileIcon className="w-16 h-auto" iconType={iconType} />
                <Text>
                  {file.name}.{file.extension}
                </Text>
              </Flex>
              <Text className="mb-8">
                Hmm… looks like this file doesn&apos;t have a preview we can
                show you.
              </Text>
              <Button
                className="flex items-center"
                onClick={() => fileDownloader(fileUrl, file.name)}
              >
                <RiDownloadLine className="mr-2" size={18} />
                Download
              </Button>
            </Box>
          )}
          {detailsState && isLg && (
            <Box className="dark:bg-steel-800">
              <FileDetails
                file={file}
                user={user}
                setDetailsState={setDetailsState}
                className="w-[400px] "
              />
            </Box>
          )}
        </Box>
      </Box>
      {!isLg && (
        <Drawer
          isOpen={open}
          placement="right"
          customSize={400}
          onClose={() => closeDrawer()}
        >
          <FileDetails
            file={file}
            user={user}
            setDetailsState={setDetailsState}
            className="w-full"
          />
        </Drawer>
      )}
      <Modal
        isOpen={modalState}
        onClose={() => {
          setModalState(false);
        }}
        containerClassName="bg-white dark:bg-steel-800"
      >
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
      </Modal>
    </>
  );
}

function ImagePreview({
  file,
  fileUrl,
}: {
  file: CompleteFile;
  fileUrl: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <Flex justify="center" className="absolute top-0 left-0 w-full h-full">
          <Text
            as="span"
            className="rounded-full h-12 w-12 border border-t-0 border-r-0 border-[#0F172A] dark:border-white animate-spin"
          />
        </Flex>
      )}
      <Image
        src={fileUrl ?? ''}
        alt={file.name}
        className={cn(
          'object-contain opacity-0 !w-auto !h-auto m-auto max-w-full max-h-full',
          loaded && 'opacity-100'
        )}
        fill
        onLoadingComplete={() => setLoaded(true)}
      />
    </>
  );
}
