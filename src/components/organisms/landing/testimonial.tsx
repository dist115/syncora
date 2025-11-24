'use client';

import React, { forwardRef, useRef } from 'react';
import Image from 'next/image';
import { testimonials } from '@/data/landing-data';
import { format } from 'date-fns';
import Masonry from 'react-masonry-css';
import { Text } from 'rizzui';
import { SwiperRef } from 'swiper/react';

import { cn } from '@/lib/utils/cn';
import { useClientWidth } from '@/hooks/useClientWidth';
import { useIsClient } from '@/hooks/useIsClient';
import { Pagination, Swiper, SwiperSlide } from '@/components/atoms/carousel';
import Twitter from '@/components/atoms/icons/socials/twitter';
import { Box, Container, Flex, Section } from '@/components/atoms/layout';
import { SectionHeader } from '@/components/molecules/landing/section-header';

const responsiveColumns = {
  default: 3,
  820: 2,
  500: 1,
};

const carouselResponsive = {
  0: {
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroup: 1,
  },
  375: {
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroup: 1,
  },
  500: {
    slidesPerView: 1.3,
    slidesPerGroup: 1,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 14,
    slidesPerGroup: 2,
  },
  768: {
    slidesPerView: 2.5,
    slidesPerGroup: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 4,
    slidesPerGroup: 4,
  },
};

const swiperPaginationClassName =
  '[&_.swiper-pagination]:!relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!bg-gray-700/50 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-gray-700 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!w-3 [&_.swiper-pagination_.swiper-pagination-bullet]:duration-200 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:rounded';

function Testimonial() {
  const sliderRef = useRef<SwiperRef>(null);
  const clientWidth = useClientWidth();
  const isSmallDevice = clientWidth < 1024;
  // @ts-ignore
  const sliderHeight = sliderRef?.current?.clientHeight;

  return (
    <Section
      id="testimonials"
      className="pb-12 lg:pb-16 bg-white xl:pb-24 2xl:pb-28 font-geist"
    >
      <Container className="md:px-8 px-4 mx-auto max-w-7xl lg:px-8">
        <SectionHeader
          title="Testimonial"
          description="Discover what our users say about us. Real feedback from those who trust Syncora daily."
          className="mb-8 lg:mb-16"
        />
        {isSmallDevice ? (
          <Swiper
            style={
              { '--slider-height': `${sliderHeight}px` } as React.CSSProperties
            }
            ref={sliderRef}
            className={cn(
              swiperPaginationClassName
            )}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={carouselResponsive}
            modules={[Pagination]}
            pagination={{
              clickable: true,
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={`testimonial-card-${idx}`}>
                <Card {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Masonry
            className="flex gap-4 lg:gap-6"
            breakpointCols={responsiveColumns}
            columnClassName="bg-clip-padding"
          >
            {testimonials.map((testimonial, idx) => (
              <Card key={`testimonial-card-${idx}`} {...testimonial} />
            ))}
          </Masonry>
        )}
      </Container>
    </Section>
  );
}

export default forwardRef(Testimonial);

function Card(props: any) {
  const isClient = useIsClient();
  return (
    <Box className="xl:p-8 md:p-6 p-8 lg:mb-6 rounded-xl xl:rounded-3xl border border-[#E2E8F0] ring-2 ring-[#F9F9FB]">
      <Box className="mb-6">
        <Flex justify="between" align="start" className="mb-6 lg:mb-7 gap-0">
          <figure className="flex items-center gap-4 [&_span]:!w-12 [&_span]:!h-12 lg:[&_span]:!w-[60px] lg:[&_span]:!h-[60px]">
            <Image
              src={props.avatar}
              alt={props.name}
              className="rounded-full w-12 xl:w-[60px] h-12 xl:h-[60px]"
              width={48}
              height={48}
            />
            <figcaption className="space-y-1">
              <Text className="text-custom-black text-base font-semibold">
                {props.name}
              </Text>
              <Text className="text-custom-gray text-sm">{props.username}</Text>
            </figcaption>
          </figure>
          <a
            aria-label="Twitter Link"
            href="#"
            className="inline-block w-7 h-7 text-[#0284C7] hover:opacity-80 duration-200 cursor-pointer"
          >
            <Twitter className="lg:w-7 w-6 lg:h-7 h-6" />
          </a>
        </Flex>
        <Text className="leading-7 text-[#475569] lg:mb-6">{props.post}</Text>
      </Box>
      {isClient && (
        <Text className="text-custom-gray">
          {format(props.date ?? props.date, 'h:mm a · MMM d, yyyy').toString()}
        </Text>
      )}
    </Box>
  );
}
