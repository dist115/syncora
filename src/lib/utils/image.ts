import { IMAGE_TYPES } from '@/config/file';

export function acceptedFileType() {
  const result = IMAGE_TYPES.reduce((acc, value) => {
    return { ...acc, [value]: [] };
  }, {});

  return result;
}
