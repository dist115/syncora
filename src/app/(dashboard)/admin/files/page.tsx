import { getAllFiles } from '@/server/actions/files.action';
import { getAllTeams } from '@/server/actions/team.action';

import { ShowAdminFiles } from '@/components/templates/show-admin-files';

type SearchParamsType = {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const { count, files } = await getAllFiles({
    size: 10,
    page: 1,
    ...searchParams,
  });
  const { teams } = await getAllTeams({});

  return <ShowAdminFiles files={files} totalFiles={count} teams={teams} />;
}
