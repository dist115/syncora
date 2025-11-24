import { z } from 'zod';

import { MESSAGES } from '@/config/messages';
import { ImageSchema } from '@/lib/validations/image.schema';

export const TeamSettingsSchema = z.object({
  name: z
    .string()
    .min(3, { message: MESSAGES.NAME_MUST_BE_AT_LEAST_3_CHARACTERS }),
  slug: z
    .string()
    .min(3, { message: MESSAGES.SLUG_MUST_BE_AT_LEAST_3_CHARACTERS }),
  domain: z.string().nullish(),
  avatar: z.union([z.any(), ImageSchema]).optional(),
});
export type TeamSettingsInput = z.infer<typeof TeamSettingsSchema>;
