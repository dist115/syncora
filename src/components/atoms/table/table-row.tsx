import { cn } from '@/lib/utils/cn';

export function TableRow({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'TableRow-root transition-colors duration-200 hover:bg-steel-50 dark:hover:bg-steel-700',
        props.className
      )}
    >
      {children}
    </tr>
  );
}
