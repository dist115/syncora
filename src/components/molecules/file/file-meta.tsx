'use client';

import React, { useState } from 'react';
import { CompleteFile } from '@/db/schema';
import { format } from 'date-fns/format';
import { map } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Flex } from '@/components/atoms/layout';
import TagInput from '@/components/atoms/tag-input';
import TagForm from '@/components/organisms/forms/create-tag-form';

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

export default function FileMetaInformation({ file }: { file: CompleteFile }) {
  const [edit, setEdit] = useState(false);
  const tags = map(file?.tags, 'tag.label');

  return (
    <Flex
      direction="col"
      justify="start"
      align="start"
      className="gap-0 px-6 pt-3"
    >
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

        <MetaCard title="Tags" className="border-t border-muted mt-2 pt-4">
          <button
            type="button"
            className={cn(
              'font-medium text-xs absolute top-4 end-0',
              edit ? 'text-red' : 'text-blue'
            )}
            onClick={() => setEdit((prev) => !prev)}
          >
            {edit ? 'Cancel' : '+ Add Tags'}
          </button>
          {edit ? (
            <TagForm file={file} onSave={() => setEdit(false)} />
          ) : (
            <TagInput tags={tags} editable={false} />
          )}
        </MetaCard>
      </Flex>
    </Flex>
  );
}
