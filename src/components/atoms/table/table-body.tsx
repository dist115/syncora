import { cn } from '@/lib/utils/cn';

export function TableBody({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <tbody
      className={cn(
        'TableBody-root align-top overflow-x-auto divide-y divide-steel-100 dark:divide-steel-600',
        props.className
      )}
    >
      {children}
    </tbody>
  );
}
