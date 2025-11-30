import { redirect } from 'next/navigation';
import Image from 'next/image';
import { PAGES } from '@/config/pages';
import { validateRequest } from '@/lib/utils/auth';
import { SignupForm } from '@/components/organisms/authentication/signup-form';
import { Box, Flex } from '@/components/atoms/layout';
import { Text, Title } from 'rizzui';
import { Logo } from '@/components/molecules/logo';
import { CONFIG, APP_NAME } from '@/config';
import { getSetting } from '@/server/actions/settings.action';
import { LoginIllustration } from '@/components/atoms/illustrations/login-illustration';

export default async function SignupPage() {
  const session = await validateRequest();
  if (session && session?.user) {
    redirect(PAGES.DASHBOARD.ROOT);
  }

  const logo = await getSetting('logo');
  const logoSmall = await getSetting('logo_small');
  const darkModeLogo = await getSetting('dark_mode_logo');
  const darkModeLogoSmall = await getSetting('dark_mode_logo_small');
  const logoUrl = logo?.value;
  const logoSmallUrl = logoSmall?.value;
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;

  return (
    <Box className="grid w-screen min-h-screen md:grid-cols-2 bg-white dark:bg-steel-900 font-geist">
      <Flex
        className="p-6 sm:p-8 md:py-24 lg:p-12 w-full h-full"
        direction="col"
        justify="start"
      >
        <Box className="md:w-full w-full h-full max-w-[450px] flex flex-col gap-16 justify-between">
          <Flex justify="center" className="mb-1.5 lg:mb-3">
            <Logo
              isSmall={false}
              appName={CONFIG.APP_NAME}
              logoUrl={logoUrl as string}
              logoUrlSmall={logoSmallUrl as string}
              darkModeLogoUrl={darkModeLogoUrl as string}
              darkModeLogoUrlSmall={darkModeLogoSmallUrl as string}
              logoClassName="[&_.dark-mode-logo]:opacity-0 dark:[&_.dark-mode-logo]:opacity-100 [&_.light-mode-logo]:opacity-100 dark:[&_.light-mode-logo]:opacity-0 w-28 md:w-32 3xl:w-40 4xl:w-48"
              logoTextClassName="text-gray-900 dark:text-steel-100"
              href="/"
            />
          </Flex>

          <Box className="relative">
            <Box className="mb-8">
              <Title className="text-xl lg:text-3xl lg:leading-10 mx-auto font-bold text-center text-custom-black dark:text-[#CBD5E1]">
                Create Your Account
              </Title>
              <Text className="text-custom-gray dark:text-[#94A3B8] mt-3 text-sm lg:text-base text-center">
                Join us and start managing your files securely 
              </Text>
            </Box>

            <SignupForm />
          </Box>

          <Text className="text-center 3xl:text-base text-custom-black dark:text-custom-border">
            @{new Date().getFullYear()}&nbsp;{APP_NAME}
          </Text>
        </Box>
      </Flex>
      <Box className="relative overflow-hidden h-full hidden md:block">
        <Flex
          justify="center"
          align="center"
          className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[#6831E1]"
        >
          <Image
            src="/assets/login-bg.webp"
            alt="signup image"
            width={960}
            height={1008}
            quality={100}
            className="w-full h-full top-0 left-0 absolute object-cover pointer-events-none"
            loading="eager"
          />
          <LoginIllustration className="w-[65%] max-w-[500px] h-auto relative z-[10]" />
        </Flex>
      </Box>
    </Box>
  );
}