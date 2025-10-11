import { z } from 'zod';

const FaqItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const FaqSchema = z.object({
  faq: z.array(FaqItemSchema),
});
export type FaqInput = z.infer<typeof FaqSchema>;
