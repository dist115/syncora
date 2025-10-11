'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/cn';
import Link, { type LinkProps } from '@/components/atoms/next/link';

interface NextLinkProps extends LinkProps {
  icon?: any;
  className?: string;
}

export function SidebarLink({
  icon,
  className,
  ...props
}: React.PropsWithChildren<NextLinkProps>) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      className={cn(
        'flex items-center transition-colors gap-2 py-2 rounded-md border px-3 group outline-none focus-visible:border-steel-600',
        isActive
          ? 'bg-steel-100/70 text-steel-700 border-steel-100 font-medium dark:bg-steel-600/50 dark:border-steel-600/50 dark:text-white'
          : 'text-steel-700 hover:text-steel-900 border-transparent dark:text-white dark:hover:text-white/70',
        className
      )}
      {...props}
    />
  );
}
