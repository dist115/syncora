'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTeam } from '@/server/actions/team.action';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { PAGES } from '@/config/pages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError, hasError, showErrorMessage } from '@/lib/utils/error';
import { CreateTeamSchema, TeamInput } from '@/lib/validations/team.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const CreateTeamForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<TeamInput> = async (inputs: TeamInput) => {
    setIsLoading(true);
    try {
      const newTeam = await addTeam(inputs);
      if (hasError(newTeam)) {
        showErrorMessage(newTeam);
        return;
      }

      setReset({ name: '' });
      closeDrawer();
      toast.success(MESSAGES.TEAM_CREATED_SUCCESSFULLY);
      router.push(PAGES.DASHBOARD.ROOT);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<TeamInput>
        validationSchema={CreateTeamSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Team name"
                placeholder="Enter your team name"
                {...register('name')}
                error={errors.name?.message}
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
