'use client';

import { useState, useTransition } from 'react';
import { CommentType } from '@/db/schema/enums';
import { createComment } from '@/server/actions/comment.action';
import { isEmpty } from 'lodash';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input, Textarea } from 'rizzui';

import { handleError } from '@/lib/utils/error';
import {
  CommentInput,
  CreateCommentsSchema,
} from '@/lib/validations/comment.schema';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { CompleteFile } from '@/db/schema/files';

type Props = {
  file: CompleteFile;
};

export const CreateCommentsForm: React.FC<Props> = ({ file }) => {
  const [reset, setReset] = useState({
    content: '',
    commentType: CommentType.files,
    commentableId: file.id,
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<CommentInput> = (inputs: CommentInput) => {
    try {
      startTransition(async () => {
        await createComment(inputs);
        setReset((prev) => ({ ...prev, content: '' }));
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-0">
      <Form<CommentInput>
        validationSchema={CreateCommentsSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, watch, formState: { errors } }) => {
          return (
            <Flex direction="col" align="stretch" className="gap-5">
              <Box>
                <Textarea
                  placeholder="Add a comment"
                  {...register('content')}
                  error={errors.content?.message}
                />
                <Input
                  value={CommentType.files}
                  type="text"
                  className="hidden"
                  {...register('commentType')}
                />
                <Input
                  value={file.id}
                  type="text"
                  className="hidden"
                  {...register('commentableId')}
                />
              </Box>
              <Flex justify="end">
                <Button
                  type="submit"
                  size="sm"
                  className="w-auto gap-2"
                  isLoading={isPending}
                  disabled={isPending || isEmpty(watch('content'))}
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          );
        }}
      </Form>
    </Flex>
  );
};
