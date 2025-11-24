'use client';

import React, { useRef, useState, useTransition } from 'react';
import { Tags } from '@/db/schema';
import { createTag, deleteTag, editTag } from '@/server/actions/tag.action';
import { Button, Input } from 'rizzui';

import { handleError, hasError, showErrorMessage } from '@/lib/utils/error';
import { Flex } from '@/components/atoms/layout';
import ManageTagItem from '@/components/molecules/manage-tag-item';

interface Props {
  tags: Tags[];
}

const ManageTagsForm = ({ tags }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [allTags, setAllTags] = useState(tags);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      startTransition(async () => {
        if (!inputRef.current?.value) return;
        const response = await createTag({ label: inputRef?.current?.value });
        if (hasError(response)) {
          showErrorMessage(response);
          return;
        }
        const allTag = 'id' in response ? [...allTags, response] : [...allTags];
        setAllTags(allTag);
        inputRef.current.value = '';
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditTag = async (id: string, label: string) => {
    const updatedTags = allTags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, label };
      }
      return tag;
    });
    setAllTags(updatedTags);
    await editTag(id, label);
  };
  const handleDeleteTag = async (id: string) => {
    const updatedTags = allTags.filter((tag) => tag.id !== id);
    setAllTags(updatedTags);
    await deleteTag(id);
  };

  return (
    <Flex direction="col" align="stretch" className="gap-2 px-6 py-4">
      <form onSubmit={handleCreateTag}>
        <Flex className="gap-2 my-2">
          <Input
            placeholder="Create new tags"
            className="flex-1"
            ref={inputRef}
          />
          <Button type="submit" isLoading={isPending}>
            Create
          </Button>
        </Flex>
      </form>

      {allTags.map((tag) => (
        <ManageTagItem
          key={tag.id}
          tag={tag}
          onEdit={handleEditTag}
          onDelete={handleDeleteTag}
        />
      ))}
    </Flex>
  );
};

export default ManageTagsForm;
