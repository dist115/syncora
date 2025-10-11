import { Progressbar, Text } from 'rizzui';

import {
  calculatePercentage,
  formatFileSize,
} from '@/lib/utils/formatFileSize';
import { Card } from '@/components/atoms/card';
import { Box, Flex } from '@/components/atoms/layout';

import { DocumentIcon } from './icons/document';
import { ImageIcon } from './icons/image';
import { MusicIcon } from './icons/music';
import { VideoIcon } from './icons/video';

const ICONS = {
  image: ImageIcon,
  video: VideoIcon,
  audio: MusicIcon,
  document: DocumentIcon,
};

type IconType = keyof typeof ICONS;

export type StorageStats = {
  type: string;
  count: string;
  size: string;
};

type Props = {
  cardData: StorageStats;
  totalStorage: number;
};

export function StorageStatsCard(props: Props) {
  const { cardData, totalStorage } = props;
  const Icon = ICONS[cardData.type as IconType];

  const size = Number(cardData.size);

  return (
    <Card className="flex min-w-[200px] items-center p-4 lg:p-5 xl:p-6 3xl:p-7 rounded-xl bg-transparent dark:bg-transparent">
      <Box className="w-full">
        <Icon className="w-10 lg:w-12 3xl:w-[52px] h-auto mb-5 3xl:mb-7" />
        <Text className="font-semibold text-sm lg:text-base 3xl:text-lg capitalize text-custom-black dark:text-gray-400 mb-4 3xl:mb-5">
          {cardData.type}
        </Text>
        <Flex direction="col" className="gap-4" align="start">
          <Progressbar
            aria-label={`${cardData.type} usage progress`}
            className="h-1.5"
            barClassName="rounded-full"
            value={calculatePercentage(size, totalStorage)}
          />
          <Text className="text-sm lg:text-base">
            <Text
              as="span"
              className="text-custom-black dark:text-gray-400 font-medium"
            >
              {formatFileSize(size)}
            </Text>{' '}
            <Text as="span" className="text-[#475569]">
              of {formatFileSize(totalStorage)}
            </Text>
          </Text>
        </Flex>
      </Box>
    </Card>
  );
}
