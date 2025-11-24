import { CONFIG } from '@/config';
import { getSetting } from '@/server/actions/settings.action';
import { Text } from 'rizzui';
import { Toaster } from 'sonner';

import { validateRequest } from '@/lib/utils/auth';
import { Box } from '@/components/atoms/layout';
import { TBBgPattern } from '@/components/atoms/vectors/tb-bg-pattern';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/landing/header';
import { TruebeepNewsletter } from '@/components/organisms/landing/truebeep-newsletter';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ user }, logo, logoSmall, darkModeLogo, darkModeLogoSmall] =
    await Promise.all([
      validateRequest(),
      getSetting('logo'),
      getSetting('logo_small'),
      getSetting('dark_mode_logo'),
      getSetting('dark_mode_logo_small'),
    ]);

  const logoUrl = logo?.value;
  const logoSmallUrl = logoSmall?.value;
  const darkModeLogoUrl = darkModeLogo?.value;
  const darkModeLogoSmallUrl = darkModeLogoSmall?.value;

  return (
    <>
      <main className="flex h-[100dvh] flex-col">
        <Header
          logoSmallUrl={logoSmallUrl as string}
          darkModeLogoSmallUrl={darkModeLogoSmallUrl as string}
          logoUrl={logoUrl as string}
          darkModeLogoUrl={darkModeLogoUrl as string}
          appName={CONFIG.APP_NAME}
          user={user}
        />
        <Box className="grow">{children}</Box>
        <Box className="relative">
          <Text
            as="span"
            className="absolute inset-0 top-0 left-0 inline-block z-[1] h-full w-full [background:_radial-gradient(44.93%_44.91%_at_51.9%_17.51%,_rgba(64,_193,_123,_0.18)_0%,_rgba(255,_255,_255,_0.00)_100%),_#010609;]"
          />
          <TBBgPattern className="absolute -translate-x-1/2 pointer-events-none -translate-y-1/2 top-1/2 left-1/2 w-1/2 h-auto z-[2]" />
          <Box className="relative z-20 overflow-x-hidden">
            <TruebeepNewsletter />
            <Footer variant="landing" />
          </Box>
        </Box>
      </main>
      <Toaster
        richColors
        position="top-center"
        gap={8}
        toastOptions={{
          className: 'sm:!w-auto',
          duration: 5000,
        }}
      />
    </>
  );
}
