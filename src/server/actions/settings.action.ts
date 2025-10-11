'use server';

import { revalidateTag } from 'next/cache';

import { applyValidation } from '@/lib/utils/validation';
import {
  SiteSettingsInput,
  SiteSettingsSchema,
} from '@/lib/validations/site-settings.schema';

import { SettingsService } from '../service';
import { handleServerError } from '@/lib/utils/error';

export const getAllSettings = async () => {
  const settings = await SettingsService.getAll();
  revalidateTag('settings');
  return settings;
};

export const getSetting = async (key: string) => {
  const setting = await SettingsService.get(key);
  revalidateTag('settings');
  return setting;
};

export const updateSettings = async (input: SiteSettingsInput) => {
  try {
    const data = applyValidation(SiteSettingsSchema, input);
    const settings = await SettingsService.createOrUpdate(data);
    revalidateTag('settings');
    return settings;

  } catch(error) {
    return handleServerError(error)
  }

};
