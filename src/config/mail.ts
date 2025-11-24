import { env } from '@/env.mjs';

export const MAIL = {
  host: env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(env.SMTP_PORT || '2525'),
  secure: false,
  auth: {
    user: env.SMTP_USER || 'user',
    pass: env.SMTP_PASSWORD || 'password',
  },
  from: env.SMTP_FROM_EMAIL || 'admin@location.dev',
};
