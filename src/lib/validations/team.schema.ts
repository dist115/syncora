import { team } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import * as z from 'zod';

import { MESSAGES } from '@/config/messages';

export const CreateTeamSchema = createInsertSchema(team, {
  createdBy: z.string().cuid2(),
  name: z
    .string()
    .min(3, {
      message: MESSAGES.MINIMUM_OF_3_CHARACTERS,
    })
    .max(100),
})
  .pick({
    name: true,
  })
  .transform((team) => ({
    name: team.name.trim(),
  }));
export type TeamInput = z.infer<typeof CreateTeamSchema>;
