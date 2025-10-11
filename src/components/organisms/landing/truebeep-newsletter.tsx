'use client';

import Link from 'next/link';
import { Text, Title } from 'rizzui';

import { GradientBorder } from '@/components/atoms/gradient-border';
import { Container, Flex, Section } from '@/components/atoms/layout';

import { Socials } from './newsletter';

const truebeepCustomerPageUrl =
  'https://app.truebeep.com/beeper/z6xnm2vcow5v6ho6ck1big83';

export function TruebeepNewsletter() {
  return (
    <Section
      id="newsletter"
      className="pt-12 lg:pb-2 lg:pt-16 xl:pt-24 xl:pb-12 font-geist"
    >
      <Container className="max-w-[120rem] md:px-8 3xl:px-40 px-8">
        <Flex
          align="center"
          direction="col"
          justify="start"
          className="gap-0 max-w-[300px] md:max-w-[400px] lg:max-w-[580px] mx-auto mb-16"
        >
          <Text className="text-[#6493FD] [text-shadow:0_0_3px_rgba(100,147,263,.7)] text-xs lg:text-base font-bold uppercase mb-1.5 lg:mb-2">
            Subscribe to newsletter
          </Text>
          <Title
            as="h2"
            className="text-center text-white font-bold mb-4 text-xl md:text-2xl lg:text-[32px] lg:leading-[1.4]"
          >
            Stay Up To Date with{' '}
            <span className="text-[#2C9F6F] [text-shadow:0_0_3px_rgba(44,159,111,.7)]">
              Syncora&apos;s
            </span>{' '}
            Latest Updates and Promotions
          </Title>
          <Text className="text-sm md:text-base lg:text-lg lg:max-w-[38ch] text-center text-[#CBD5E1] mb-10">
            Be the first to know about our latest updates, exclusive promotions,
            and insider tips on Syncora!
          </Text>
          <Flex className="justify-center">
            <Link
              aria-label="Truebeep Neewsletter Link"
              href={truebeepCustomerPageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-white"
            >
              <GradientBorder
                radius={6}
                borderWidth={2}
                gradient="linear-gradient(180deg, #228B99 1.7%, #19A540 99.52%)"
              >
                <span className="px-8 py-3 lg:py-4 lg:px-12 text-sm lg:text-base font-medium inline-block duration-150 bg-[#19A540]/0 hover:bg-[#19A540]/10">
                  Notify Me
                </span>
              </GradientBorder>
            </Link>
          </Flex>
        </Flex>
        <Flex justify="center">
          <Socials className="inline-flex w-auto md:w-auto gap-6" />
        </Flex>
      </Container>
    </Section>
  );
}
