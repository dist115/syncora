import { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type FieldsetType = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  required?: boolean;
};

export function Fieldset({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,

  required,
}: FieldsetType) {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap gap-3 w-full items-start pb-6 md:pb-7 mb-4 md:mb-6 border-b border-steel-100 dark:border-steel-600/60 last:border-b-0 last:mb-0',
        className
      )}
    >
      <div className="flex flex-col w-full gap-0 max-w-[580px] shrink-0">
        <span className="flex w-full gap-1">
          <h3
            className={cn(
              'text-steel-700 dark:text-steel-100 font-medium text-sm leading-6',
              titleClassName
            )}
          >
            {title}
          </h3>
          {required && (
            <span className="text-sm font-medium leading-6 text-red">*</span>
          )}
        </span>
        <span
          className={cn(
            'text-steel-500 dark:text-steel-400 text-sm leading-6',
            descriptionClassName
          )}
        >
          {description}
        </span>
      </div>

      <div className="sm:min-w-[300px] flex-1 shrink-0">{children}</div>
    </div>
  );
}
