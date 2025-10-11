'use client';

import { useTransition } from 'react';
import { TeamRole, type CompleteTeamMember } from '@/db/schema';
import { updateMember } from '@/server/actions/team.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Select } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { getOptionByValue } from '@/lib/utils/getOptionByValue';
import {
  UpdateMemberSchema,
  type UpdateMemberInput,
} from '@/lib/validations/member.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

const TeamStatus = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

export const UpdateTeamMember = ({
  member,
  roles,
}: {
  member: CompleteTeamMember;
  roles: TeamRole[];
}) => {
  const [isPending, startTransition] = useTransition();
  const { closeDrawer } = useDrawer();

  const onSubmit: SubmitHandler<UpdateMemberInput> = (
    inputs: UpdateMemberInput
  ) => {
    startTransition(async () => {
      try {
        if (member.teamId) {
          await updateMember(member.teamId, member.id, inputs);
          closeDrawer();
          toast.success(MESSAGES.MEMBER_UPDATED_SUCCESSFULLY);
        }
      } catch (error) {
        handleError(error);
      }
    });
  };

  const TeamRoles = roles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<UpdateMemberInput>
        validationSchema={UpdateMemberSchema}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            name: member.user?.name || '',
            email: member.user?.email || '',
            roleId: member.role.id,
            status: member.status == 'Active' ? 'Active' : 'Inactive',
          },
        }}
      >
        {({ register, control, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Name"
                disabled
                placeholder="Enter name"
                {...register('name')}
                error={errors.name?.message}
              />
            </Box>

            <Box>
              <Input
                type="text"
                label="Email"
                disabled
                placeholder="Enter email"
                {...register('email')}
                error={errors.email?.message}
              />
            </Box>

            <Controller
              control={control}
              name="roleId"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    label="Role"
                    selectClassName="border-steel-100 ring-0 dark:border-steel-500 dark:bg-steel-600/20"
                    options={TeamRoles}
                    value={value}
                    onChange={onChange}
                    getOptionValue={(option) => option.value}
                    displayValue={(value) =>
                      getOptionByValue(TeamRoles, value as string)?.label
                    }
                    error={errors.roleId?.message}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    label="Status"
                    selectClassName="border-steel-100 ring-0 dark:border-steel-500 dark:bg-steel-600/20"
                    options={TeamStatus}
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

              <Button isLoading={isPending} type="submit" size="lg" className="w-full">
                Save
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
