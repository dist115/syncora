'use client';

import { useState } from 'react';
import { createFolder } from '@/server/actions/folders.action';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError, hasError, showErrorMessage } from '@/lib/utils/error';
import {
  UpdateFolderInput,
  UpdateFolderSchema,
} from '@/lib/validations/folder.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const CreateFolderForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { props, closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const { parentId }: any = props;

  const onSubmit: SubmitHandler<UpdateFolderInput> = async (
    inputs: UpdateFolderInput
  ) => {
    setIsLoading(true);
    try {
      inputs.parentId = Boolean(parentId) ? parentId : null;
      const newFolder = await createFolder(inputs);
      if (hasError(newFolder)) {
        showErrorMessage(newFolder);
        return;
      }
      setReset({ name: '' });
      closeDrawer();
      toast.success(MESSAGES.NEW_FOLDER_CREATED);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<UpdateFolderInput>
        validationSchema={UpdateFolderSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Name"
                placeholder="Enter name"
                autoComplete="off"
                data-1p-ignore
                defaultValue="Untitled Folder"
                {...register('name')}
                error={errors.name?.message}
                onFocus={(e) => e.target.select()}
              />
            </Box>

            <FixedDrawerBottom>
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={closeDrawer}
              >
                Cancel
              </Button>

              <Button
                isLoading={isLoading}
                type="submit"
                size="lg"
                className="w-full"
              >
                Create
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
