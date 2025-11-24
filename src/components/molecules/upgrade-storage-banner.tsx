import Link from 'next/link';
import { CurrentTeam } from '@/server/dto/teams.dto';
import { Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { UpgradeStorageIllustration } from '@/components/atoms/illustrations/upgrade-storage-illustrations';
import { Box, Flex } from '@/components/atoms/layout';

export function UpgradeStorageBanner({
  className,
  currentTeam,
}: {
  className?: string;
  currentTeam?: CurrentTeam | null;
}) {
  return (
    <Box
      className={cn(
        'rounded-xl bg-gradient-to-br from-[#07B1F9] to-[#253943] p-8',
        className
      )}
    >
      <Box className="w-full px-4 mb-8">
        <UpgradeStorageIllustration className="w-full h-[198px]" />
      </Box>
      <Flex justify="center">
        <Link
          href={
            currentTeam
              ? PAGES.SETTINGS.TEAM.BILLING
              : PAGES.SETTINGS.USER.BILLING
          }
          className="rounded-xl p-3 3xl:p-4 w-full duration-150 max-w-[323px] mb-3 block text-center bg-white hover:bg-gray-200 text-custom-black text-sm font-bold"
        >
          Upgrade Storage
        </Link>
      </Flex>
      <Text className="text-white font-medium text-sm text-center">
        Upgrade your plan to get more space
      </Text>
    </Box>
  );
}
