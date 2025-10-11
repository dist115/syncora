import { Text } from 'rizzui';

import { Card } from '@/components/atoms/card';
import StorageSummary from '@/components/molecules/storage-summary';

export function DashboardStorageSummary({
  totalStorage,
  totalUsed,
}: {
  totalStorage: number;
  totalUsed: number;
}) {
  return (
    <Card className="col-span-full p-0 lg:col-span-3 xl:col-span-4 3xl:col-span-3 bg-transparent dark:bg-transparent rounded-xl">
      <Text className="p-4 lg:p-5 xl:p-6 pb-0 lg:pb-0 xl:pb-0 font-bold lg:text-lg text-custom-black dark:text-slate-300">
        Storage
      </Text>
      <StorageSummary totalStorage={totalStorage} totalUsed={totalUsed} />
    </Card>
  );
}
