'use client';

import { useState } from 'react';
import { type User } from '@/db/schema';
import { updateProfile } from '@/server/actions/user.action';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Input, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';
import { acceptedFileType } from '@/lib/utils/image';
import { uploadSingleFile } from '@/lib/utils/s3/upload-single';
import {
  UpdateProfileInput,
  UpdateProfileSchema,
} from '@/lib/validations/user.schema';
import { Uploader } from '@/components//molecules/uploader/uploader';
import { Fieldset, Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';

export const UpdateProfileForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<UpdateProfileInput> = async (inputs) => {
    try {
      setIsLoading(true);
      if (Array.isArray(inputs.image)) {
        const image = await uploadSingleFile(inputs.image[0]);
        inputs.image = image;
      }
      await updateProfile(inputs);
      toast.success(MESSAGES.PROFILE_UPDATED_SUCCESSFULLY);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<UpdateProfileInput>
        validationSchema={UpdateProfileSchema}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            name: user.name || '',
            email: user.email,
            image: user.image || '',
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
              title="Update your profile"
              description="View and update your profile"
              titleClassName="text-lg xl:text-xl"
              childrenClassName="flex [@media(min-width:375px)]:inline-flex"
              className="items-center"
              headingWrapperClassName="[@media(min-width:375px)]:w-auto"
            >
              <Flex justify="end">
                <Button
                  isLoading={isLoading}
                  type="submit"
                  className="w-full [@media(min-width:375px)]:w-auto"
                >
                  Save changes
                </Button>
              </Flex>
            </PageHeader>
            <Fieldset title="Name" required>
              <Input
                type="text"
                placeholder="Enter your name"
                className="[&>label>span]:font-medium"
                {...register('name')}
                error={errors.name?.message}
              />
            </Fieldset>

            <Fieldset title="Email" description="Save your email from here">
              <Input
                type="email"
                placeholder="Enter your email"
                className="[&>label>span]:font-medium"
                {...register('email')}
                error={errors.email?.message}
              />
            </Fieldset>

            <Fieldset title="Avatar">
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => {
                  return (
                    <Flex direction="col" align="stretch">
                      <Uploader
                        onChange={onChange}
                        variant="avatar"
                        placeholder="JPG, JPEG, PNG and WEBP. 5MB max."
                        defaultValue={defaultValues?.image}
                        accept={acceptedFileType()}
                      />
                      <Text className="text-red text-xs mt-0.5">
                        {errors.image?.message as string}
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
};
