'use server';

import { env } from '@/env.mjs';

export async function verifyCaptchaAction(token: string) {
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
    method: 'POST'
  });

  const responseData = await response.json();

  if (responseData.score > 0.5) {
    return true;
  } else {
    return false;
  }
}
