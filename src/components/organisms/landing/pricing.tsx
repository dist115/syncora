'use client';

import { forwardRef, useState } from 'react';
import Link from 'next/link';
import { pricing } from '@/data/landing-data';
import { Switch, Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { useClientWidth } from '@/hooks/useClientWidth';
import { Pagination, Swiper, SwiperSlide } from '@/components/atoms/carousel';
import { Cross } from '@/components/atoms/icons/landing/cross';
import { Tick } from '@/components/atoms/icons/landing/tick';
import { Box, Container, Flex, Section } from '@/components/atoms/layout';
import { SectionHeader } from '@/components/molecules/landing/section-header';

function Pricing() {
  const clientWidth = useClientWidth();
  const isSmallDevice = clientWidth < 1024;
  const [pricingType, setPricingType] = useState('individual');
  return (
    <Section
      id="pricing"
      className="py-12 sm:py-12 lg:py-16 xl:py-24 2xl:py-28 bg-white font-geist"
    >
      <Container className="md:px-0 px-0 mx-auto max-w-7xl lg:px-8 relative z-10">
        <SectionHeader
          title="Pricing Plan"
          description="Choose the right plan for your needs with our flexible, scalable pricing options."
          className="mb-12"
        />
        <Flex
          justify="center"
          align="start"
          className="gap-2.5 md:gap-4 mb-8 lg:mb-16 text-[#475569]"
        >
          <Flex
            justify="start"
            align="start"
            direction="col"
            className="gap-1 w-auto"
          >
            <Text as="span" className="text-sm lg:text-base leading-6">
              Individual
            </Text>
          </Flex>
          <Switch
            aria-label="Pricing Type"
            label="Pricing Type"
            className="-translate-y-2 [&_label_.rizzui-switch-label]:hidden"
            onChange={(e) =>
              e.target.checked
                ? setPricingType('team')
                : setPricingType('individual')
            }
          />
          <Text as="span" className="text-sm lg:text-base leading-6">
            Team
          </Text>
        </Flex>
        {isSmallDevice ? (
          <>{renderPricingCardSlider(pricingType as keyof typeof pricing)}</>
        ) : (
          <>{renderPricingCard(pricingType as keyof typeof pricing)}</>
        )}
      </Container>
    </Section>
  );
}

export default forwardRef(Pricing);

function renderPricingCard(pricingType: keyof typeof pricing) {
  return (
    <Box className="lg:grid flex-wrap flex justify-center lg:grid-cols-3  1440px:px-0 gap-4 lg:gap-6">
      {pricing[pricingType as keyof typeof pricing].map((item, idx) => (
        <PricingCard
          key={`pricing-card-${idx}`}
          data={item}
          pricingType={pricingType}
        />
      ))}
    </Box>
  );
}

const swiperPaginationClassName =
  '[&_.swiper-pagination]:!relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!bg-gray-700/50 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-gray-700 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!w-3 [&_.swiper-pagination_.swiper-pagination-bullet]:duration-200 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:rounded';

const carouselResponsive = {
  0: {
    slidesPerView: 1,
    spaceBetween: 16,
  },
  500: {
    slidesPerView: 1.5,
    spaceBetween: 16,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 2.3,
    spaceBetween: 24,
  },
};

function renderPricingCardSlider(pricingType: keyof typeof pricing) {
  return (
    <Box className="px-4 md:px-8 1440px:px-0">
      <Swiper
        className={cn('landing-pricing-card-slider', swiperPaginationClassName)}
        slidesPerView={1}
        breakpoints={carouselResponsive}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
      >
        {pricing[pricingType as keyof typeof pricing].map((item, idx) => (
          <SwiperSlide key={`pricing-card-${idx}`}>
            <PricingCard data={item} pricingType={pricingType} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

type PricingData = {
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
  data: PricingData;
  pricingType: keyof typeof pricing;
}) {
  const href =
    pricingType === 'team'
      ? PAGES.SETTINGS.TEAM.BILLING
      : PAGES.SETTINGS.USER.BILLING;
  return (
    <Box className="bg-white [box-shadow:_0px_4px_12px_0px_rgba(0,_0,_0,_0.06);] p-7 md:p-8 pt-10 xl:p-11 shadow-black/[.08] rounded-lg lg:rounded-2xl w-full [@media(min-width:500px)]:basis-[calc(50%_-_8px)] lg:!basis-[unset] lg:col-span-1">
      <Text className="text-center font-semibold text-lg md:text-xl lg:text-2xl mb-4 lg:mb-8">
        {data.name}
      </Text>
      <Text className="text-center font-bold text-[32px] leading-[1.4] lg:!text-[40px]">
        {data.plans[0].price}
      </Text>
      <Box className="pt-12 lg:pt-16">
        <ul className="text-center space-y-4 md:space-y-6">
          {data.features.included.map((feature, idx) => (
            <li
              key={`feature-${idx}`}
              className="text-[#475569] text-sm md:text-base items-center flex gap-3"
            >
              <Tick className="w-4 h-auto" />
              {feature}
            </li>
          ))}
          {data.features.notIncluded.map((feature, idx) => (
            <li
              key={`feature-${idx}`}
              className="text-[#475569] text-sm md:text-base items-center flex gap-3"
            >
              <Cross className="w-4 h-auto" />
              {feature}
            </li>
          ))}
        </ul>
      </Box>
      <Link
        href={href}
        className="block mt-12 md:mt-16 text-sm md:text-base text-center bg-custom-black duration-200 hover:bg-custom-black/90 font-semibold rounded md:rounded-lg md:p-4 p-3 text-white "
      >
        Get Started
      </Link>
    </Box>
  );
}
