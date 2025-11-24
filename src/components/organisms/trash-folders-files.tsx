import { Dispatch, SetStateAction } from 'react';
import { CompleteFile } from '@/db/schema';
import { isEmpty } from 'lodash';

import { EmptyTrashIllustration } from '@/components/atoms/illustrations/fallbacks/empty-trash-illustration';
import { Flex, Grid } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';
import { TrashFileView } from '@/components/molecules/trash/file-view';
import { TrashFolderView } from '@/components/molecules/trash/folder-view';

export const TrashFoldersFiles = ({
  files,
  selectedFileFoldersIds,
  setSelectedFileFoldersIds,
}: {
  files: CompleteFile[];
  totalFiles: number;
  selectedFileFoldersIds: string[];
  setSelectedFileFoldersIds: Dispatch<SetStateAction<string[]>>;
}) => {
  const filesElementList = files.map((file) => {
    switch (file.type) {
      case 'folder':
        return (
          <TrashFolderView
            selectedFileFoldersIds={selectedFileFoldersIds}
            setSelectedFileFoldersIds={setSelectedFileFoldersIds}
            file={file}
            key={file.id}
          />
        );

      default:
        return (
          <TrashFileView
            selectedFileFoldersIds={selectedFileFoldersIds}
            setSelectedFileFoldersIds={setSelectedFileFoldersIds}
            file={file}
            key={file.id}
          />
        );
    }
  });

  if (isEmpty(filesElementList))
    return (
      <Flex justify="center" className="py-12">
        <Fallback
          illustration={EmptyTrashIllustration}
          illustrationClassName="w-[400px] max-w-full h-auto"
          title="Trash is empty"
        />
      </Flex>
    );

  return (
    <Grid
      columns="2"
      className="gap-4 mb-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-8"
    >
      {filesElementList}
    </Grid>
  );
};
