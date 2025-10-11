import { tagsPivot } from '@/db/schema/tags-pivot';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateTaPivotSchema = createInsertSchema(tagsPivot, {
  taggableId: z.string().cuid2().nonempty(),
}).pick({
  taggableId: true,
  tagType: true,
});

export type TagPivotInput = z.infer<typeof CreateTaPivotSchema>;
