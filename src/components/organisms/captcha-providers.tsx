'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { env } from '@/env.mjs';

export function CaptchaProviders({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
