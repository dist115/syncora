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
import { EncryptionPasswordDialog } from './encryption-password-dialog';
import { useEncryption } from '@/hooks/use-encryption';
import { arrayBufferToBase64 } from '@/lib/crypto/encryption';

export const UploadFileForm = () => {
  const { props, closeDrawer } = useDrawer();
  const [files, setFiles] = useState<File[] | null>(null);
  const [reset, setReset] = useState({});
  const [isMaxLimitExceeded, setIsMaxLimitExceeded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<UploadFileInput | null>(null);
  const { parentId, availableStorage }: any = props;
  const { encryptFile, isEncrypting } = useEncryption();
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

  const handleEncryptAndUpload = async (
    inputs: UploadFileInput,
    password: string
  ) => {
    try {
      if (isEmpty(inputs.file)) return;
      setIsUploading(true);
      setShowPasswordDialog(false);

      // Encrypt files before upload
      const encryptedFiles = [];
      for (const file of inputs.file) {
        toast.info(`Encrypting ${file.name}...`);
        const encrypted = await encryptFile(file, password);
        
        // Create a new File object from encrypted blob
        const encryptedFile = new File(
          [encrypted.encryptedContent],
          file.name,
          { type: 'application/octet-stream' }
        );

        encryptedFiles.push({
          file: encryptedFile,
          encryptedKey: encrypted.encryptedKey,
          iv: encrypted.iv,
          metadata: encrypted.metadata,
        });
      }

      // Upload encrypted files
      const uploadData = await uploadFilesAndGetPaths(
        encryptedFiles.map(ef => ef.file),
        handleProgress,
        parentId
      );

      // Add encryption metadata to upload data
      const enrichedUploadData = uploadData.map((data: any, index: number) => ({
        ...data,
        encryptedKey: encryptedFiles[index].encryptedKey,
        encryptionIv: encryptedFiles[index].iv,
        isEncrypted: true,
        encryptionVersion: '1.0',
      }));

      await uploadFile(enrichedUploadData);

      setIsUploading(false);
      setReset({ file: [] });
      closeDrawer();
      toast.success('Files encrypted and uploaded successfully!');
    } catch (error) {
      setIsUploading(false);
      handleError(error);
    }
  };

  const onSubmit: SubmitHandler<UploadFileInput> = async (
    inputs: UploadFileInput
  ) => {
    // Show password dialog for encryption
    setPendingFiles(inputs);
    setShowPasswordDialog(true);
  };

  const handlePasswordConfirm = (password: string) => {
    if (pendingFiles) {
      handleEncryptAndUpload(pendingFiles, password);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordDialog(false);
    setPendingFiles(null);
    setIsUploading(false);
  };

  return (
    <>
      <EncryptionPasswordDialog
        isOpen={showPasswordDialog}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
      />

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
              {isEncrypting && (
                <Box className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Text className="text-sm text-blue-600 dark:text-blue-400">
                    🔐 Encrypting files... This may take a moment.
                  </Text>
                </Box>
              )}

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
                        placeholder="Upload your files. 5MB max. Files will be encrypted."
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
                  disabled={isMaxLimitExceeded || isEncrypting}
                  isLoading={isUploading || isEncrypting}
                  type="submit"
                  size="lg"
                  className="w-full"
                >
                  {isEncrypting ? 'Encrypting...' : 'Encrypt & Upload'}
                </Button>
              </FixedDrawerBottom>
            </Flex>
          )}
        </Form>
      </Flex>
    </>
  );
};