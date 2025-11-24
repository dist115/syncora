import { Grid } from '@/components/atoms/layout';
import SimpleBar from '@/components/atoms/simplebar';
import {
  StorageStats,
  StorageStatsCard,
} from '@/components/molecules/stats-card/storage-stats-card';

export function DashboardStorageStats({
  storageStats,
  totalStorage,
}: {
  storageStats: StorageStats[];
  totalStorage: number;
}) {
  return (
    <SimpleBar>
      <Grid columns="4" className="gap-5 xl:gap-7 min-w-[1100px] 3xl:gap-8">
        {storageStats?.map((item: StorageStats) => (
          <StorageStatsCard
            key={item.type}
            cardData={item}
            totalStorage={totalStorage}
          />
        ))}
      </Grid>
    </SimpleBar>
  );
}
