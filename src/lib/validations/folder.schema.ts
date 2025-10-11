import { z } from 'zod';

import { MESSAGES } from '@/config/messages';

export const UpdateFolderSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.FOLDER_NAME_MUST_NOT_BE_EMPTY }),
  parentId: z.string().optional(),
});

export type UpdateFolderInput = z.infer<typeof UpdateFolderSchema>;
