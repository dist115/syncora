'use client';

import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Text } from 'rizzui';

import { Form, Switch } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';

export const TeamNotificationSettings = () => {
  const onSubmit: SubmitHandler<any> = async (inputs: any) => {
    console.table(inputs);
  };

  return (
    <Form<any>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: {
          id: '',
          email_notification: true,
          billing_notification: false,
          newsletter_notification: false,
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
            title="Team Notifications"
            description="Update your team notification settings"
            titleClassName="text-xl"
          >
            <Flex justify="end" className="w-full">
              <Button type="submit">Save changes</Button>
            </Flex>
          </PageHeader>
          <Flex direction="col" align="stretch" className="max-w-md gap-0">
            <Controller
              control={control}
              name="email_notification"
              render={({ field: { value, onChange } }) => {
                return (
                  <Flex>
                    <Text className="font-medium text-gray-700 dark:text-gray-300">
                      Email Notification
                    </Text>
                    <Switch checked={value} onChange={onChange} />
                  </Flex>
                );
              }}
            />

            <Controller
              control={control}
              name="billing_notification"
              render={({ field: { value, onChange } }) => {
                return (
                  <Flex>
                    <Text className="font-medium text-gray-700 dark:text-gray-300">
                      Billing Notification
                    </Text>
                    <Switch checked={value} onChange={onChange} />
                  </Flex>
                );
              }}
            />
            <Controller
              control={control}
              name="newsletter_notification"
              render={({ field: { value, onChange } }) => {
                return (
                  <Flex>
                    <Text className="font-medium text-gray-700 dark:text-gray-300">
                      Promotional Newsletter Notification
                    </Text>
                    <Switch checked={value} onChange={onChange} />
                  </Flex>
                );
              }}
            />
          </Flex>
        </Box>
      )}
    </Form>
  );
};
