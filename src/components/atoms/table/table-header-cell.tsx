import { cn } from '@/lib/utils/cn';

export function TableHeaderCell({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableCellElement>) {
  const { className, ...rest } = props;
  return (
    <th
      className={cn(
        'TableHeaderCell-root sticky whitespace-nowrap text-left text-sm text-steel-700 dark:text-steel-100 font-medium top-0 px-2.5 py-2 border-steel-100 dark:border-steel-600',
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}
