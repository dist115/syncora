import { tags } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateTagSchema = createInsertSchema(tags).pick({
  label: true,
});

export type TagInput = z.infer<typeof CreateTagSchema>;
