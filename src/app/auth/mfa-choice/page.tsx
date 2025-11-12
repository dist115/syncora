import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/utils/auth';
import { PAGES } from '@/config/pages';
import { MfaChoiceForm } from '@/components/organisms/authentication/mfa-choice-form';
import { Box, Flex } from '@/components/atoms/layout';
import { Text, Title } from 'rizzui';
import { Logo } from '@/components/molecules/logo';
import { CONFIG, APP_NAME } from '@/config';
import { getSetting } from '@/server/actions/settings.action';

export default async function MfaChoicePage() {
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
    <Box className="grid w-screen min-h-screen bg-white dark:bg-steel-900 font-geist">
      <Flex
        className="p-6 sm:p-8 md:py-24 lg:p-12 w-full h-full"
        direction="col"
        justify="center"
        align="center"
      >
        <Box className="w-full max-w-[500px] flex flex-col gap-8">
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

          <Box className="text-center mb-6">
            <Title className="text-2xl lg:text-3xl font-bold text-custom-black dark:text-[#CBD5E1] mb-3">
              Choose Verification Method
            </Title>
            <Text className="text-gray-600 dark:text-gray-400">
              Select how you want to complete your login
            </Text>
          </Box>

          <MfaChoiceForm />

          <Text className="text-center text-sm text-custom-black dark:text-custom-border">
            @{new Date().getFullYear()}&nbsp;{APP_NAME}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}