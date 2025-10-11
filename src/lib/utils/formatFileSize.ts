import { GB, KB, MB } from '@/config/file';

export function formatFileSize(fileSizeInBytes: number) {
  if (fileSizeInBytes < KB) {
    return fileSizeInBytes + ' Bytes';
  } else if (fileSizeInBytes < MB) {
    return (fileSizeInBytes / KB).toFixed(2) + ' KB';
  } else if (fileSizeInBytes < GB) {
    return (fileSizeInBytes / MB).toFixed(2) + ' MB';
  } else {
    return (fileSizeInBytes / GB).toFixed(2) + ' GB';
  }
}

export function calculatePercentage(currentValue: number, totalValue: number) {
  if (totalValue <= 0) {
    throw new Error('Total value must be greater than 0');
  }

  const percentage = (currentValue / totalValue) * 100;
  return Math.min(100, Math.max(0, percentage));
}
