'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { CompleteFile, TagType } from '@/db/schema';
import { createMultipleTags } from '@/server/actions/tag.action';
import { isEmpty } from 'lodash';
import { Controller } from 'react-hook-form';
import { Button } from 'rizzui';

import { handleError } from '@/lib/utils/error';
import {
  CreateTagSchema,
  type TagInput as TagInputType,
} from '@/lib/validations/tag.schema';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import TagInput from '@/components/atoms/tag-input';
import TagSelect from '@/components/atoms/tag-select';

export default function TagForm({
  file,
  onSave,
}: {
  file: CompleteFile;
  onSave: () => void;
}) {
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [reset, setReset] = useState({
    label: '',
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(inputs: TagInputType) {
    try {
      startTransition(async () => {
        const tagsInput = tags?.map((tag) => ({
          label: tag.label,
          taggableId: file.id,
          tagType: TagType.files,
        }));
        if (tagsInput.length) {
          await createMultipleTags(tagsInput);
          setReset((prev) => ({ ...prev, label: '' }));
        }
      });
    } catch (error) {
      handleError(error);
    } finally {
      onSave();
    }
  }

  useEffect(() => {
    const tagsValue = file?.tags?.map((tag) => ({
      value: tag?.tag?.id,
      label: tag?.tag?.label,
    }));
    if (tagsValue?.length) {
      setTags(tagsValue);
    }
  }, [file?.tags]);

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-0">
      <Form<TagInputType>
        validationSchema={CreateTagSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ control, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-2">
            <Box>
              <Controller
                name="label"
                control={control}
                render={({ field: { onChange } }) => (
                  <TagSelect
                    setTags={setTags}
                    onChange={onChange}
                    defaultValue={file.tags?.map((tag) => ({
                      label: tag?.tag?.label,
                      value: tag?.tag?.id,
                    }))}
                  />
                )}
              />
            </Box>
            <Flex justify="end">
              <Button
                type="submit"
                size="sm"
                className="w-auto gap-2"
                isLoading={isPending}
                disabled={isPending || isEmpty(tags)}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        )}
      </Form>
    </Flex>
  );
}
