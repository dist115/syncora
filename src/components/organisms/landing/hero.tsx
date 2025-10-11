'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Link as ReactScrollLink } from 'react-scroll';
import { Text, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { Box, Container, Flex, Section } from '@/components/atoms/layout';
import { VideoPlayerLoader } from '@/components/molecules/landing/video-player/video-player-loader';

const IntroVideo = dynamic(
  () =>
    import('@/components/molecules/landing/video-player/video-player').then(
      (module) => module.IntroVideo
    ),
  {
    ssr: false,
    loading: () => <VideoPlayerLoader />,
  }
);

export default function Hero() {
  return (
    <Section
      id="hero"
      className="bg-[#141D25] [background-image:url('/assets/hero-bg-sm.webp')] md:[background-image:url('/assets/hero-bg.webp')] bg-cover bg-no-repeat mb-[158px] md:mb-0 pt-20 3xl:pt-[6rem] lg:pb-5 3xl:pb-[177px] bg-full bg-top relative font-geist"
    >
      <Container className="max-w-[120rem] md:px-8 3xl:px-40 px-4 relative z-10">
        <Flex
          direction="col"
          className="justify-between 2xl:justify-center 3xl:justify-between gap-16 md:flex-row items-center mt-12 md:pb-12 lg:mt-16 xl:mt-[120px] 2xl:mt-[130px] 3xl:mt-[150px]"
        >
          <Box>
            <Box className="mb-7 lg:mb-12 3xl:mb-16">
              <Title
                as="h1"
                className="text-white/90 text-[28px] mx-auto lg:mx-[unset] text-center md:text-left lg:text-3xl lg:leading-[1.3] xl:text-[46px] 3xl:text-[52px] 3xl:leading-[1.4] mb-2 lg:mb-5 font-bold max-w-[16ch]"
              >
                Empower your workspace simplify your files with Syncora
              </Title>
              <Text
                as="p"
                className="text-[#eee] text-sm mx-auto md:mx-[unset] text-center md:text-left leading-[1.5] lg:text-base 3xl:text-lg 3xl:leading-[32px] max-w-[28ch] lg:max-w-[32ch] xl:max-w-[40ch]"
              >
                Streamline, secure, and share files effortlessly. Boost
                collaboration and productivity in one intuitive platform.
              </Text>
            </Box>
            <Flex
              align="stretch"
              className="flex gap-4 justify-center md:justify-start"
            >
              <ReactScrollLink
                to="newsletter"
                smooth
                offset={-80}
                className={cn(
                  'inline-flex cursor-pointer h-[unset] items-center justify-center bg-[#141D25] group rounded-lg relative overflow-hidden border border-white/20 duration-200 hover:border-white/40',
                  'text-black bg-white hover:bg-white/80 font-medium py-2 px-5 rounded text-xs xl:text-base xl:py-4 xl:px-10 xl:rounded-lg'
                )}
              >
                Subscribe
              </ReactScrollLink>

              <Link
                href={PAGES.STATIC.PRICING}
                className={cn(
                  'inline-flex items-center h-[unset] justify-center bg-[#141D25] group rounded-lg text-white relative overflow-hidden border border-white/20 duration-200 hover:border-white/40',
                  'font-medium py-2 px-5 rounded text-xs xl:text-base xl:py-4 xl:px-10 xl:rounded-lg'
                )}
              >
                <Text
                  as="span"
                  className="absolute select-none top-0 left-1/2 pointer-events-none z-0 -translate-x-1/2 w-full h-1/2"
                >
                  <Image
                    src={'/assets/angular-gradient.webp'}
                    alt="angular-gradient"
                    className="w-full full"
                    width={100}
                    height={60}
                    priority
                  />
                </Text>
                <Text as="span">Free Trial</Text>
              </Link>
            </Flex>
          </Box>
          <IntroVideo videoUrl="https://pub-f0aafe24067b4986a388ba29dad82bf4.r2.dev/image%2Ffilekit-intro.mp4" />
        </Flex>
      </Container>
    </Section>
  );
}
