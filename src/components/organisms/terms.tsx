'use client';

import { useState, useTransition } from 'react';
import { updateSettings } from '@/server/actions/settings.action';
import { Button } from 'rizzui';
import { toast } from 'sonner';

import { handleError } from '@/lib/utils/error';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { TextEditor } from '@/components/atoms/text-editor';

export function Terms({ data }: { data: string }) {
  const [isPending, startTransition] = useTransition();
  const [editorData, setEditorData] = useState<string>(data);

  function onSubmit() {
    startTransition(async () => {
      try {
        await updateSettings({ terms: editorData });
        toast.success('Terms updated successfully!');
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <PageHeader
        title="Terms and Conditions"
        description="Mange your terms and conditions"
        titleClassName="text-xl"
        className="items-center"
        headingWrapperClassName="w-full [@media(min-width:500px)]:w-auto"
        childrenClassName="shrink-0 [@media(min-width:500px)]:w-auto [@media(min-width:500px)]:shrink"
      >
        <Flex justify="end" className="w-full [@media(min-width:500px)]:w-auto">
          <Button
            className="w-full [@media(min-width:500px)]:w-auto"
            isLoading={isPending}
            onClick={onSubmit}
          >
            Save changes
          </Button>
        </Flex>
      </PageHeader>
      <Box className="mt-0">
        <TextEditor
          defaultValue={data}
          onUpdate={(data) => setEditorData(data)}
        />
      </Box>
    </Flex>
  );
}
