import { format } from 'date-fns';

export function formatDateToString(
  date: Date | string | number,
  dateFormat: string = 'MMM dd, yyyy, HH:mm a'
) {
  if (!date) return null;
  return format(new Date(date), dateFormat);
}
