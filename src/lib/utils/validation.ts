import * as Zod from "zod";
import { ErrorMessageOptions, generateErrorMessage } from "zod-error";

const options: ErrorMessageOptions = {
  delimiter: { error: " " },
  path: { enabled: false },
  code: { enabled: false },
  message: {
    enabled: true,
    transform: ({ label, value }) => `${value}`,
  },
  transform: ({ errorMessage }) => `🚨 ${errorMessage} 🚨`,
};

// export const applyValidation = <T>(
//   schema: any,           // 👈 loosened constraint
//   input: unknown
// ): T => {                 // 👈 still returns the right type
//   const result = schema.safeParse(input);
//   if (!result.success) {
//     const errorMessage = generateErrorMessage(result.error.issues, options);
//     throw new Error(errorMessage);
//   }

//   return result.data as T;
// };

export function applyValidation<T>(
  schema: Zod.ZodSchema<T>,
  input: unknown
): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}