'use client';

import { useState } from 'react';
import { updateSettings } from '@/server/actions/settings.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { stringToBoolean, uploadFile } from '@/lib/utils';
import { handleError } from '@/lib/utils/error';
import { acceptedFileType } from '@/lib/utils/image';
import {
  SiteSettingsInput,
  SiteSettingsSchema,
} from '@/lib/validations/site-settings.schema';
import { ColorPicker } from '@/components/atoms/color-picker';
import { Fieldset, Form, Switch } from '@/components/atoms/forms';
import { Box, Flex, Grid } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { PreviewCard } from '@/components/molecules/uploader/preview-card';
import { Uploader } from '@/components/molecules/uploader/uploader';

export function SiteSettingsForm({ settings }: { settings?: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SiteSettingsInput> = async (inputs) => {
    setIsLoading(true);
    try {
      await uploadFile('logo', inputs);
      await uploadFile('logo_small', inputs);
      await uploadFile('dark_mode_logo', inputs);
      await uploadFile('dark_mode_logo_small', inputs);
      await updateSettings(inputs);
      setIsLoading(false);
      toast.success(MESSAGES.SETTINGS_UPDATED_SUCCESSFULLY);
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return (
    <Form<SiteSettingsInput>
      validationSchema={SiteSettingsSchema}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: {
          logo: settings?.logo || '',
          logo_small: settings?.logo_small || '',
          dark_mode_logo: settings?.dark_mode_logo || '',
          dark_mode_logo_small: settings?.dark_mode_logo_small || '',
          email: settings?.email || '',
          maintenance: settings?.maintenance || 'false',
          header_color: settings?.header_color || '#1b1e27',
          sidebar_color: settings?.sidebar_color || '#ffffff',
          background_color: settings?.background_color || '#ffffff',
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
          <Flex className="sticky top-16 lg:top-[70px] left-0 bg-white dark:bg-steel-900 pb-0 pt-6 -mt-6 mb-6 border-b border-steel-100 dark:border-steel-600/60 z-10 ">
            <PageHeader
              title="Site Settings"
              description="Manage site settings"
              titleClassName="text-xl"
              className="items-start flex-col 375px:flex-row !w-full 375px:w-auto 375px:items-center"
              headingWrapperClassName="w-auto shrink"
              childrenClassName="w-full 375px:w-auto shrink "
            >
              <Flex justify="end" className="w-full">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full 375px:w-auto"
                >
                  Save changes
                </Button>
              </Flex>
            </PageHeader>
          </Flex>
          <Fieldset
            title="Logo"
            description="Upload your logo"
            titleClassName="text-base"
          >
            <Controller
              control={control}
              name="logo"
              render={({ field: { onChange } }) => {
                return (
                  <Box>
                    <Uploader
                      onChange={onChange}
                      variant="box"
                      placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                      defaultValue={defaultValues?.logo}
                      accept={acceptedFileType()}
                      multiple={false}
                    />
                    <Text className="text-red text-xs mt-0.5">
                      {errors.logo?.message as string}
                    </Text>
                    {defaultValues?.logo && (
                      <Box className="mt-5">
                        <PreviewCard src={defaultValues?.logo} />
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Fieldset>
          <Fieldset
            title="Logo (Small)"
            description="Upload your small logo"
            titleClassName="text-base"
          >
            <Controller
              control={control}
              name="logo_small"
              render={({ field: { onChange } }) => {
                return (
                  <Box>
                    <Uploader
                      onChange={onChange}
                      variant="box"
                      placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                      defaultValue={defaultValues?.logo_small}
                      accept={acceptedFileType()}
                      multiple={false}
                    />
                    <Text className="text-red text-xs mt-0.5">
                      {errors.logo_small?.message as string}
                    </Text>
                    {defaultValues?.logo_small && (
                      <Box className="mt-5">
                        <PreviewCard src={defaultValues?.logo_small} />
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Fieldset>

          <Fieldset
            title="Logo (Dark Mode)"
            description="Upload a light or bright colors for dark mode"
            titleClassName="text-base"
          >
            <Controller
              control={control}
              name="dark_mode_logo"
              render={({ field: { onChange } }) => {
                return (
                  <Box>
                    <Uploader
                      onChange={onChange}
                      variant="box"
                      placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                      defaultValue={defaultValues?.dark_mode_logo}
                      accept={acceptedFileType()}
                      multiple={false}
                    />
                    <Text className="text-red text-xs mt-0.5">
                      {errors.dark_mode_logo?.message as string}
                    </Text>
                    {defaultValues?.dark_mode_logo && (
                      <Box className="mt-5">
                        <PreviewCard src={defaultValues?.dark_mode_logo} />
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Fieldset>
          <Fieldset
            title="Logo (Dark Mode - Small)"
            description="Upload a light or bright colors for dark mode"
            titleClassName="text-base"
          >
            <Controller
              control={control}
              name="dark_mode_logo_small"
              render={({ field: { onChange } }) => {
                return (
                  <Box>
                    <Uploader
                      onChange={onChange}
                      variant="box"
                      placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                      defaultValue={defaultValues?.dark_mode_logo_small}
                      accept={acceptedFileType()}
                      multiple={false}
                    />
                    <Text className="text-red text-xs mt-0.5">
                      {errors.dark_mode_logo_small?.message as string}
                    </Text>
                    {defaultValues?.dark_mode_logo_small && (
                      <Box className="mt-5">
                        <PreviewCard
                          src={defaultValues?.dark_mode_logo_small}
                        />
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Fieldset>

          <Fieldset
            title="Email"
            description="Add you receiver email"
            titleClassName="text-base"
          >
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              {...register('email')}
              error={errors.email?.message}
            />
          </Fieldset>
        </Box>
      )}
    </Form>
  );
}
