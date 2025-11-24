import { cookies } from 'next/headers';
import { CompleteFile } from '@/db/schema';
import { getAnalyticsData } from '@/server/actions/analytics.action';
import { getFiles } from '@/server/actions/files.action';
import { getAllFolders } from '@/server/actions/folders.action';
import { getUserPermission } from '@/server/actions/permission.action';
import { getAllTags } from '@/server/actions/tag.action';
import { getCurrentTeam } from '@/server/actions/team.action';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import { FileSortType, SortOrderType } from '@/config/sorting';
import { getCurrentUser } from '@/lib/utils/session';
import Allow from '@/components/atoms/allow';
import { NoTeamIllustration } from '@/components/atoms/illustrations/fallbacks/no-team-illustration';
import { Flex } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { ShowFiles } from '@/components/templates/show-files';

type SearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: FileSortType;
  order?: SortOrderType;
  type?: string;
  tag?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [user, currentTeam, { files, count }, tags, permissions] =
    await Promise.all([
      getCurrentUser(),
      getCurrentTeam(),
      getFiles({ size: 50, ...searchParams }),
      getAllTags({ search: '' }),
      getUserPermission(),
    ]);
  // const user = await getCurrentUser();
  // const currentTeam = await getCurrentTeam();
  // const { totalStorage, totalUsed } = await getAnalyticsData(
  //   currentTeam?.id,
  //   user?.id
  // );

  const [{ totalStorage, totalUsed }, folders] = await Promise.all([
    getAnalyticsData(currentTeam?.id, user?.id),
    getAllFolders(user?.id as string, user?.currentTeamId as string),
  ]);

  const availableStorage = totalStorage - totalUsed.bytes;
  // const { files, count } = await getFiles({ size: 50, ...searchParams });
  // const folders = await getAllFolders(
  //   user?.id as string,
  //   user?.currentTeamId as string
  // );

  const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';

  // const tags = await getAllTags({ search: '' });
  // const permissions = await getUserPermission();
  return user.currentTeamId ? (
    <Allow
      access={PERMISSIONS.VIEW_FILES}
      mod={MODULE.FILE}
      rules={permissions}
      fallback={
        <Flex justify="center" className="mt-24">
          <Fallback
            illustration={NoTeamIllustration}
            illustrationClassName="w-[700px] h-auto"
            title="You have no Permission to view this page"
          />
        </Flex>
      }
    >
      <ShowFiles
        files={files as CompleteFile[]}
        totalFiles={count}
        folders={folders as CompleteFile[]}
        user={user}
        tags={tags}
        currentTeam={currentTeam}
        permissions={permissions}
        availableStorage={availableStorage}
        defaultLayout={defaultLayout as FilesLayoutType}
      />
    </Allow>
  ) : (
    <ShowFiles
      files={files as CompleteFile[]}
      totalFiles={count}
      folders={folders as CompleteFile[]}
      user={user}
      tags={tags}
      currentTeam={currentTeam}
      permissions={permissions}
      availableStorage={availableStorage}
      defaultLayout={defaultLayout as FilesLayoutType}
    />
  );
}
