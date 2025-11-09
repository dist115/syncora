'use server';

import { PasswordAuthService } from '@/server/service/password-auth.service';
import {
  signupSchema,
  loginSchema,
  mfaVerifySchema,
  enableMfaSchema,
  resetPasswordSchema,
  newPasswordSchema,
} from '@/lib/validations/auth.schema';

export const signupAction = async (data: any) => {
  const validation = signupSchema.safeParse(data);
  console.log(data);
  console.log(validation);
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.signup(validation.data);
};

export const loginAction = async (data: any) => {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.login(validation.data);
};

export const verifyEmailAction = async (token: string) => {
  return PasswordAuthService.verifyEmail(token);
};

export const verifyMfaAndLoginAction = async (data: any) => {
  const validation = mfaVerifySchema.safeParse({ code: data.code });
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.verifyMfaAndLogin(data);
};

export const enableMfaAction = async (userId: string) => {
  return PasswordAuthService.enableMfa(userId);
};

export const verifyMfaSetupAction = async (data: any) => {
  const validation = enableMfaSchema.safeParse({ code: data.code });
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.verifyMfaSetup(data);
};

export const disableMfaAction = async (userId: string, code: string) => {
  const validation = mfaVerifySchema.safeParse({ code });
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.disableMfa(userId, code);
};

export const requestPasswordResetAction = async (data: any) => {
  const validation = resetPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.requestPasswordReset(validation.data.email);
};

export const resetPasswordAction = async (data: any) => {
  const validation = newPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      ok: false,
      error: validation.error.errors[0].message,
    };
  }

  return PasswordAuthService.resetPassword({
    token: validation.data.token,
    newPassword: validation.data.password,
  });
};