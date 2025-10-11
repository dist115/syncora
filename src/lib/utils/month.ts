export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getMonthName(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return months[date.getMonth()];
}
