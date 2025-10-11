'use client';

import Image from 'next/image';
import { features } from '@/data/landing-data';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { useClientWidth } from '@/hooks/useClientWidth';
import { Pagination, Swiper, SwiperSlide } from '@/components/atoms/carousel';
import { Box, Container, Section } from '@/components/atoms/layout';
import { SectionHeader } from '@/components/molecules/landing/section-header';

const carouselResponsive = {
  0: {
    slidesPerView: 1.5,
    spaceBetween: 16,
    slidesPerGroup: 1,
  },
  500: {
    slidesPerView: 2,
    slidesPerGroup: 2,
  },
  640: {
    slidesPerView: 2.5,
    spaceBetween: 14,
    slidesPerGroup: 2,
  },
  768: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 4,
    slidesPerGroup: 4,
  },
};
const swiperPaginationClassName =
  '[&_.swiper-pagination]:hidden md:[&_.swiper-pagination]:block [&_.swiper-pagination]:!relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination_.swiper-pagination-bullet]:!bg-white/50 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!w-3 [&_.swiper-pagination_.swiper-pagination-bullet]:duration-200 [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:rounded';

export default function Feature() {
  const clientWidth = useClientWidth();
  const isSmallDevice = clientWidth < 1280;

  return (
    <Section
      id="feature"
      className="py-12 sm:py-12 lg:py-16 xl:pt-24 xl:py-24 2xl:pt-28 2xl:pb-28 bg-[#010609] relative font-geist"
    >
      <Text
        as="span"
        className="absolute inset-0 z-[1] h-full w-full [background:_radial-gradient(44.93%_44.91%_at_51.9%_17.51%,_rgba(64,_193,_123,_0.18)_0%,_rgba(255,_255,_255,_0.00)_100%),_#010609;] "
      />

      <Container className="md:px-8 px-4 mx-auto max-w-7xl lg:px-0 relative z-10">
        <SectionHeader
          title="Features"
          titleClassName="text-[#F8FAFC]"
          description="Explore the powerful features of Syncora designed to enhance your file management efficiency and security."
          descriptionClassName="text-[#CBD5E1]"
          className="mb-10 lg:mb-16"
        />
        {isSmallDevice ? (
          <Box className="lg:px-8 1440px:px-0">
            <Swiper
              className={cn(swiperPaginationClassName)}
              slidesPerView={1}
              spaceBetween={20}
              breakpoints={carouselResponsive}
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
            >
              {features.map((feature, idx) => (
                <SwiperSlide key={`feature-swiper-${idx}`}>
                  <Card {...feature} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ) : (
          <>
            <Box className="grid grid-cols-1 [@media(min-width:500px)]:grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 gap-4 lg:gap-6 lg:px-8 1440px:px-0">
              {features.map((feature, idx) => (
                <Card key={`feature-card-${idx}`} {...feature} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </Section>
  );
}

function Card({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <Box className="p-0.5 [aspect:1/1] rounded-3xl bg-gradient-to-b from-[#292B30]/80 to-[#16171A]">
      <Box className="rounded-[22px] bg-[#010405] h-full text-white p-4 py-8 md:p-4 pt-10 md:py-8 lg:py-10 xl:p-10 xl:px-5 flex flex-col justify-stretch items-center text-center">
        <Image
          src={image}
          alt={title}
          width={160}
          height={160}
          quality={100}
          className="lg:w-16 xl:w-20 lg:h-16 xl:h-20 w-12 h-12 mb-6"
        />
        <Text
          as="p"
          className="md:text-base lg:text-lg xl:text-xl font-semibold text-[#CBD5E1] mb-1.5 whitespace-nowrap"
        >
          {title}
        </Text>
        <Text
          as="p"
          className="text-sm leading-6 text-[#94A3B8] max-w-[20ch] lg:max-w-[28ch]"
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
}
