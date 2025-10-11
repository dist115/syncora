import { Schema, ZodSchema } from 'zod';
import { ErrorMessageOptions, generateErrorMessage } from 'zod-error';

/**
 * 
 * Example of options:

const options: ErrorMessageOptions = {
    delimiter: {
      error: ' ',
    },
    path: {
      enabled: true,
      type: 'objectNotation',
      transform: ({ label, value }) => `<${label}: ${value}>`,
    },
    code: {
      enabled: true,
      transform: ({ label, value }) => `<${label}: ${value}>`,
    },
    message: {
      enabled: true,
      transform: ({ label, value }) => `<${label}: ${value}>`,
    },
    transform: ({ errorMessage }) => `👉 ${errorMessage} 👈`,
  };
 */

const options: ErrorMessageOptions = {
  delimiter: {
    error: ' ',
  },
  path: {
    enabled: false,
  },
  code: {
    enabled: false,
  },
  message: {
    enabled: true,
    transform: ({ label, value }) => `${value}`,
  },
  transform: ({ errorMessage }) => `🚨 ${errorMessage} 🚨`,
};

export const applyValidation = <T extends Zod.infer<Schema>>(
  schema: ZodSchema,
  input: T
): T => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const errorMessage = generateErrorMessage(result.error.issues, options);
    throw new Error(errorMessage);
  }

  return result.data;
};
