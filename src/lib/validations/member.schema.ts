import { TeamMemberStatus, TeamRole } from '@/db/schema';
import { z } from 'zod';

import { MESSAGES } from '@/config/messages';

export const InviteMemberSchema = z.object({
  name: z
    .string()
    .min(3, { message: MESSAGES.NAME_MUST_BE_AT_LEAST_3_CHARACTERS }),
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL_ADDRESS }),
  roleId: z.number(),
});

export const UpdateMemberSchema = z.object({
  name: z
    .string()
    .min(3, { message: MESSAGES.NAME_MUST_BE_AT_LEAST_3_CHARACTERS }),
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL_ADDRESS }),
  roleId: z.number(),
  status: z.enum([TeamMemberStatus.Active, TeamMemberStatus.Inactive]),
});

export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
