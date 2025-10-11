'use client';

import { useState, useTransition } from 'react';
import { updateSettings } from '@/server/actions/settings.action';
import { Button } from 'rizzui';
import { toast } from 'sonner';

import { handleError } from '@/lib/utils/error';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { TextEditor } from '@/components/atoms/text-editor';

export function PrivacyPolicy({ data }: { data: string }) {
  const [isPending, startTransition] = useTransition();
  const [editorData, setEditorData] = useState<string>(data);

  function onSubmit() {
    startTransition(async () => {
      try {
        await updateSettings({ privacy_policy: editorData });
        toast.success('Privacy policy updated successfully!');
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <PageHeader
        title="Privacy Policy"
        description="Mange your privacy policies"
        titleClassName="text-xl"
        className="items-center"
        headingWrapperClassName="w-full 375px:w-auto"
        childrenClassName="shrink-0 375px:w-auto 375px:shrink"
      >
        <Flex justify="end" className="w-full 375px:w-auto">
          <Button
            className="w-full 375px:w-auto"
            isLoading={isPending}
            onClick={onSubmit}
          >
            Save changes
          </Button>
        </Flex>
      </PageHeader>
      <Box>
        <TextEditor
          defaultValue={data}
          onUpdate={(data) => setEditorData(data)}
        />
      </Box>
    </Flex>
  );
}
