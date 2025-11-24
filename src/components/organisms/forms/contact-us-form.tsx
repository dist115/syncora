'use client';

import { useState } from 'react';
import { verifyCaptchaAction } from '@/server/actions/captcha.action';
import { handleContact } from '@/server/actions/contact-us.action';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { SubmitHandler } from 'react-hook-form';
import { RiArrowRightLine } from 'react-icons/ri';
import { Button, Input, Textarea } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { cn } from '@/lib/utils/cn';
import { handleError } from '@/lib/utils/error';
import {
  ContactUsInput,
  ContactUsSchema,
} from '@/lib/validations/contact-us.schema';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const ContactUsForm = ({ className }: { className?: string }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<ContactUsInput> = async (
    inputs: ContactUsInput
  ) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      setIsLoading(false);
      return;
    }
    const token = await executeRecaptcha('onSubmit');
    const verified = await verifyCaptchaAction(token);
    if (!verified) {
      toast.error(MESSAGES.INVALID_CAPTCHA);
      setReset({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsLoading(false);
      return;
    }
    try {
      await handleContact(inputs);
      setReset({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      toast.success(MESSAGES.YOUR_MESSAGE_HAS_BEEN_TRANSMITTED);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form<ContactUsInput>
      validationSchema={ContactUsSchema}
      onSubmit={onSubmit}
      resetValues={reset}
      useFormProps={{
        defaultValues: {
          name: '',
          email: '',
          subject: '',
          message: '',
        },
      }}
    >
      {({ register, formState: { errors } }) => (
        <Flex
          direction="col"
          align="stretch"
          className={cn('gap-5 lg:gap-8', className)}
        >
          <Box>
            <Input
              autoComplete="off"
              type="text"
              label="Full Name *"
              labelClassName="lg:text-lg text-custom-black font-semibold mb-2 lg:mb-4"
              placeholder="Enter name"
              {...register('name')}
              error={errors.name?.message}
              className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-16 lg:[&_.rizzui-input-container]:px-7"
              inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 lg:text-lg text-[#475569]"
            />
          </Box>

          <Box>
            <Input
              autoComplete="off"
              type="text"
              label="Your Email *"
              labelClassName="lg:text-lg text-custom-black font-semibold mb-2 lg:mb-4"
              placeholder="Enter email"
              {...register('email')}
              error={errors.email?.message}
              className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-16 lg:[&_.rizzui-input-container]:px-7"
              inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 lg:text-lg text-[#475569]"
            />
          </Box>

          <Box>
            <Input
              autoComplete="off"
              type="text"
              label="Subject *"
              labelClassName="lg:text-lg text-custom-black font-semibold mb-2 lg:mb-4"
              placeholder="Enter subject"
              {...register('subject')}
              error={errors.subject?.message}
              className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-16 lg:[&_.rizzui-input-container]:px-7"
              inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 lg:text-lg text-[#475569]"
            />
          </Box>

          <Box>
            <Textarea
              autoComplete="off"
              label="Message *"
              labelClassName="lg:text-lg text-custom-black font-semibold mb-2 lg:mb-4"
              placeholder="Enter your message"
              {...register('message')}
              error={errors.message?.message}
              className="lg:[&_textarea]:rounded-xl 2xl:[&_textarea]:h-[256px] lg:[&_textarea]:py-4 lg:[&_textarea]:px-7 lg:[&_textarea]:text-lg [&_textarea]:text-[#475569] [&_textarea]:placeholder:text-[#475569]/70 [&_textarea]:border-0 [&_textarea.is-focus]:border-1 [&_textarea.is-focus]:ring-2 [&_textarea.is-focus]:ring-gray-500 [&_textarea]:ring-[#CBD5E1]"
            />
          </Box>

          <Flex justify="center" className="lg:mt-4 mt-1">
            <Button
              isLoading={isLoading}
              type="submit"
              size="lg"
              className="flex text-sm lg:text-base h-10 lg:h-12 px-3.5 lg:px-5 gap-2"
            >
              Send Message
              <RiArrowRightLine />
            </Button>
          </Flex>
        </Flex>
      )}
    </Form>
  );
};
