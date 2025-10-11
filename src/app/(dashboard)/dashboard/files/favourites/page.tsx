import { cookies } from 'next/headers';
import { CompleteFile } from '@/db/schema';
import { getFavouriteFiles } from '@/server/actions/files.action';
import { getAllFolders } from '@/server/actions/folders.action';
import { getAllTags } from '@/server/actions/tag.action';

import { FileSortType, SortOrderType } from '@/config/sorting';
import { getCurrentUser } from '@/lib/utils/session';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { ShowFiles } from '@/components/templates/show-files';

type SearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: FileSortType;
  order?: SortOrderType;
  tag?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();

  const { files, count } = await getFavouriteFiles({
    ...searchParams,
  });
  const folders = await getAllFolders(
    user?.id as string,
    user?.currentTeamId as string
  );

  const tags = await getAllTags({ search: '' });
  const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';

  return (
    <ShowFiles
      files={files as CompleteFile[]}
      totalFiles={count}
      folders={folders as CompleteFile[]}
      user={user}
      enableFileUpload={false}
      tags={tags}
      defaultLayout={defaultLayout as FilesLayoutType}
    />
  );
}
