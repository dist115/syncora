'use client';

import React, { useEffect, useState } from 'react';
import { ComepleteComment, CompleteFile } from '@/db/schema';
import { formatRelativeWithOptions } from 'date-fns/fp/formatRelativeWithOptions';
import { parseJSON } from 'date-fns/fp/parseJSON';
import { es } from 'date-fns/locale';
import { User } from 'lucia';
import { Avatar } from 'rizzui';

import { Flex } from '../atoms/layout';
import { CreateCommentsForm } from './forms/create-comments-form';

const formatRelativeLocale: { [x: string]: string } = {
  lastWeek: "eeee 'at' h:mm a",
  yesterday: "'Yesterday' 'at' h:mm a",
  today: "'Today' 'at' h:mm a",
  tomorrow: "'Tomorrow' 'at' h:mm a",
  nextWeek: "'Next' eeee 'at' h:mm a",
  other: "dd MMM yyyy 'at' h:mm a",
};

const locale = {
  ...es,
  formatRelative: (token: string) => formatRelativeLocale[token],
};

const formatRelative = formatRelativeWithOptions(
  {
    locale,
    weekStartsOn: 1,
  },
  new Date()
);

export default function FileComments({
  file,
  user,
}: {
  file: CompleteFile;
  user: User;
}) {
  const [fileComments, setFileComments] = useState<ComepleteComment[]>([]);
  const { comments } = file;

  useEffect(() => {
    setFileComments(comments);
  }, [comments]);

  return (
    <Flex
      justify="normal"
      direction="col"
      align="start"
      className="px-6 pt-5 gap-0 flex-1 overflow-y-auto h-full"
    >
      <CreateCommentsForm file={file} />

      <Flex
        justify="normal"
        align="start"
        direction="col"
        className="gap-y-2.5 mt-8 flex-1"
      >
        {fileComments?.map((comment) => (
          <Flex
            align="start"
            className="gap-x-4 rounded-lg dark:bg-steel-600/30 bg-steel-50 px-5 py-4"
            key={comment.id}
          >
            <Avatar
              src={comment?.commenter?.image as string}
              name={comment?.commenter?.name as string}
              className="w-9 h-9 text-lg mt-1.5"
            />

            <Flex
              justify="normal"
              direction="col"
              align="start"
              className="gap-y-1"
            >
              <span className="text-xs dark:text-steel-400 text-steel-500 leading-5">
                <span className="font-semibold dark:text-steel-400 text-steel-800">
                  {comment?.commenter?.id === user?.id
                    ? 'You'
                    : comment?.commenter?.name}
                </span>{' '}
                Commented
              </span>
              <p className="text-xs dark:text-steel-300 text-steel-600 m-0 leading-5 break-all">
                {comment?.content}
              </p>

              {comment.createdAt ? (
                <span className="text-[11px] dark:text-steel-400 text-steel-500 leading-5">
                  {formatRelative(
                    parseJSON(comment.createdAt as unknown as string)
                  )}
                </span>
              ) : null}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
