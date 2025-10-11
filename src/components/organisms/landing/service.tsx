import { services } from '@/data/landing-data';

import { FileReceive } from '@/components/atoms/icons/landing/file-receive';
import { FileShare } from '@/components/atoms/icons/landing/file-share';
import { FileUpload } from '@/components/atoms/icons/landing/file-upload';
import { Box, Container, Flex } from '@/components/atoms/layout';
import { ServiceAnimationIllustration } from '@/components/molecules/service.animation.illustration';

const Icons = {
  FileShare,
  FileUpload,
  FileReceive,
};

type IconType = keyof typeof Icons;

export default function Service() {
  return (
    <Box
      id="service"
      className="bg-[#FCFCFC] py-8 sm:py-12 lg:py-16 xl:py-24 2xl:py-28 font-geist"
    >
      <Container className="md:px-8 px-4 mx-auto max-w-7xl lg:px-0">
        <Flex
          direction="col-reverse"
          justify="between"
          align="center"
          className="px-4 lg:px-8 lg:flex-row gap-12 lg:gap-20"
        >
          <Box className="space-y-9 lg:space-y-12 xl:space-y-20 max-w-[456px] lg:max-w-[unset] mx-auto">
            {services.map((card, idx) => (
              <Card key={`service-card-${idx}`} {...card} />
            ))}
          </Box>
          <ServiceAnimationIllustration />
        </Flex>
      </Container>
    </Box>
  );
}

function Card(props: { title: string; description: string; icon: string }) {
  const Icon = Icons[props.icon as IconType];

  return (
    <div className="flex gap-4 lg:gap-8">
      <div className="md:h-20 w-[50px] h-[50px] md:w-20 shrink-0 bg-white rounded-xl md:rounded-3xl shadow-[0_4px_40px_#e48e661a]">
        <Icon className="w-full h-auto" />
      </div>
      <div>
        <p className="text-custom-black font-semibold md:text-xl lg:text-2xl mb-3 lg:mb-4">
          {props.title}
        </p>
        <p className="text-[#475569] text-sm md:text-base lg:leading-[28px] leading-[22px] lg:max-w-[32ch]">
          {props.description}
        </p>
      </div>
    </div>
  );
}
