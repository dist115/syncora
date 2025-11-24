'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pricing } from '@/data/landing-data';
import { Text, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { Cross } from '@/components/atoms/icons/landing/cross';
import { Tick } from '@/components/atoms/icons/landing/tick';
import { Box, Container, Flex, Grid } from '@/components/atoms/layout';

export function ShowPricing() {
  const [pricingType, setPricingType] =
    useState<keyof typeof pricing>('individual');
  return (
    <div className="font-geist">
      <header className="bg-[#141D25] pb-12 sm:pb-16 lg:pb-24 xl:pb-32 3xl:pb-0 font-geist relative w-full 3xl:aspect-[1920/520] 4xl:aspect-[1920/480] overflow-hidden">
        <Image
          src="/assets/green-globe-bg.webp"
          alt="green-globe-bg"
          width={1920}
          height={840}
          className="w-full h-full 3xl:aspect-[1920/840] object-cover 2xl:h-auto absolute top-0 left-0 pointer-events-none"
        />
        <Container className="max-w-[120rem] px-4 md:px-8 lg:pt-16 3xl:px-40">
          <Flex
            direction="col"
            className="mx-auto pt-24 gap-2 md:gap-4 xl:gap-6 2xl:pt-[120px] 3xl:pt-[120px] text-white relative z-[2]"
          >
            <Title className="text-center 2xl:text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px]">
              Pricing Plan
            </Title>
            <Text className="lg:text-base xl:text-lg">
              Have questions? We&apos;re here to help.
            </Text>
            <Box className="rounded-full mt-3 bg-[#E2E8F0] p-0.5 lg:p-1 grid grid-cols-2">
              <button
                onClick={() => setPricingType('individual')}
                className={cn(
                  'py-1.5 lg:py-2 px-3 lg:px-6 text-xs lg:text-sm duration-200 text-white bg-custom-black font-medium rounded-full',
                  pricingType === 'individual'
                    ? 'bg-opacity-100'
                    : 'bg-opacity-0 text-custom-black'
                )}
              >
                Individual User Plan
              </button>
              <button
                onClick={() => setPricingType('team')}
                className={cn(
                  'py-1.5 lg:py-2 px-3 lg:px-6 text-xs lg:text-sm duration-200 text-white bg-custom-black font-medium rounded-full',
                  pricingType === 'team'
                    ? 'bg-opacity-100'
                    : 'bg-opacity-0 text-custom-black'
                )}
              >
                Team Plan
              </button>
            </Box>
          </Flex>
        </Container>
      </header>
      <Container className="max-w-[1344px] my-6 sm:my-20 md:my-8 2xl:py-16 w-full px-4 md:px-8">
        <Box className="space-y-4 md:space-y-8 lg:space-y-12">
          {pricing[pricingType].map((item, idx) => (
            <PricingCard
              key={`pricing-card-${idx}`}
              pricingType={pricingType}
              data={item}
            />
          ))}
        </Box>
      </Container>
    </div>
  );
}

type PricingCardData = {
  slug: string;
  name: string;
  description: string;
  features: {
    included: string[];
    notIncluded: string[];
  };
  plans: {
    name: string;
    description: string;
    price: string;
    planId: string;
    trial: string;
    storage: string;
  }[];
};

function PricingCard({
  data,
  pricingType,
}: {
  data: PricingCardData;
  pricingType: keyof typeof pricing;
}) {
  const href =
    pricingType === 'team'
      ? PAGES.SETTINGS.TEAM.BILLING
      : PAGES.SETTINGS.USER.BILLING;

  return (
    <Grid
      columns="3"
      className="rounded-xl gap-3 md:gap-0 border overflow-hidden border-[#CBD5E1]/30 p-1"
    >
      <Box className="col-span-full md:col-span-2 p-4 md:p-6 xl:p-12">
        <Box className="mb-6 xl:mb-7">
          <Title
            as="h3"
            className="text-lg mb-1.5 sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] font-semibold xl:mb-3"
          >
            {data.name}
          </Title>
          <Text className="lg:text-base leading-6 lg:leading-7">
            {data.description}
          </Text>
        </Box>
        <Box className="relative mb-5 xl:mb-8">
          <Text
            as="span"
            className="absolute top-1/2 -translate-y-1/2 h-px w-full border border-dashed border-[#CBD5E1]"
          />
          <Text
            as="span"
            className="text-sm relative pr-3 bg-white z-10 lg:text-base text-custom-black"
          >
            What&apos;s Included
          </Text>
        </Box>
        <Grid
          columns="1"
          className=" [@media(min-width:500px)]:grid-cols-2 sm:!grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 gap-x-6 gap-y-5 xl:gap-y-10"
        >
          {data.features.included.map((feature, idx) => (
            <Flex
              key={`included-feature-${idx}`}
              justify="start"
              className="gap-3 text-[13px] lg:text-base text-[#475569]"
            >
              <Tick className="w-4 h-auto" />
              {feature}
            </Flex>
          ))}
          {data.features.notIncluded.map((feature, idx) => (
            <Flex
              key={`not-included-feature-${idx}`}
              justify="start"
              className="gap-3 text-[13px] lg:text-base text-[#475569]"
            >
              <Cross className="w-4 h-auto" />
              {feature}
            </Flex>
          ))}
        </Grid>
      </Box>
      <Flex
        direction="col"
        align="center"
        justify="center"
        className="p-4 py-6 xl:p-16 col-span-full md:col-span-1 bg-[#F1F5F9] rounded-[10px]"
      >
        <Box className="w-full">
          <Text className="mb-2 text-center lg:text-base">
            Pay once, own it forever
          </Text>
          <Text className="text-center font-bold text-[32px] leading-[1.4] text-custom-black mb-8 xl:text-[44px]">
            {data.plans[0].price}
            <Text
              as="span"
              className="text-sm xl:text-base text-[#475569]"
            ></Text>
          </Text>{' '}
          <Link
            href={href}
            className="block mb-2 text-sm lg:text-base text-center bg-custom-black duration-200 hover:bg-custom-black/90 font-semibold rounded md:rounded-lg lg:p-4 p-3 text-white "
          >
            Get Started
          </Link>
          <Text className="text-center text-xs lg:text-sm text-[#475569]">
            Invoices and receipts available for{' '}
            <br className="hidden [@media(min-width:500px)]:inline" /> easy
            company reimbursement
          </Text>
        </Box>
      </Flex>
    </Grid>
  );
}
