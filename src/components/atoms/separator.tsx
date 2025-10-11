import { cn } from '@/lib/utils/cn';

export function Separator(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn('my-2 h-[1px] bg-steel-100 dark:bg-steel-600', className)}
      {...rest}
    ></div>
  );
}
