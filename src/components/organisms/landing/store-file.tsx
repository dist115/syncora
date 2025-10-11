import { forwardRef } from 'react';
import { storeFile } from '@/data/landing-data';
import { Text } from 'rizzui';

import { CurveLine } from '@/components/atoms/icons/landing/curve-line';
import { Hyperlink } from '@/components/atoms/icons/landing/hyperlink';
import { UpArrow } from '@/components/atoms/icons/landing/up-arrow';
import { User } from '@/components/atoms/icons/landing/user';
import { Box, Container, Grid, Section } from '@/components/atoms/layout';
import { SectionHeader } from '@/components/molecules/landing/section-header';

const Icons = {
  User,
  UpArrow,
  Hyperlink,
};

type IconType = keyof typeof Icons;

function StoreFile() {
  return (
    <Section
      id="store-file"
      className="py-16 bg-white pb-8 xl:pb-16 font-geist"
    >
      <Container className="md:px-8 px-4 mx-auto max-w-7xl lg:px-0">
        <SectionHeader
          title="Store File on Syncora"
          description="Safely store and access your files from anywhere with Syncora’s secure, cloud-based platform"
          className="mb-10 lg:mb-16"
        />
        <Grid className="[@media(min-width:500px)]:grid-cols-2 md:!grid-cols-3 gap-4 lg:gap-6 relative ">
          <CurveLine className="absolute z-[1] hidden xl:block w-[calc(100%-28rem)] h-auto top-12 left-1/2 -translate-x-1/2" />
          {storeFile.map((card, idx) => (
            <Card key={`store-file-card-${idx}`} {...card} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default forwardRef(StoreFile);

function Card(props: {
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowColor: string;
}) {
  const Icon = Icons[props.icon as IconType];
  return (
    <Box
      style={
        {
          '--color': props.color,
          '--shadow-color': props.shadowColor,
        } as React.CSSProperties
      }
      className="p-4 lg:p-10 flex flex-col items-center card"
    >
      <Box className="rounded-2xl lg:rounded-3xl relative z-10 bg-[var(--color)] mb-4 lg:mb-12 w-[50px] h-[50px] lg:w-20 lg:h-20 shadow-[0_4px_80px_var(--shadow-color)]">
        <Icon className="w-full h-auto" />
      </Box>
      <Text className="lg:text-2xl md:text-xl lg:leading-[38px] font-semibold mb-2 md:mb-3 lg:mb-4 text-custom-black">
        {props.title}
      </Text>
      <Text className="text-[#475569] text-center max-w-[30ch] lg:max-w-[28ch] md:text-base text-sm">
        {props.description}
      </Text>
    </Box>
  );
}
