import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';

import { uploadSingleFile } from './s3/upload-single';

export function isFileArray(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return true;
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function isFile(file: unknown): file is File {
  return file instanceof File;
}

export function copyToClipboard(text: string, message: string): void {
  navigator.clipboard.writeText(text).then(
    () => {
      toast.success(message);
    },
    (err) => {
      toast.error(MESSAGES.FAILED_TO_COPY_PLEASE_TRY_AGAIN);
    }
  );
}

export const stringToBoolean = (value: any) => {
  if (typeof value === 'undefined' || value === null) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }

  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(value);
  }
};

export const isFileName = (name: string) => {
  return name.match(/^[a-zA-Z0-9-_]+$/);
};

export const isStringContainsImageType = (name: string) => {
  const match = name.match(/\.(jpeg|jpg|gif|png|webp)$/);

  return match ? true : false;
};

export async function uploadFile(fieldName: string, inputs: any) {
  if (Array.isArray(inputs[fieldName])) {
    const image = await uploadSingleFile(inputs[fieldName][0]);
    inputs[fieldName] = image;
  }
}
