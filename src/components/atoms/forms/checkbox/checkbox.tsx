'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  className?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ className, children, indeterminate, ...rest }, ref) => {
    return (
      <label
        className={cn(
          'checkbox-component group flex w-auto shrink-0 cursor-pointer items-center justify-start text-sm transition-all',
          className
        )}
      >
        <input
          type="checkbox"
          className="checkbox-input invisible absolute -z-[1] opacity-0"
          ref={ref}
          {...rest}
        />
        <span
          className={cn('checkbox_box', {
            indeterminate: indeterminate,
          })}
        />
        <span className="ml-2 text-steel-700 dark:text-steel-100">
          {children}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export { Checkbox };
