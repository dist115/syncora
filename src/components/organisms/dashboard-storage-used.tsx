'use client';

import { FileUsageReport } from '@/server/dto/files.dto';
import { Badge, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import { Card } from '@/components/atoms/card';
import { Box, Flex } from '@/components/atoms/layout';
import StorageReport from '@/components/molecules/storage-report';

export function DashboardStorageUsed({
  totalUsed,
  usageReport,
  className,
}: {
  totalUsed: number;
  usageReport: FileUsageReport[];
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'p-4 lg:p-5 xl:p-6 pb-4 bg-transparent dark:bg-transparent rounded-xl',
        className
      )}
    >
      <Box>
        <Flex
          justify="between"
          direction="col"
          align="start"
          className="sm:flex-row "
        >
          <Box>
            <Text className="lg:text-base text-[#475569] dark:text-slate-400 mb-2">
              Total Storage used{' '}
            </Text>
            <Text className="text-lg md:text-xl lg:text-2xl font-semibold text-custom-black dark:text-slate-300">
              {formatFileSize(totalUsed)}
            </Text>
          </Box>
          {!!totalUsed && (
            <Flex className="inline-flex w-auto flex-wrap gap-4 gap-y-2 justify-start">
              <Text as="span" className="inline-flex items-center">
                <Badge renderAsDot className="me-1 bg-[#2633CA]" /> Image
              </Text>
              <Text as="span" className="inline-flex items-center">
                <Badge renderAsDot className="me-1 bg-[#4052F6]" /> Video
              </Text>
              <Text as="span" className="inline-flex items-center">
                <Badge renderAsDot className="me-1 bg-[#97C0FF]" />
                Musics
              </Text>
              <Text as="span" className="inline-flex items-center">
                <Badge renderAsDot className="me-1 bg-[#DDEAFC]" />
                Documents
              </Text>
            </Flex>
          )}
        </Flex>
        <StorageReport totalUsed={totalUsed} data={usageReport} />
      </Box>
    </Card>
  );
}
