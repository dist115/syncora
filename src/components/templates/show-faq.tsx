'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CrossIcon } from 'lucide-react';
import { RiSearchLine } from 'react-icons/ri';
import { Input, Text, Title } from 'rizzui';

import { StaticPageFallbackIllustration } from '@/components/atoms/illustrations/fallbacks/static-page-fallback-illustration';
import { Box, Container, Flex } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';

import { ClearableIcon } from '../atoms/icons/clearable';
import { Cross } from '../atoms/icons/landing/cross';

export function ShowFaq({ faq }: { faq: string }) {
  const parsedFaqs = faq ? JSON.parse(faq) : [];
  const sanitizedFaqs = [...parsedFaqs].filter((f) => f.title && f.description);

  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [notFound, setNotFound] = useState(false);
  const [filteredFaqs, setFilteredFaqs] = useState(sanitizedFaqs);
  const oddFaq = filteredFaqs.filter(
    (item: any, index: number) => index % 2 === 0
  );
  const evenFaq = filteredFaqs.filter(
    (item: any, index: number) => index % 2 !== 0
  );
  useEffect(() => {
    if (searchValue !== null) {
      const faqs = sanitizedFaqs.filter((f: any) => {
        return (
          f.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          f.description.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      if (faqs.length) {
        setFilteredFaqs(faqs);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } else {
      setFilteredFaqs(sanitizedFaqs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              Frequently Asked Questions
            </Title>
            <Text className="lg:text-base xl:text-lg">
              Have questions? We&apos;re here to help.
            </Text>
            <Box className="pt-4 md:pt-6 lg:pt-8 lg:w-[480px] w-4/5 sm:w-1/2 relative">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="search"
                placeholder="Search..."
                className="[&_.rizzui-input-container]:bg-white [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-16 [&_.rizzui-input-container]:w-full 3xl:[&_.rizzui-input-container]:w-[480px] [&_.rizzui-input-container]:px-3 xl:[&_.rizzui-input-container]:px-7"
                inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 text-base text-[#475569]"
                prefix={<RiSearchLine className="w-5 h-5" />}
              />
              {!!searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className="absolute inline-flex shrink-0 transform items-center justify-center rounded-full bg-muted/70 backdrop-blur text-foreground/90 transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground h-4 w-4 bottom-3 lg:bottom-6 right-4 lg:right-6"
                >
                  <ClearableIcon className="w-4" />
                </button>
              )}
            </Box>
          </Flex>
        </Container>
      </header>
      <Container className="max-w-[1344px] my-6 sm:my-20 md:my-8 2xl:py-16 w-full px-4 md:px-8">
        {!mounted ? (
          <Box>{renderLoader()}</Box>
        ) : (
          <Box>
            {!notFound ? (
              <Box className="grid grid-cols-2 md:gap-x-8 gap-x-24">
                <Box className="md:block hidden">{renderFaq(oddFaq)}</Box>
                <Box className="md:block hidden">{renderFaq(evenFaq)}</Box>
                <Box className="md:hidden block col-span-full">
                  <Box className="mx-auto sm:w-4/5">
                    {renderFaq(filteredFaqs)}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Flex justify="center" className="py-6 sm:py-12 xl:py-20">
                <Fallback
                  illustration={StaticPageFallbackIllustration}
                  illustrationClassName="w-[250px] sm:w-[400px] lg:w-[500px] xl:w-[610px] 3xl:w-[720px] h-auto"
                  title="Sorry no result found!"
                  titleClassName="text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl"
                  subtitle="We couldn’t find anything"
                  subtitleClassName="lg:text-base 3xl:text-xl 3xl:mt-3"
                />
              </Flex>
            )}
          </Box>
        )}
      </Container>
    </div>
  );
}

function renderFaq(faqs: any) {
  return (
    <Box className="space-y-6 lg:space-y-8 2xl:space-y-12">
      {faqs?.map((item: any, index: number) => (
        <Box key={`faq-${item.title}-${index}`}>
          <Text className="mb-3 text-custom-black font-semibold text-base lg:text-lg lg:leading-8">
            {item.title}
          </Text>
          <Text className="text-[#475569] text-sm leading-6 lg:text-base lg:leading-7">
            {item.description}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

function renderLoader() {
  return (
    <Box className="grid grid-cols-2 gap-24">
      {Array.from({ length: 6 }).map((_, index: number) => (
        <Loader key={`faq-skeleton-${index}`} />
      ))}
    </Box>
  );
}

function Loader() {
  return (
    <Box className="aspect-[578/112] animate-pulse space-y-4">
      <Box className="w-3/5 h-4 bg-[#dbdbdb] rounded-md " />
      <Box className="w-full h-4 bg-[#dbdbdb] rounded-md" />
      <Box className="w-full h-4 bg-[#dbdbdb] rounded-md" />
      <Box className="w-1/2 h-4 bg-[#dbdbdb] rounded-md" />
    </Box>
  );
}
