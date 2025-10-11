'use client';

import Image from 'next/image';
import { trustedPartners } from '@/data/landing-data';
import Marquee from 'react-fast-marquee';
import { Title } from 'rizzui';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Scratch } from '@/components/atoms/icons/landing/scratch';
import { Box, Container, Section } from '@/components/atoms/layout';

function TrustedPartners() {
  const isMarqueeLoop = useMediaQuery('(max-width:1500px )');
  return (
    <Section
      id="trusted-partners"
      className=" pt-16 bg-white lg:pt-[140px] py-4 lg:py-[70px] font-geist"
    >
      <Container className="max-w-[120rem] md:px-8 3xl:px-40 px-4">
        <Box className="mb-7 lg:mb-16">
          <Title
            as="h2"
            className="text-center mb-0.5 text-custom-black text-xl md:text-2xl lg:leading-[1.4] lg:text-[32px] font-bold"
          >
            Trusted Companies
          </Title>
          <Scratch className="lg:w-[370px] w-[264px] lg:mt-2 h-1.5 lg:h-2 mx-auto" />
        </Box>
        <Marquee
          key={isMarqueeLoop.toString()}
          speed={40}
          play={isMarqueeLoop}
          className="[&_.rfm-initial-child-container]:mx-auto"
        >
          {trustedPartners.map((partner, idx) => (
            <Box
              key={`trusted-partners-${idx}`}
              className="lg:mx-[43px] mx-6 flex items-center [&_>_span]:w-auto [&_>_span]:!h-3 relative"
            >
              <Image
                src={partner.image}
                alt={partner.title}
                width={160}
                height={44}
                className="w-auto h-7 sm:h-8 md:h-9 lg:h-11 3xl:h-[50px]"
              />
            </Box>
          ))}
        </Marquee>
      </Container>
    </Section>
  );
}

export default TrustedPartners;
