import { z } from 'zod';

import { MESSAGES } from '@/config/messages';
import { ImageSchema } from '@/lib/validations/image.schema';

export const UploadFileSchema = z.object({
  file: z.union([z.any(), ImageSchema]).optional(),
});

export type UploadFileInput = z.infer<typeof UploadFileSchema>;
