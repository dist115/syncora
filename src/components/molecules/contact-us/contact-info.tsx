import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Cellular } from '@/components/atoms/icons/contact-us/cellular';
import { Envelop } from '@/components/atoms/icons/contact-us/envelop';
import { MapMarker } from '@/components/atoms/icons/contact-us/map-marker';
import { Flex } from '@/components/atoms/layout';
import { Box } from '@/components/atoms/layout/box';

export function ContactInfo({ className }: { className?: string }) {
  return (
    <Box
      className={cn(
        'rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl border border-[#262626]/10 shadow-xl shadow-[#262626]/[.06] px-3 md:px-4 lg:px-6 xl:px-8',
        className
      )}
    >
      <Flex className="py-3 md:py-4 lg:py-6 xl:py-8 gap-0 border-b border-[#CBD5E1] last-of-type:border-b-0">
        <Flex justify="start" className="gap-3 lg:gap-5">
          <Envelop className="w-10 md:w-12 lg:w-[74px] h-auto" />
          <Text
            as="span"
            className="text-custom-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
          >
            Our Email
          </Text>
        </Flex>
        <Box>
          <a
            href="mailto:Contact@gmail.com"
            className="inline-block text-[#475569] text-xs sm:text-sm md:text-base lg:text-lg"
          >
            Contact@gmail.com
          </a>
        </Box>
      </Flex>
      <Flex className="py-3 md:py-4 lg:py-6 xl:py-8 gap-0 border-b border-[#CBD5E1] last-of-type:border-b-0">
        <Flex justify="start" className="gap-3 lg:gap-5">
          <Cellular className="w-10 md:w-12 lg:w-[74px] h-auto" />
          <Text
            as="span"
            className="text-custom-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
          >
            Our Number
          </Text>
        </Flex>
        <a
          href="tel:+0123456789"
          className="inline-block whitespace-nowrap text-[#475569] text-xs sm:text-sm md:text-base lg:text-lg"
        >
          (012)345-6789
        </a>
      </Flex>
      <Flex className="py-3 md:py-4 lg:py-6 xl:py-8 gap-0 border-b border-[#CBD5E1] last-of-type:border-b-0">
        <Flex justify="start" className="gap-3 lg:gap-5">
          <MapMarker className="w-10 md:w-12 lg:w-[74px] h-auto" />
          <Text
            as="span"
            className="text-custom-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
          >
            Our Location
          </Text>
        </Flex>
        <Text
          as="span"
          className="text-right whitespace-nowrap text-[#475569] leading-[1.7] text-xs sm:text-sm md:text-base lg:text-lg"
        >
          Vancouver, WA 98665 <br /> United States
        </Text>
      </Flex>
    </Box>
  );
}
