import Image from 'next/image';
import { Text, Title } from 'rizzui';

import { Box, Container, Flex } from '@/components/atoms/layout';
import { PrivacyContent } from '@/components/organisms/privacy-content';

export function ShowPrivacyPolicy({
  privacyPolicy,
}: {
  privacyPolicy: string;
}) {
  return (
    <Box className="font-geist pb-8 md:pb-12 xl:pb-20">
      <header className="bg-[#141D25] pb-12 sm:pb-16 lg:pb-24 xl:aspect-[1920/840] font-geist relative w-full overflow-hidden">
        <Image
          src="/assets/green-globe-bg.webp"
          alt="green-globe-bg"
          width={1920}
          height={840}
          className="w-full h-full xl:aspect-[1920/840] object-cover 2xl:h-auto absolute top-0 left-0 pointer-events-none"
        />
        <Container className="max-w-[120rem] px-4 md:px-8 lg:pt-16 3xl:px-40">
          <Flex
            direction="col"
            className="mx-auto pt-24 gap-2 md:gap-4 xl:gap-6 2xl:pt-[120px] 3xl:pt-[120px] [@media(min-width:1920px)]:pt-[160px] 4xl:!pt-[190px] 5xl:!pt-[350px] text-white relative z-[2]"
          >
            <Title className="text-center 2xl:text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px]">
              Privacy Policy
            </Title>
            <Text className="lg:text-base xl:text-lg">
            Commitment to Your Privacy and Data Security
            </Text>
          </Flex>
        </Container>
      </header>
      <Box className="mt-4 md:mt-8 xl:-mt-[240px] [@media(min-width:1440px)]:-mt-[290px] 2xl:!-mt-[320px] 3xl:!-mt-[420px] 4xl:!-mt-[500px] relative z-[2]">
        <Container className="max-w-[1344px] w-full px-4 md:px-8">
          <PrivacyContent privacyPolicy={privacyPolicy} />
        </Container>
      </Box>
    </Box>
  );
}
