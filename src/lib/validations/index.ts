import { z, ZodError, ZodSchema } from "zod";

export const Validate = <T extends z.ZodTypeAny>(
  schema: T,
  input: z.infer<T>
) => {
  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      error: true,
      message: (result.error as ZodError).format(),
    };
  }
  return { error: false, message: "" };
};
