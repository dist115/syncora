import { cn } from '@/lib/utils/cn';

export function TableCell({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableCellElement>) {
  const { className, ...rest } = props;
  return (
    <td
      className={cn(
        'TableCell-root align-middle whitespace-nowrap tabular-nums text-left text-steel-700 dark:text-steel-100/90 px-2.5 py-2 text-sm border-steel-100 dark:border-steel-600',
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}
