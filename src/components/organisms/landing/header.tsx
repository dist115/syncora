'use client';

import { useState } from 'react';
import { User } from 'lucia';
import { RiMenuLine } from 'react-icons/ri';
import { ActionIcon, Drawer } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { useWindowScroll } from '@/hooks/useWindowScroll';
import { Box, Container, Flex } from '@/components/atoms/layout';
import { AuthDropdownLanding } from '@/components/molecules/auth-dropdown-simple';
import { LoginButton } from '@/components/molecules/landing/login-button';
import { MobileMenu } from '@/components/molecules/landing/mobile-menu';
import NavItems from '@/components/molecules/landing/nav-items';
import { Logo } from '@/components/molecules/logo';

export default function Header({
  logoUrl,
  darkModeLogoUrl,
  logoSmallUrl,
  darkModeLogoSmallUrl,
  appName,
  user,
}: {
  logoUrl: string;
  darkModeLogoUrl: string;
  logoSmallUrl: string;
  darkModeLogoSmallUrl: string;
  appName: string;
  user: User | null;
}) {
  const [drawerState, setDrawerState] = useState(false);
  const windowScroll = useWindowScroll();
  const isScrolled = windowScroll > 10;

  return (
    <>
      <header
        className={cn(
          'py-3 transition-all w-full transform translate-x-0 translate-z-0 fixed  inset-x-0 top-0 z-[998] translate-y-0 font-geist pt-5',
          isScrolled &&
            'py-3 pt-3 backdrop-blur-none bg-white shadow-md shadow-[#141D25]/[.05]'
        )}
      >
        <Container className="max-w-[120rem] px-4 md:px-8 3xl:px-40">
          <Flex className="relative 3xl:py-2">
            <Logo
              isSmall={false}
              appName={appName}
              logoUrl={logoUrl}
              logoUrlSmall={logoSmallUrl}
              darkModeLogoUrl={darkModeLogoUrl}
              darkModeLogoUrlSmall={darkModeLogoSmallUrl}
              logoClassName={cn(
                'w-28',
                isScrolled
                  ? '[&_.light-mode-logo]:opacity-100 [&_.dark-mode-logo]:opacity-0'
                  : '[&_.light-mode-logo]:opacity-0 [&_.dark-mode-logo]:opacity-100'
              )}
              logoTextClassName={cn(
                'text-xl',
                isScrolled ? 'text-[#141D25]' : 'text-white'
              )}
            />
            <NavItems
              className="gap-8 hidden lg:flex"
              linkClassName={cn(
                isScrolled
                  ? 'text-black [&.active]:text-black'
                  : 'text-white [&.active]:text-white'
              )}
            />
            <ActionIcon
              aria-label="Hamburger Menu Button"
              className="lg:hidden translate-x-1.5 md:translate-x-2"
              variant="text"
              onClick={() => setDrawerState(true)}
            >
              <RiMenuLine
                className={cn(
                  'lg:hidden w-7 h-7 text-white',
                  isScrolled && 'text-[#141D25]'
                )}
              />
            </ActionIcon>
            <Box className="gap-7 hidden lg:flex items-center">
              {!user ? (
                <>
                  <LoginButton
                    className={cn(
                      isScrolled && 'text-[#141D25] hover:text-[#141D25]/80'
                    )}
                  />
                </>
              ) : (
                <AuthDropdownLanding isScrolled={isScrolled} user={user} />
              )}
            </Box>
          </Flex>
        </Container>
      </header>
      <Drawer
        placement="left"
        isOpen={drawerState}
        onClose={() => setDrawerState(false)}
      >
        <MobileMenu
          appName={appName}
          logoUrl={logoUrl}
          logoSmallUrl={logoSmallUrl}
          darkModeLogoUrl={logoUrl}
          darkModeLogoSmallUrl={darkModeLogoSmallUrl}
          onClose={() => setDrawerState(false)}
          user={user}
        />
      </Drawer>
    </>
  );
}
