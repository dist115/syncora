'use client';

import { useState } from 'react';
import { updateSettings } from '@/server/actions/settings.action';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button, Input, Textarea } from 'rizzui';
import { toast } from 'sonner';

import { handleError } from '@/lib/utils/error';
import {
  SiteSettingsInput,
  SiteSettingsSchema,
} from '@/lib/validations/site-settings.schema';
import { Card } from '@/components/atoms/card';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';

function FaqFields({ register, errors, control }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faq',
  });
  return (
    <Flex direction="col" align="stretch" className="gap-6">
      {fields.map((field, index) => (
        <Flex
          key={index}
          align="start"
          direction="col"
          className="sm:flex-row gap-4 xl:gap-7"
        >
          <Card className="w-full p-4 sm:p-5 md:p-6 lg:p-7">
            <Input
              {...register(`faq.${index}.title`)}
              placeholder="Title"
              className="mb-5"
              error={errors.faqs?.[index]?.title?.message}
            />
            <Textarea
              {...register(`faq.${index}.description`)}
              placeholder="Description"
            />
          </Card>
          <Flex justify="end" className="sm:w-20 gap-1.5 shrink-0">
            {index === fields.length - 1 && (
              <Button
                className="p-1 text-[#3d9215] hover:!text-[#3d9215]/70 hover:dark:!text-[#3d9215]/80 hover:dark:bg-transparent"
                variant="text"
                title="Add"
                onClick={() => append({ title: '', description: '' })}
              >
                <PlusCircle size={24} strokeWidth={1.25} />
              </Button>
            )}
            {fields.length > 1 && (
              <Button
                className="p-1 text-[#b52d1c] hover:!text-[#b52d1c]/70 hover:dark:!text-[#b52d1c]/80 hover:dark:bg-transparent"
                variant="text"
                title="Delete"
                onClick={() => remove(index)}
              >
                <MinusCircle size={24} strokeWidth={1.25} />
              </Button>
            )}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export function FaqForm({ faq }: { faq?: string | null }) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SiteSettingsInput> = async (inputs) => {
    setIsLoading(true);
    try {
      await updateSettings({ faq: JSON.stringify(inputs?.faq) });
      toast.success('FAQ updated successfully!');
      setIsLoading(false);
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
          faq: faq ? JSON.parse(faq) : [{ title: '', description: '' }],
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
          <Flex className="sticky top-16 lg:top-[70px] bg-white dark:bg-steel-900 pt-6 -mt-6 left-0 pb-0 mb-6 border-b border-steel-100 dark:border-steel-600/60 z-10">
            <PageHeader
              title="FAQ"
              description="Manage faqs"
              titleClassName="text-xl"
              className="items-center"
              headingWrapperClassName="w-full [@media(min-width:500px)]:!w-auto"
              childrenClassName="shrink-0 [@media(min-width:500px)]:!w-auto [@media(min-width:500px)]:!shrink"
            >
              <Flex
                justify="end"
                className="w-full [@media(min-width:500px)]:!w-auto"
              >
                <Button
                  className="w-full [@media(min-width:500px)]:!w-auto"
                  type="submit"
                  isLoading={isLoading}
                >
                  Save changes
                </Button>
              </Flex>
            </PageHeader>
          </Flex>

          <FaqFields register={register} errors={errors} control={control} />
        </Box>
      )}
    </Form>
  );
}
