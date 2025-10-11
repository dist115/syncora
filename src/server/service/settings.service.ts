import { db } from '@/db';
import { isEmpty } from 'lodash';

import { env } from '@/env.mjs';
import { isStringContainsImageType } from '@/lib/utils';

import 'server-only';

import { settings } from '@/db/schema';

export const SettingsService = {
  getAll: async () => {
    const all = await db.query.settings.findMany();
    const settings: any = {};
    all.forEach((item: any) => {
      if (
        isStringContainsImageType(item.value) &&
        item.value.startsWith('http') == false
      ) {
        settings[item.key] = `${env.NEXT_PUBLIC_UPLOAD_URL}/${item.value}`;
      } else {
        settings[item.key] = item.value;
      }
    });
    return settings;
  },

  get: async (key: string) => {
    const setting = await db.query.settings.findFirst({
      where: (settings, { eq }) => eq(settings.key, key),
    });

    if (
      !isEmpty(setting) &&
      isStringContainsImageType(setting.value as string) &&
      setting.value?.startsWith('http') == false
    ) {
      setting.value = `${env.NEXT_PUBLIC_UPLOAD_URL}/${setting.value}`;
    }

    return setting;
  },

  createOrUpdate: async (data: any) => {
    const createData = Object.entries(data).map(([key, value]) => {
      return {
        key,
        value: value + '',
      };
    });
    await db.transaction(async (tx) => {
      for (const item of createData) {
        await tx
          .insert(settings)
          .values(item)
          .onConflictDoUpdate({
            target: settings.key,
            set: { value: item.value },
          });
      }
    });
    
    const collection = await db.query.settings.findMany({
      where: (settings, { inArray }) =>
        inArray(settings.key, Object.keys(data)),
    });

    const stngs: any = {};
    collection.forEach((item: any) => {
      stngs[item.key] = item.value;
    });
    return stngs;
  },
};
