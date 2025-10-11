import { cn } from '@/lib/utils/cn';
import SimpleBar from '@/components/atoms/simplebar';

export function TableRoot({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SimpleBar className={cn('Table-root overflow-x-auto', props.className)}>
      <table className="Table-table table-fixed border-spacing-0 w-full border-y border-steel-100 dark:border-steel-600">
        {children}
      </table>
    </SimpleBar>
  );
}
