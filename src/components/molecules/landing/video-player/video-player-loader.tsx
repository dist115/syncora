import { Text } from 'rizzui';

import { VideoPlayerLoaderVector } from '@/components/atoms/illustrations/video-player-loader-verctor';
import { Box } from '@/components/atoms/layout';

export function VideoPlayerLoader() {
  return (
    <Box className="w-full relative [@media(min-width:375px)]:w-[327px] [@media(min-width:500px)]:w-[400px] sm:w-[500px] md:!w-1/2 2xl:!w-[720px] 3xl:!w-[800px] md:mt-0 md:mb-0 mt-11 -mb-32 lg:p-4">
      <VideoPlayerLoaderVector className="w-full h-auto" />
      <Box className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
        <Box className="w-[54px] h-[54px] rounded-full  flex justify-center items-center">
          <Text
            as="span"
            className="rounded-full h-12 w-12 border border-t-0 border-r-0 border-[#3FA67A] animate-spin"
          />
        </Box>
      </Box>
    </Box>
  );
}
