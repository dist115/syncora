'use server';

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/server/service/user.service';
import { utils } from 'xlsx';

import { validateRequest } from '@/lib/utils/auth';
import { handleServerError } from '@/lib/utils/error';
import { getCurrentUser } from '@/lib/utils/session';
import { applyValidation } from '@/lib/utils/validation';
import {
  CreateUserInput,
  UpdateProfileInput,
  UpdateProfileSchema,
  UpdateUserInput,
  UpdateUserSchema,
} from '@/lib/validations/user.schema';

import { BillingService } from '../service';

export const getAllUsers = async () => {
  const users = await UserService.getAll();
  revalidateTag('get-all-users');
  return users;
};

export const me = async () => {
  const user = await getCurrentUser();
  const profile = await UserService.getUserDetails(user.id);
  revalidateTag('profile');
  return profile;
};

export const updateProfile = async (input: UpdateProfileInput) => {
  try {
    const data = applyValidation(UpdateProfileSchema, input);
    const user = await getCurrentUser();
    const profile = await UserService.update(user?.id as string, data);
    revalidateTag('profile');
    return profile;
  } catch (error) {
    return handleServerError(error);
  }
};

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  try {
    const data = applyValidation(UpdateUserSchema, input);
    const profile = await UserService.update(userId, data);
    revalidateTag('get-users');
    return profile;
  } catch (error) {
    return handleServerError(error);
  }
};

export const updateCurrentTeam = async (teamId: string | null) => {
  const user = await getCurrentUser();

  const { session } = await validateRequest();

  const profile = await UserService.updateCurrentTeam(
    user?.id as string,
    teamId
  );
  revalidateTag(`current-team`);
  return profile;
};

export const getUsers = async (params: any) => {
  const users = await UserService.getUsers(params);
  return users;
};

export const deleteUser = async (id: string) => {
  try {
    const user = await UserService.delete(id);
    revalidateTag('get-users');
    return user;
  } catch (error) {
    return handleServerError(error);
  }
};

export const createUser = async (input: CreateUserInput) => {
  try {
    const user = await UserService.create(input);

    revalidateTag('get-users');
    return user;
  } catch (error) {
    return handleServerError(error);
  }
};

export const getUserSession = async (userId: string) => {
  return await UserService.getUserSession(userId);
};

export const exportUsers = async (params: any) => {
  const users = await UserService.exportUsers(params);

  /* cherry pick objects */
  const rows = users.map((row: any) => ({
    name: row.name,
    email: row.email,
    status: row.status,
  }));

  /* generate worksheet and workbook */
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Data');
  utils.sheet_add_aoa(worksheet, [['Name', 'Email', 'Status']], {
    origin: 'A1',
  });

  return workbook;
};

export const getCurrentSubscription = async () => {
  const user = await getCurrentUser();
  const planId = await BillingService.getActiveSubscription(user?.id as string);
  revalidateTag('user-subscription');
  return planId;
};
