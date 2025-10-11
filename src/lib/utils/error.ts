import { toast } from 'sonner';
import { z } from 'zod';

import { MESSAGES } from '@/config/messages';

export const handleError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    const errors = error.issues.map((err) => {
      return err.message;
    });
    return toast.error(errors.join('\n'));
  } else if (error instanceof Error) {
    return toast.error(error.message);
  } else {
    return toast.error(MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER);
  }
};

export const handleErrorMessage = (error: unknown, message: string) => {
  console.error(error);
  return toast.error(message);
};

export const showErrorMessage = (message: any) => {
  if (typeof message === 'object' && Object.hasOwn(message, 'errorMessage')) {
    return toast.error(message.errorMessage);
  } else if (typeof message === 'string') {
    return toast.error(message);
  } else {
    return toast.error(MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER);
  }
};

export const handleServerError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      error: true,
      errorMessage: error.message,
    };
  } else if (error instanceof z.ZodError) {
    const errors = error.issues.map((err) => {
      return err.message;
    });
    return {
      error: true,
      errorMessage: errors.join('\n'),
    };
  } else {
    return {
      error: true,
      errorMessage: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    };
  }
};

export const hasError = (obj: any) => {
  return (
    typeof obj === 'object' &&
    'error' in obj &&
    typeof obj.error === 'boolean' &&
    'errorMessage' in obj &&
    typeof obj.errorMessage === 'string'
  );
};