import { redirect } from 'next/navigation';
import { User } from 'lucia';

import { PAGES } from '@/config/pages';

import { validateRequest } from './auth';

export const getCurrentUser = async (): Promise<User> => {
  const { user } = await validateRequest();

  if (!user) redirect(PAGES.AUTH.LOGIN);
  return user;
};