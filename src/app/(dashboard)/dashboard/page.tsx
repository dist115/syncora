import { CompleteFile } from '@/db/schema';
import { getAnalyticsData } from '@/server/actions/analytics.action';
import { getFiles } from '@/server/actions/files.action';
import { getCurrentTeam } from '@/server/actions/team.action';

import { getCurrentUser } from '@/lib/utils/session';
import { StorageStats } from '@/components/molecules/stats-card/storage-stats-card';
import Dashboard from '@/components/templates/dashboard';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: any }) {
  const currentTeam = await getCurrentTeam();
  const user = await getCurrentUser();
  const { files: allFiles } = await getFiles(
    { ...searchParams, size: 10 },
    { excludeByType: 'folder', allFiles: true }
  );
  const { files: recentFiles } = await getFiles({
    sort: 'updatedAt',
    order: 'desc',
  });
  const {
    fileTypeStats,
    usageReportByMonth,
    totalUsed,
    totalStorage,
    allFolders,
  } = await getAnalyticsData(currentTeam?.id, user?.id);

  return (
    <Dashboard
      usageReport={usageReportByMonth}
      folders={allFolders as CompleteFile[]}
      recentActivities={recentFiles as CompleteFile[]}
      allFiles={allFiles as CompleteFile[]}
      totalUsed={totalUsed.bytes}
      currentTeam={currentTeam}
      totalStorage={totalStorage}
      storageStats={fileTypeStats as unknown as StorageStats[]}
    />
  );
}
