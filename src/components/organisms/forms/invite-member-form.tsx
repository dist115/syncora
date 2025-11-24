'use client';

import { useState, useTransition } from 'react';
import { TeamRole } from '@/db/schema';
import { invite } from '@/server/actions/team.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Select } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { TEAM_ROLES } from '@/config/roles';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { getOptionByValue } from '@/lib/utils/getOptionByValue';
import {
  InviteMemberInput,
  InviteMemberSchema,
} from '@/lib/validations/member.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const InviteMemberForm = ({ roles }: { roles: TeamRole[] }) => {
  const [isPending, startTransition] = useTransition();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});

  const memberRole = roles.find((role) => role.name === TEAM_ROLES.MEMBER);

  const onSubmit: SubmitHandler<InviteMemberInput> = async (
    inputs: InviteMemberInput
  ) => {
    startTransition(async () => {
      try {
        await invite(inputs);
        setReset({ name: '', email: '', roleId: memberRole?.id });
        closeDrawer();
        toast.success(MESSAGES.ADDED_TEAM_MEMBER);
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
      <Form<InviteMemberInput>
        validationSchema={InviteMemberSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, control, formState: { errors } }) => {
          return (
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
                name="roleId"
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      label="Role"
                      color="info"
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
          );
        }}
      </Form>
    </Flex>
  );
};
