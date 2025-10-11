'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CompleteFile } from '@/db/schema';
import { ArrowDownToLine } from 'lucide-react';
import { RiDownloadLine, RiPlayList2Line } from 'react-icons/ri';
import { Button, Drawer, Text, Title } from 'rizzui';

import { useDrawerState } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import { fileDownloader } from '@/lib/utils/file-downloader';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Box, Flex } from '@/components/atoms/layout';
import Image from '@/components/atoms/next/image';
import DocPreview from '@/components/molecules/doc-preview/doc-preview';
import SharedFileMetaInformation from '@/components/molecules/file/shared-file-meta';
import { Logo } from '@/components/molecules/logo';

export function SharedFilePreview({
  file,
  logoUrl,
  logoSmallUrl,
  darkModeLogoUrl,
  darkModeLogoSmallUrl,
  appName,
}: {
  file: CompleteFile;
  logoUrl: string;
  logoSmallUrl: string;
  darkModeLogoUrl: string;
  darkModeLogoSmallUrl: string;
  appName: string;
}) {
  const { open, openDrawer, closeDrawer } = useDrawerState();

  const fileUrl = getR2FileLink(file.fileName);
  const iconType = file?.type as FileIconType | null;

  return (
    <Box className="bg-white h-[100dvh] dark:bg-steel-800 fixed top-0 left-0 w-full z-50">
      <Box className="flex items-center justify-between px-4 lg:px-6 bg-steel-50/70 dark:bg-steel-700 h-14">
        <Flex className="gap-0 [&_.dark-mode-logo]:!opacity-0 dark:[&_.dark-mode-logo]:!opacity-100 dark:[&_.light-mode-logo]:!opacity-0 [&_.light-mode-logo]:!opacity-100">
          <Logo
            logoUrl={logoUrl}
            logoUrlSmall={logoSmallUrl}
            darkModeLogoUrl={darkModeLogoUrl}
            darkModeLogoUrlSmall={darkModeLogoSmallUrl}
            appName={appName}
            logoClassName="2xl:w-28"
          />
          <Flex className="w-auto gap-0 sm:gap-3" justify="start">
            <Button
              as="span"
              variant="text"
              className="w-auto hover:bg-steel-100 px-2 sm:px-3 text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10 cursor-pointer"
              onClick={() => fileDownloader(fileUrl, file.name)}
            >
              <RiDownloadLine className="sm:mr-2" size={18} />
              <Text as="span" className="hidden sm:inline">
                Download
              </Text>
            </Button>
            <Button
              as="span"
              variant="text"
              className="w-auto hover:bg-steel-100 px-2 sm:px-3 cursor-pointer text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10"
              onClick={openDrawer}
            >
              <RiPlayList2Line className="sm:mr-2" size={18} />
              <Text as="span" className="hidden sm:inline">
                Info
              </Text>
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box className="h-[calc(100%-56px)] w-full grid grid-cols-1]">
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
          <Box className="flex items-center justify-center w-full h-full">
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
            className={cn(
              'flex items-center justify-center w-full h-full',
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
              Hmm… looks like this file doesn&apos;t have a preview we can show
              you.
            </Text>
            <Button
              className="flex items-center"
              onClick={() => fileDownloader(fileUrl, file.name)}
            >
              <ArrowDownToLine className="mr-2" strokeWidth={1.5} size={18} />
              Download
            </Button>
          </Box>
        )}
      </Box>

      <Drawer
        isOpen={open}
        placement="right"
        customSize={400}
        onClose={() => closeDrawer()}
      >
        <SharedFileMetaInformation file={file} />
      </Drawer>
    </Box>
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
        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </>
  );
}
