'use server';

import { AuthService } from '@/server/service/auth.service'

export const signOut = async () => {
  return AuthService.signOut();
};

export const magicLogin = async (email: string) => {
  return AuthService.magicLogin(email);
};
export const demoLogin = async (email: string) => {
  return AuthService.demoLogin(email);
};