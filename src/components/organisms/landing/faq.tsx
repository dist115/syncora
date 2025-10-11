'use client';

import Link from 'next/link';
import { RiArrowRightSLine } from 'react-icons/ri';
import { Accordion, Text, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { useIsClient } from '@/hooks/useIsClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { StaticPageFallbackIllustration } from '@/components/atoms/illustrations/fallbacks/static-page-fallback-illustration';
import { Box, Container, Flex, Grid, Section } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';
import { SectionHeader } from '@/components/molecules/landing/section-header';

function FaqAccordion({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Accordion className="rounded-xl px-[18px] py-3.5 sm:px-5 sm:py-[18px] md:px-6 md:py-5 border border-[#E2E8F0] ring-2 ring-[#F9F9FB]">
      <Accordion.Header className="flex justify-between items-center cursor-pointer">
        {/* @ts-ignore */}
        {({ open }) => (
          <>
            <Text
              as="span"
              className="font-semibold text-sm lg:text-base text-left text-custom-black max-w-[26ch] sm:max-w-[55ch] md:max-w-[62ch] lg:max-w-[39ch] xl:max-w-[50ch]"
            >
              {title}
            </Text>
            <RiArrowRightSLine
              className={cn(
                'h-4 shrink-0 w-4 scale-150 transform transition-transform duration-300',
                open && 'rotate-90'
              )}
            />
          </>
        )}
      </Accordion.Header>
      <Accordion.Body className="mt-5 lg:text-base lg:leading-7 text-[#434A54] leading-7">
        {description}
      </Accordion.Body>
    </Accordion>
  );
}

function AllFaqs({ allFaqs }: any) {
  const isMounted = useIsClient();
  const isLg = useMediaQuery('(min-width:1024px)');
  const oddFaqs = allFaqs.filter((faq: any, index: number) => index % 2 === 0);
  const evenFaqs = isLg
    ? allFaqs.filter((faq: any, index: number) => index % 2 === 1)
    : [];

  if (!isMounted) return null;

  return (
    <Grid className="grid-cols-1 lg:grid-cols-2 gap-10">
      <Box className="space-y-4 lg:space-y-6">
        {(isLg ? oddFaqs : allFaqs).map((item: any, idx: number) => (
          <FaqAccordion key={`faq-item-${idx}`} {...item} />
        ))}
      </Box>
      <Box className="space-y-4 lg:space-y-6 hidden lg:block">
        {evenFaqs.map((item: any, idx: number) => (
          <FaqAccordion key={`faq-item-${idx}`} {...item} />
        ))}
      </Box>
    </Grid>
  );
}

export default function Faq({ faq }: { faq: string }) {
  const parsedFaqs = faq ? JSON.parse(faq) : [];
  const allFaqs = [...parsedFaqs].filter((f) => f.title && f.description);

  return (
    <Section
      id="faq"
      className="pb-16 sm:pb-12 lg:pb-16 xl:pb-24 bg-white 2xl:pb-28 font-geist"
    >
      <Container className="md:px-8 px-4 mx-auto max-w-7xl lg:px-8">
        <SectionHeader
          title="Frequently Ask Question"
          description="Ask your question and meet"
          className="mb-8 lg:mb-16"
        />

        <Box className="space-y-12 xl:space-y-16">
          <Box className="w-full space-y-3">
            {!allFaqs.length ? (
              <Flex justify="center" className="w-full">
                <Fallback
                  illustration={StaticPageFallbackIllustration}
                  illustrationClassName="w-[300px] lg:w-[400px] h-auto"
                  title="No FAQ Found"
                  titleClassName="text-base sm:text-lg lg:text-xl"
                />
              </Flex>
            ) : (
              <AllFaqs allFaqs={allFaqs} />
            )}
          </Box>
          <Box className="w-full">
            <Box className="mb-4 lg:mb-6 space-y-3 lg:space-y-5 flex flex-col items-center">
              <Title
                as="h2"
                className="text-base leading-6 text-center mx-auto md:text-lg lg:mx-[unset] lg:text-2xl text-custom-black lg:leading-10 font-bold max-w-[25ch]"
              >
                Do you have any quesiton? Please ask here we ready to support
              </Title>
            </Box>
            <Flex justify="center" align="start">
              <Link
                href={PAGES.STATIC.CONTACT_US}
                className="inline-block bg-black rounded md:rounded-lg text-sm md:text-base text-white font-semibold duration-200 hover:bg-black/80 px-8 py-3 md:py-4"
              >
                <span className="hidden lg:inline-block">
                  Still Question?&nbsp;
                </span>
                Contact us
              </Link>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
