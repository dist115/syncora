'use client';

import { useState } from 'react';
import { updateTeam } from '@/server/actions/team.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import { handleError } from '@/lib/utils/error';
import { acceptedFileType } from '@/lib/utils/image';
import { uploadSingleFile } from '@/lib/utils/s3/upload-single';
import {
  TeamSettingsInput,
  TeamSettingsSchema,
} from '@/lib/validations/team-general-settings.schema';
import Allow from '@/components/atoms/allow';
import { Fieldset, Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { Uploader } from '@/components/molecules/uploader/uploader';

export function TeamGeneralSettingsForm({
  team,
  permissions,
}: {
  team: any;
  permissions: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<TeamSettingsInput> = async (inputs) => {
    try {
      setIsLoading(true);
      if (Array.isArray(inputs.avatar)) {
        const image = await uploadSingleFile(inputs.avatar[0]);
        inputs.avatar = image;
      }
      await updateTeam(team.id, inputs);
      toast.success(MESSAGES.TEAM_SETTINGS_UPDATED_SUCCESSFULLY);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const editTeamAction = permissions.find(
    (permission: any) => permission.action === 'EDIT_TEAM_SETTINGS'
  );

  return (
    <>
      <Form<TeamSettingsInput>
        resetValues={team}
        validationSchema={TeamSettingsSchema}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            name: team?.name,
            slug: team?.slug,
            domain: team?.domain || '',
            avatar: team?.avatar || '',
          },
        }}
      >
        {({
          register,
          control,
          setValue,
          formState: { errors, defaultValues },
        }) => (
          <Box>
            <PageHeader
              title="Team Settings"
              description="Manage your team settings"
              titleClassName="text-xl"
              className="items-center"
              headingWrapperClassName="w-full 375px:w-auto"
              childrenClassName="shrink-0 375px:w-auto 375px:shrink"
            >
              <Allow
                access={PERMISSIONS.EDIT_TEAM_SETTINGS}
                mod={MODULE.TEAM}
                rules={permissions}
              >
                <Flex justify="end" className="w-full 375px:w-auto">
                  <Button
                    className="w-full 375px:w-auto"
                    isLoading={isLoading}
                    type="submit"
                  >
                    Save changes
                  </Button>
                </Flex>
              </Allow>
            </PageHeader>

            <Fieldset title="Name" required>
              <Input
                disabled={
                  editTeamAction?.action !== PERMISSIONS.EDIT_TEAM_SETTINGS
                }
                type="text"
                placeholder="Enter your name"
                className="[&>label>span]:font-medium"
                inputClassName="!border-steel-200 dark:!border-steel-500 dark:!bg-steel-600/20 [&_input::placeholder]:!text-steel-100 dark:!text-steel-100"
                {...register('name')}
                error={errors.name?.message}
              />
            </Fieldset>

            <Fieldset
              title="Slug"
              description="Update team slug from here"
              required
            >
              <Input
                disabled={
                  editTeamAction?.action !== PERMISSIONS.EDIT_TEAM_SETTINGS
                }
                type="text"
                placeholder="Enter team slug"
                className="[&>label>span]:font-medium"
                {...register('slug')}
                error={errors.slug?.message}
              />
            </Fieldset>

            <Fieldset title="Domain">
              <Input
                disabled={
                  editTeamAction?.action !== PERMISSIONS.EDIT_TEAM_SETTINGS
                }
                type="text"
                placeholder="Enter domain"
                className="[&>label>span]:font-medium"
                {...register('domain')}
                error={errors.domain?.message}
              />
            </Fieldset>

            <Fieldset title="Avatar">
              <Controller
                control={control}
                name="avatar"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Flex direction="col" align="stretch">
                      <Uploader
                        disabled={
                          editTeamAction?.action !==
                          PERMISSIONS.EDIT_TEAM_SETTINGS
                        }
                        onChange={onChange}
                        variant="avatar"
                        placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                        defaultValue={defaultValues?.avatar}
                        accept={acceptedFileType()}
                      />
                      <Text className="text-red text-xs mt-0.5">
                        {errors.avatar?.message as string}
                      </Text>
                    </Flex>
                  );
                }}
              />
            </Fieldset>
          </Box>
        )}
      </Form>
    </>
  );
}
