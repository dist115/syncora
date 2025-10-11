import { z } from 'zod';

import { ImageSchema } from '@/lib/validations/image.schema';

const FaqSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const SiteSettingsSchema = z.object({
  logo: z.union([z.any(), ImageSchema]).optional(),
  logo_small: z.union([z.any(), ImageSchema]).optional(),
  dark_mode_logo: z.union([z.any(), ImageSchema]).optional(),
  dark_mode_logo_small: z.union([z.any(), ImageSchema]).optional(),
  maintenance: z.union([z.string(), z.boolean()]).optional(),
  email: z.string().email().optional(),
  header_color: z.string().optional(),
  sidebar_color: z.string().optional(),
  background_color: z.string().optional(),
  privacy_policy: z.string().optional(),
  terms: z.string().optional(),
  faq: z.array(FaqSchema).or(z.string()).optional(),
});

export type FaqInput = z.infer<typeof FaqSchema>;
export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;
