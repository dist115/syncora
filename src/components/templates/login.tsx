import Image from 'next/image';
import { APP_NAME, CONFIG } from '@/config';
import { getSetting } from '@/server/actions/settings.action';
import { Button, Text, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';
import { Logo } from '@/components/molecules/logo';
import { EmailLogin } from '@/components/organisms/authentication/email-login';

import { LoginPageSticker } from '../atoms/icons/login-page-sticker';
import { LoginIllustration } from '../atoms/illustrations/login-illustration';

export default async function LoginView({ message }: { message?: string }) {
  const logo = await getSetting('logo');
  const logoSmall = await getSetting('logo_small');
  const darkModeLogo = await getSetting('dark_mode_logo');
  const darkModeLogoSmall = await getSetting('dark_mode_logo_small');
  const logoUrl = logo?.value;
  const logoSmallUrl = logoSmall?.value;
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;
  const hideLogin = message === 'welcome' || message === 'invalid_token';
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
            {!hideLogin && (
              <Box className="mb-8">
                <Text className="text-xl lg:text-3xl lg:leading-10 mx-auto font-bold text-center max-w-[18ch] text-custom-black dark:text-[#CBD5E1]">
                  Welcome Back! Please Sign In To Continue
                </Text>
                <Text className="text-custom-gray darkK:text-[#94A3B8] mt-3 text-sm lg:text-base text-center">
                  By signing up, you will gain access to exclusive content.
                </Text>
              </Box>
            )}

            {message == 'welcome' && (
              <Box className="mt-12 text-center">
                <Title className="font-semibold text-gray-900 dark:text-gray-900">
                  Welcome to the team!
                </Title>
                <Text className="mt-3 text-gray-600 dark:text-gray-600">
                  Begin your experience by logging in. Enjoy!
                </Text>
                <Link href={PAGES.AUTH.LOGIN}>
                  <Button className="px-6 mt-6">Login</Button>
                </Link>
              </Box>
            )}

            {message == 'invalid_token' && (
              <Title className="mt-12 text-center text-gray-600 dark:text-gray-600">
                Sorry, Invitation has been expired!
              </Title>
            )}

            {!hideLogin && <EmailLogin />}
            <Box className="hidden pointer-events-none absolute right-0 xl:-right-12 2xl:-right-24 top-[calc(100%_+_16px)] w-64 aspect-[203/70]">
              <LoginPageSticker className="w-full text-[#386EC7] dark:text-[#455A64]" />
            </Box>
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
            alt="login image"
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
