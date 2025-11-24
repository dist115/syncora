import { CompleteTeam, type CompleteFile } from '@/db/schema';

import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { FilesTable } from '@/components/organisms/files-table';

export const ShowAdminFiles = async ({
  files,
  totalFiles,
  teams,
}: {
  files: CompleteFile[];
  totalFiles: number;
  teams: CompleteTeam[];
}) => {
  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <PageHeader
        title="Manage Files"
        description="View and manage files"
        titleClassName="text-xl"
      />

      <FilesTable files={files} totalFiles={totalFiles} teams={teams} />
    </Flex>
  );
};
