'use client';

import { CompleteFile } from '@/db/schema';
import { FileUsageReport } from '@/server/dto/files.dto';
import { CurrentTeam } from '@/server/dto/teams.dto';

import { Box, Grid } from '@/components/atoms/layout';
import { DashboardStorageStats } from '@/components/molecules/dashboard-storage-stats';
import { StorageStats } from '@/components/molecules/stats-card/storage-stats-card';
import { UpgradeStorageBanner } from '@/components/molecules/upgrade-storage-banner';
import { DashboardFilesTable } from '@/components/organisms/dashboard-files-table';
import { DashboardFolderWidget } from '@/components/organisms/dashboard-folders-widget';
import { DashboardRecentActivities } from '@/components/organisms/dashboard-recent-activities';
import { DashboardStorageSummary } from '@/components/organisms/dashboard-storage-summary';
import { DashboardStorageUsed } from '@/components/organisms/dashboard-storage-used';

export default function Dashboard({
  folders,
  usageReport,
  currentTeam,
  storageStats,
  totalUsed,
  totalStorage,
  allFiles,
  recentActivities,
}: {
  folders: CompleteFile[];
  usageReport: FileUsageReport[];
  allFiles: CompleteFile[];
  currentTeam: CurrentTeam | null;
  storageStats: StorageStats[];
  totalUsed: number;
  totalStorage: number;
  recentActivities: CompleteFile[];
}) {
  return (
    <Box className="@container space-y-8">
      <DashboardStorageStats
        totalStorage={totalStorage}
        storageStats={storageStats}
      />
      <Grid columns="11" className="gap-7 3xl:grid-cols-12 3xl:gap-8">
        <DashboardStorageUsed
          className="col-span-full lg:col-span-8 xl:col-span-7 3xl:col-span-9"
          totalUsed={totalUsed}
          usageReport={usageReport}
        />
        <DashboardStorageSummary
          totalStorage={totalStorage}
          totalUsed={totalUsed}
        />
      </Grid>
      <Grid columns="11" className="gap-7 3xl:grid-cols-12 3xl:gap-8">
        <Box className="col-span-full xl:col-span-7 3xl:col-span-9 space-y-7 3xl:space-y-8">
          <DashboardFolderWidget folders={folders} />
          <DashboardFilesTable files={allFiles} />
        </Box>
        <Box className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 xl:flex xl:flex-col xl:col-span-4 3xl:col-span-3 gap-7">
          <DashboardRecentActivities
            currentTeamId={currentTeam?.id as string}
            recentActivitiesFiles={recentActivities}
          />
          <UpgradeStorageBanner
            currentTeam={currentTeam}
            className="h-[378px]"
          />
        </Box>
      </Grid>
    </Box>
  );
}
