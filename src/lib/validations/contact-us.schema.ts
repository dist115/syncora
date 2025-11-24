import { z } from 'zod';

import { MESSAGES } from '@/config/messages';

export const ContactUsSchema = z.object({
  name: z
    .string()
    .nonempty(MESSAGES.NAME_IS_REQUIRED)
    .min(3, { message: MESSAGES.NAME_TOO_SHORT }),
  email: z
    .string()
    .nonempty(MESSAGES.EMAIL_IS_REQUIRED)
    .email({ message: MESSAGES.MUST_BE_A_VALID_EMAIL }),
  subject: z
    .string()
    .nonempty(MESSAGES.SUBJECT_IS_REQUIRED)
    .min(3, { message: MESSAGES.SUBJECT_TOO_SHORT }),
  message: z
    .string()
    .nonempty(MESSAGES.MESSAGE_IS_REQUIRED)
    .min(8, { message: MESSAGES.MESSAGE_TOO_SHORT }),
});
export type ContactUsInput = z.infer<typeof ContactUsSchema>;
