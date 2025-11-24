'use client';

import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Text } from 'rizzui';

import { externalLinks } from '@/config/external-links';
import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { useIsMozilla } from '@/hooks/useIsMozilla';
import { Box, Flex } from '@/components/atoms/layout';
import { ScrollToTop } from '@/components/molecules/scroll-to-top';

const menuItems = [
  {
    label: 'Support',
    href: externalLinks.support,
    target: '_blank',
  },
  {
    label: 'Privacy',
    href: PAGES.STATIC.PRIVACY_POLICY,
  },
  {
    label: 'Terms & Condition',
    href: PAGES.STATIC.TERMS,
  },
];

export default function Footer({
  variant,
}: {
  variant?: 'dashboard' | 'landing';
}) {
  const { ref, inView: scrollView } = useInView({
    threshold: 0,
  });
  const isMozilla = useIsMozilla();
  return (
    <>
      <footer
        ref={ref}
        className={cn(
          'relative bottom-0 pt-0 mt-8 text-center font-geist',
          variant === 'dashboard' && 'px-5 xl:px-8 3xl:px-10',
          variant === 'landing' && 'xl:mt-0'
        )}
      >
        <Box
          className={cn(
            variant !== 'dashboard' &&
              'max-w-[120rem] md:px-8 3xl:px-40 px-4 mx-auto'
          )}
        >
          <Flex
            direction="col-reverse"
            justify="between"
            align="center"
            className={cn(
              'gap-4 py-4 text-sm font-light sm:py-5 md:py-6  border-t  sm:flex-row ',
              variant === 'dashboard'
                ? 'lg:text-[15px] text-steel-600 border-steel-100 dark:border-steel-600/60 dark:text-steel-200'
                : 'lg:py-8 text-[#E5E7EB]/80 border-[#434A54] lg:text-base'
            )}
          >
            <Text className="py-0.5">
              &copy; {new Date().getFullYear()}{' '}
              <Link
                href="https://redq.io"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'font-bold',
                  variant !== 'dashboard' && 'text-[#E5E7EB]'
                )}
              >
                REDQ
              </Link>
              . All rights reserved.
            </Text>
            <Flex
              justify="between"
              align="start"
              className="sm:w-[unset] w-full [@media(min-width:375px)]:gap-6 [@media(min-width:375px)]:justify-center"
            >
              {menuItems.map((item) => (
                <Link
                  key={`key-${item.label}`}
                  href={item.href}
                  {...(item.target
                    ? {
                        target: item.target,
                        rel: 'noreferrer',
                      }
                    : {})}
                  className={cn(
                    'duration-200',
                    variant === 'dashboard'
                      ? 'text-steel-900 font-geist hover:text-black dark:hover:text-white dark:text-steel-100'
                      : 'text-[#E5E7EB]/80 hover:text-[#E5E7EB]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Box>
      </footer>
      <ScrollToTop
        variant={variant}
        className={cn(
          'right-4 md:right-8 -bottom-3 shadow-xl hover:opacity-80 -translate-y-8 3xl:-translate-y-12',
          variant === 'dashboard' &&
            'right-5 md:right-5 xl:right-[37px] 3xl:right-[61px] bg-white',
          variant === 'dashboard' &&
            isMozilla &&
            'xl:right-5 2xl:right-5 3xl:right-10',
          scrollView &&
            '-translate-y-28 sm:-translate-y-[84px] md:-translate-y-24 lg:-translate-y-28 xl:-translate-y-[120px] 3xl:-translate-y-12',
          scrollView &&
            variant === 'dashboard' &&
            'xl:-translate-y-24 3xl:-translate-y-24'
        )}
      />
    </>
  );
}
