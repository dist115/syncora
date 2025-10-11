import { Schema, ZodError, ZodSchema } from 'zod';

export const Validate = (schema: ZodSchema, input: Zod.infer<Schema>) => {
  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      error: true,
      message: (result.error as ZodError).format(),
    };
  }
  return { error: false, message: '' };
};
