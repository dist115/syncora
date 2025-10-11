'use client';

import { useState, useTransition } from 'react';
import { CompleteFile } from '@/db/schema';
import { updateFolder } from '@/server/actions/folders.action';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import {
  UpdateFolderInput,
  UpdateFolderSchema,
} from '@/lib/validations/folder.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const RenameFile = ({ file }: { file: CompleteFile }) => {
  const [isPending, startTransition] = useTransition();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<UpdateFolderInput> = async (
    inputs: UpdateFolderInput
  ) => {
    startTransition(async () => {
      try {
        await updateFolder(file.id, inputs);
        setReset({ name: '' });
        closeDrawer();
        toast.success(MESSAGES.RENAME_SUCCESSFUL);
      } catch (error) {
        handleError(error);
      }
    });
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<UpdateFolderInput>
        validationSchema={UpdateFolderSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            name: file.name || '',
          },
        }}
      >
        {({ register, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Name"
                placeholder="Enter name"
                defaultValue="Untitled Folder"
                {...register('name')}
                error={errors.name?.message}
                onFocus={(e) => e.target.select()}
              />
            </Box>

            <FixedDrawerBottom>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={closeDrawer}
              >
                Cancel
              </Button>

              <Button
                isLoading={isPending}
                type="submit"
                size="lg"
                className="w-full"
              >
                Update
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
