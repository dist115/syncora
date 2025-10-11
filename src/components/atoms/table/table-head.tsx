import { cn } from '@/lib/utils/cn';

export function TableHead({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <thead
      className={cn(
        'TableHead-root text-left border-b border-steel-100 dark:border-steel-600',
        props.className
      )}
    >
      {children}
    </thead>
  );
}
