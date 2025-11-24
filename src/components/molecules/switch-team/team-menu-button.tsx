import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

interface MenuButtonType
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const TeamMenuButton = forwardRef<HTMLButtonElement, MenuButtonType>(
  ({ children, className, ...rest }, ref) => {
    return (
      <button
        className={cn(
          'w-full relative flex cursor-pointer select-none items-center justify-start gap-3 px-3 min-h-[40px] text-sm text-steel-700 transition-colors hover:bg-steel-50 dark:hover:bg-steel-700 rounded',
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
