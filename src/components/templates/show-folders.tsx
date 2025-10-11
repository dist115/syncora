import { CompleteUser } from '@/db/schema';
import {
  CompleteBreadcrumbs,
  CompleteFile,
  File,
  Folder,
} from '@/db/schema/files';
import { User } from 'lucia';
import { Text, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { Box, Flex } from '@/components/atoms/layout';

import { Breadcrumbs } from '../molecules/breadcrumbs/breadcrumbs';
import { CreateFolderButton } from '../organisms/create-folder-button';
import { UploadFileButton } from '../organisms/upload-file-button';

export const ShowFolders = async ({
  files,
  parentId,
  totalFiles,
  breadcrumbs,
  folders,
  user,
}: {
  files: CompleteFile[];
  parentId: any;
  totalFiles: number;
  user: User;
  breadcrumbs: CompleteBreadcrumbs[];
  folders: Folder[];
}) => {
  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <Flex>
        <Flex direction="col" align="stretch" className="gap-1.5 mb-10">
          <Title>Manage Files</Title>
          <Text>View and manage your files and folders</Text>
        </Flex>
        <CreateFolderButton parentId={parentId} />
        <UploadFileButton parentId={parentId} />
      </Flex>

      <Box className="mb-7">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </Box>

    </Flex>
  );
};
