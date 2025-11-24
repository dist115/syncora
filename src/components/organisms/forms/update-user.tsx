'use client';

import { useTransition } from 'react';
import { CompleteUser } from '@/db/schema';
import { updateUser } from '@/server/actions/user.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Select } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import {
  UpdateUserInput,
  UpdateUserSchema,
} from '@/lib/validations/user.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const UpdateUser = ({ user }: { user: CompleteUser }) => {
  const [isPending, startTransition] = useTransition();
  const { closeDrawer } = useDrawer();

  const onSubmit: SubmitHandler<UpdateUserInput> = async (
    inputs: UpdateUserInput
  ) => {
    startTransition(async () => {
      try {
        await updateUser(user.id, inputs);
        closeDrawer();
        toast.success(MESSAGES.USER_UPDATED_SUCCESSFULLY);
      } catch (error) {
        handleError(error);
      }
    });
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<UpdateUserInput>
        validationSchema={UpdateUserSchema}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            name: user.name || '',
            email: user.email || '',
            status: user.status == 'Active' ? 'Active' : 'Inactive',
          },
        }}
      >
        {({ register, control, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Name"
                placeholder="Enter name"
                {...register('name')}
                error={errors.name?.message}
              />
            </Box>

            <Box>
              <Input
                type="text"
                label="Email"
                placeholder="Enter email"
                {...register('email')}
                error={errors.email?.message}
              />
            </Box>

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    label="Status"
                    selectClassName="border-steel-100 ring-0 dark:border-steel-500 dark:bg-steel-600/20"
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                    ]}
                    value={value}
                    onChange={onChange}
                    getOptionValue={(option) => option.value}
                    error={errors.status?.message}
                  />
                );
              }}
            />

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
                Save
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
