'use client';

import React from 'react';
import { CompleteFile } from '@/db/schema';
import { format } from 'date-fns/format';
import prettyBytes from 'pretty-bytes';
import { RiCloseLine } from 'react-icons/ri';
import { ActionIcon, Text, Title } from 'rizzui';

import { useDrawerState } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { Flex } from '@/components/atoms/layout';

function MetaCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Flex
      align="start"
      justify="start"
      direction="col"
      className={cn('w-full gap-y-1.5 relative', className)}
    >
      <Text as="span" className="text-[13px] text-steel-500 w-full">
        {title}
      </Text>
      <Text as="span" className="text-[13px] text-steel-700 font-medium w-full">
        {children}
      </Text>
    </Flex>
  );
}

export default function SharedFileMetaInformation({
  file,
}: {
  file: CompleteFile;
}) {
  const { closeDrawer } = useDrawerState();

  return (
    <Flex
      direction="col"
      justify="start"
      align="start"
      className="gap-0 px-4 lg:px-6 pt-1 lg:pt-2"
    >
      <Flex
        justify="between"
        align="center"
        className="border-b border-muted py-2 mb-5"
      >
        <Title as="h5">File Information</Title>
        <ActionIcon
          className="rounded hover:bg-steel-100/50 dark:hover:bg-steel-600/50"
          variant="text"
          onClick={closeDrawer}
        >
          <RiCloseLine className="text-steel-400" size={24} />
        </ActionIcon>
      </Flex>

      <h3 className="m-0 mb-6 text-base font-medium dark:text-steel-200">
        {file?.name}
      </h3>

      <Flex
        direction="col"
        justify="start"
        align="start"
        className="w-full gap-y-5"
      >
        <MetaCard title="Type">
          <Text as="span" className="uppercase dark:text-gray-300">
            {file?.type}
          </Text>
        </MetaCard>

        <MetaCard title="Size">
          <Text as="span" className="uppercase dark:text-gray-300">
            {prettyBytes(file?.fileSize as number)}
          </Text>
        </MetaCard>

        <MetaCard title="Modified">
          <Text as="span" className="uppercase dark:text-gray-300">
            {format(file?.updatedAt, "dd MMM yyyy 'at' h:mm a")}
          </Text>
        </MetaCard>

        <MetaCard title="Created">
          <Text as="span" className="uppercase dark:text-gray-300">
            {format(file?.createdAt, "dd MMM yyyy 'at' h:mm a")}
          </Text>
        </MetaCard>
      </Flex>
    </Flex>
  );
}
