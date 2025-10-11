import { Metadata } from 'next';

import { CaptchaProviders } from '@/components/organisms/captcha-providers';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'A starter kit for building SaaS products with Next.js',
};
export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CaptchaProviders>{children}</CaptchaProviders>;
}
