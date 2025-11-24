import Image from 'next/image';
import { Text, Title } from 'rizzui';

import { Box, Container, Flex, Grid } from '@/components/atoms/layout';
import { ContactInfo } from '@/components/molecules/contact-us/contact-info';
import { ContactUsForm } from '@/components/organisms/forms/contact-us-form';

export default function ContactUsView() {
  return (
    <Box className="font-geist mb-14 sm:mb-16 xl:mb-20">
      <header className="bg-[#141D25] font-geist relative w-full 3xl:aspect-[1920/840]">
        <Image
          src="/assets/green-globe-bg.webp"
          alt="green-globe-bg"
          width={1920}
          height={840}
          className="w-full h-full 3xl:aspect-[1920/840] object-cover 2xl:h-auto absolute top-0 left-0 pointer-events-none"
        />
        <Container className="max-w-[120rem] relative z-[3] px-4 h-full md:px-8 3xl:px-40 ">
          <Flex
            justify="end"
            direction="col"
            align="center"
            className="h-full pt-24 pb-12 md:pb-16 lg:pt-32 2xl:pt-[228px] lg:pb-20 relative gap-0 z-[2] text-white text-center xl:text-left xl:items-start"
          >
            <Title className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[60px]  2xl:leading-[1.4] leading-8 sm:leading-10 md:leading-[48px] lg:leading-[56px] mb-5 font-extrabold xl:max-w-[565px]">
              Syncora The Right <br className="hidden xl:inline" /> Platform
              <br className="xl:hidden" /> For Your
              <br className="hidden xl:inline" /> Storage
            </Title>
            <Text className="max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[530px] lg:text-base xl:text-xl leading-normal">
              Just answer a few questions so that we can personalize the right
              experience for you. unknown printer took a type and scrambled it
              to make a type
            </Text>
          </Flex>
        </Container>
      </header>
      <div className="mt-4 sm:mt-16 2xl:mt-16">
        <Container className="max-w-[120rem]  px-4 md:px-8 3xl:px-40 ">
          <Grid columns="11" className="gap-6 lg:gap-12">
            <Box className="col-span-full xl:col-span-5">
              <ContactInfo className="sm:mx-auto sm:w-[70%] xl:w-full" />
            </Box>
            <Box className="col-span-full xl:col-span-6 relative z-[5]">
              <Box className="mt-4  xl:-mt-[412px] 2xl:-mt-[496px] p-3 pb-6 md:p-4 md:pb-8 lg:p-6 xl:p-12 rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl border border-[#262626]/10 shadow-xl bg-white shadow-[#262626]/[.06] sm:mx-auto sm:w-[70%] xl:w-full">
                <ContactUsForm />
              </Box>
            </Box>
          </Grid>
        </Container>
      </div>
    </Box>
  );
}
