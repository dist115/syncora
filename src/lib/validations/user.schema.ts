import { users, UserStatus } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { MESSAGES } from '@/config/messages';
import { ImageSchema } from '@/lib/validations/image.schema';

export const CreateUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  status: true,
  googleId: true,
  emailVerified: true,
  image: true,
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateProfileSchema = z.object({
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL_ADDRESS }),
  name: z
    .string()
    .min(3, { message: MESSAGES.NAME_MUST_BE_AT_LEAST_3_CHARACTERS }),
  image: z.union([z.any(), ImageSchema]).optional(),
});

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: MESSAGES.NAME_MUST_BE_AT_LEAST_3_CHARACTERS }),
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL_ADDRESS }),
  status: z.enum([UserStatus.Active, UserStatus.Inactive]),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
