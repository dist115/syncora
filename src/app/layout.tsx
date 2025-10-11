import { Metadata } from 'next';

import { geist, inter } from './font';

import './globals.css';

import { cn } from '@/lib/utils/cn';
import NextProgress from '@/components/atoms/next-progress';

export const metadata: Metadata = {
  title: 'Syncora',
  description: 'A starter kit for building SaaS products with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(inter.className, geist.variable)}
      >
        <NextProgress />
        {children}
      </body>
    </html>
  );
}
