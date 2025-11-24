'use server';

import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';

import { GB, KB, MB } from '@/config/file';
import { MESSAGES } from '@/config/messages';
import { handleServerError } from '@/lib/utils/error';
import { formatFileSize } from '@/lib/utils/formatFileSize';

import { BillingService } from '../service';
import { getCurrentSubscription, me } from './user.action';

export const getCustomerId = async () => {
  const user = await me();
  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  if (!user.customerId) {
    const customerId = await BillingService.getCustomerId(user.id);
    return customerId;
  }
  return user.customerId;
};

export const getRedirectUrl = async (
  planId: string,
  teamId: string | null = null,
  redirectUrl: string
) => {
  try {
    const user = await me();

    const response = await BillingService.getCheckoutUrl(
      user.id,
      planId,
      teamId,
      redirectUrl
    );
    revalidateTag('user-subscription');
    return response;
  } catch (error) {
    return handleServerError(error);
  }
};

export const getCurrentTeamSubscription = async () => {
  try {
    const user = await me();
    if (!user.currentTeamId) throw new Error(MESSAGES.TEAM_NOT_FOUND);
    const subscription = await BillingService.getCurrentTeamSubscription(
      user.id,
      user.currentTeamId
    );
    revalidateTag(`team-${user.currentTeamId}-subscription`);
    return subscription;
  } catch (error) {
    handleServerError(error);
  }
};

export const formatUserStorageCapacity = async () => {
  const subscription = await getCurrentSubscription();
  if (subscription) {
    const separateStorageSize = (sizeString: any) => {
      // Use regex to match the numeric part and the unit part
      const match = sizeString.match(/^(\d+)([A-Za-z]+)$/);

      if (match) {
        // Extract the numeric value and unit
        const size = parseInt(match[1], 10);
        const unit = match[2];

        return { size, unit };
      } else {
        return null;
      }
    };
    const result = separateStorageSize(subscription.storage);
    if (result?.unit === 'KB') {
      const calculateStorageCapacity = result?.size * KB;
      return calculateStorageCapacity;
    }
    if (result?.unit === 'MB') {
      const calculateStorageCapacity = result?.size * MB;
      return calculateStorageCapacity;
    }
    if (result?.unit === 'GB') {
      const calculateStorageCapacity = result?.size * GB;
      return calculateStorageCapacity;
    }
  } else {
    const calculateStorageCapacity = 300 * MB;
    return calculateStorageCapacity;
  }
};
export const formatTeamStorageCapacity = async () => {
  const subscription = await getCurrentTeamSubscription();
  if (subscription) {
    const separateStorageSize = (sizeString: any) => {
      // Use regex to match the numeric part and the unit part
      const match = sizeString.match(/^(\d+)([A-Za-z]+)$/);

      if (match) {
        // Extract the numeric value and unit
        const size = parseInt(match[1], 10);
        const unit = match[2];

        return { size, unit };
      } else {
        return null;
      }
    };
    const result = separateStorageSize(subscription.storage);
    if (result?.unit === 'KB') {
      const calculateStorageCapacity = result?.size * KB;
      return calculateStorageCapacity;
    }
    if (result?.unit === 'MB') {
      const calculateStorageCapacity = result?.size * MB;
      return calculateStorageCapacity;
    }
    if (result?.unit === 'GB') {
      const calculateStorageCapacity = result?.size * GB;
      return calculateStorageCapacity;
    }
  } else {
    const calculateStorageCapacity = 600 * MB;
    return calculateStorageCapacity;
  }
};
