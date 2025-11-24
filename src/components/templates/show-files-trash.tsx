'use client';

import { useState } from 'react';
import { type CompleteFile } from '@/db/schema';
import { Button } from 'rizzui';

import useQueryParams from '@/hooks/useQueryParam';
import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { DeleteSelectedFilesButton } from '@/components/organisms/delete-selected-files-button';
import { EmptyTrashButton } from '@/components/organisms/empty-trash-button';
import { TrashFoldersFiles } from '@/components/organisms/trash-folders-files';

export const ShowFilesTrash = ({
  files,
  totalFiles,
}: {
  files: CompleteFile[];
  totalFiles: number;
}) => {
  const { setQueryParams, queryParams } = useQueryParams();

  const [selectedFileFoldersIds, setSelectedFileFoldersIds] = useState<
    string[]
  >([]);

  const size = queryParams.size ? Number(queryParams.size) : 50;
  const handleLoadMore = () => {
    setQueryParams({ size: size + 50 }, true);
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <PageHeader
        title="Manage Trash"
        description="View and manage your files and folders from your trash"
        titleClassName="text-xl"
        className="items-start flex-col 375px:flex-row w-full 375px:w-auto 375px:items-center"
        headingWrapperClassName="w-auto shrink"
        childrenClassName="w-full 375px:w-auto shrink sm:flex sm:justify-end"
      >
        <div className="flex justify-end w-auto">
          {!!selectedFileFoldersIds.length && !!files.length && (
            <DeleteSelectedFilesButton
              selectedFileFolderIds={selectedFileFoldersIds}
              onSuccess={() => setSelectedFileFoldersIds([])}
            />
          )}
          {!!files.length && selectedFileFoldersIds.length === 0 && (
            <EmptyTrashButton selectedFileFoldersIds={selectedFileFoldersIds} />
          )}
        </div>
      </PageHeader>

      <TrashFoldersFiles
        files={files}
        totalFiles={totalFiles}
        selectedFileFoldersIds={selectedFileFoldersIds}
        setSelectedFileFoldersIds={setSelectedFileFoldersIds}
      />

      {totalFiles > size && (
        <Flex justify="center">
          <Button onClick={handleLoadMore}>Load more</Button>
        </Flex>
      )}
    </Flex>
  );
};
