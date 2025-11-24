import { comments } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateCommentsSchema = createInsertSchema(comments, {
  commentableId: z.string().cuid2().nonempty(),
  content: z
    .string()
    .max(255, { message: 'Comment must contain at most 255 characters' })
    .nonempty('Comment cannot be empty'),
}).pick({
  content: true,
  commentableId: true,
  commentType: true,
});

export type CommentInput = z.infer<typeof CreateCommentsSchema>;
