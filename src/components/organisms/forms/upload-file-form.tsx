'use client';

import { useState } from 'react';
import { uploadFile } from '@/server/actions/files.action';
import isEmpty from 'lodash/isEmpty';
import { CheckIcon, XIcon } from 'lucide-react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { ActionIcon, Button, Progressbar, Text } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import { acceptedMimeType, uploadFilesAndGetPaths } from '@/lib/utils/file';
import { getFileType } from '@/lib/utils/getFileType';
import {
  UploadFileInput,
  UploadFileSchema,
} from '@/lib/validations/file.schema';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import { Uploader } from '@/components/molecules/uploader/uploader';

export const UploadFileForm = () => {
  const { props, closeDrawer } = useDrawer();
  const [files, setFiles] = useState<File[] | null>(null);
  const [reset, setReset] = useState({});
  const [isMaxLimitExceeded, setIsMaxLimitExceeded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { parentId, availableStorage }: any = props;
  const [allProgress, setAllProgress] = useState<{
    [key: number]: {
      progress: number;
      file: string;
      signal?: AbortController;
    };
  }>({});

  const handleProgress = (index: number, file: string) => {
    return (progress: number, signal?: AbortController) => {
      setAllProgress((prev) => ({
        ...prev,
        [index]: {
          progress,
          file,
          signal,
        },
      }));
    };
  };

  const onSubmit: SubmitHandler<UploadFileInput> = async (
    inputs: UploadFileInput
  ) => {
    try {
      if (isEmpty(inputs.file)) return;
      setIsUploading(true);

      const uploadData = await uploadFilesAndGetPaths(
        inputs.file,
        handleProgress,
        parentId
      );
      await uploadFile(uploadData);

      setIsUploading(false);
      setReset({ file: [] });
      closeDrawer();
      toast.success(MESSAGES.FILES_UPLOAD_COMPLETED);
    } catch (error) {
      setIsUploading(false);
      handleError(error);
    }
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<UploadFileInput>
        validationSchema={UploadFileSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({
          register,
          control,
          setValue,
          formState: { errors, defaultValues },
        }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Controller
              control={control}
              name="file"
              render={({ field: { value, onChange } }) => {
                return (
                  <Flex direction="col" align="stretch">
                    <Uploader
                      multiple
                      onChange={(files: File[]) => {
                        setFiles(files);
                        const sizeTotal = files.reduce(
                          (acc: number, file: File) => acc + file.size,
                          0
                        );
                        if (sizeTotal > availableStorage!) {
                          toast.error(MESSAGES.MAX_UPLOAD_LIMIT_EXCEED);
                          setIsMaxLimitExceeded(true);
                        } else {
                          setIsMaxLimitExceeded(false);
                        }
                        onChange(files);
                      }}
                      placeholder="Upload your files. 5MB max."
                      defaultValue={defaultValues?.file}
                      accept={acceptedMimeType()}
                      isUploading={!isEmpty(allProgress)}
                    />
                    <Text className="text-red text-xs mt-0.5">
                      {errors.file?.message as string}
                    </Text>
                  </Flex>
                );
              }}
            />

            {Object.keys(allProgress).map((key, index) => {
              const { progress, file, signal } = allProgress[Number(key)];
              const iconType =
                files && (getFileType(files[index]) as FileIconType);

              return (
                <Box key={key} className="flex items-center gap-6">
                  <DynamicFileIcon
                    className="w-12 h-12 text-steel-400 dark:text-steel-200"
                    iconType={iconType}
                  />
                  <Box className="grow">
                    <Text className="mb-1.5 truncate">
                      {file.length > 50 ? `${file.substring(0, 30)}...` : file}
                    </Text>
                    <Flex>
                      <Progressbar value={progress} label={`${progress}%`} />
                      {progress < 100 ? (
                        <ActionIcon
                          className="rounded hover:bg-steel-100/50 dark:hover:bg-steel-600/50"
                          variant="text"
                          size="sm"
                          onClick={() => signal?.abort()}
                        >
                          <XIcon
                            className="text-steel-500 dark:text-steel-400"
                            strokeWidth={1.5}
                            size={22}
                          />
                        </ActionIcon>
                      ) : (
                        <Box className="p-0.5">
                          <CheckIcon
                            strokeWidth={1.5}
                            size={22}
                            className="text-green"
                          />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Box>
              );
            })}

            <FixedDrawerBottom>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={closeDrawer}
              >
                Cancel
              </Button>

              <Button
                disabled={isMaxLimitExceeded}
                isLoading={isUploading}
                type="submit"
                size="lg"
                className="w-full"
              >
                Upload
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
