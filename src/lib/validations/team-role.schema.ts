import { teamRole } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateTeamRoleSchema = createInsertSchema(teamRole, {
  permissions: z.array(z.string()),
  name: z.string().min(1, { message: 'Role name is required' }),
}).pick({
  name: true,
  description: true,
  permissions: true,
  teamId: true,
});

export type TeamRoleInput = z.infer<typeof CreateTeamRoleSchema>;
