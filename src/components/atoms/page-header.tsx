import { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type FieldsetType = {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  childrenClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  headingWrapperClassName?: string;
};

export function PageHeader({
  title,
  description,
  children,
  className,
  childrenClassName,
  titleClassName,
  descriptionClassName,
  headingWrapperClassName,
}: FieldsetType) {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap gap-3 w-full items-start pb-6 mb-5 md:mb-6 border-b border-steel-100 dark:border-steel-600/60 last:border-b-0 last:mb-0',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col w-full gap-0 max-w-[580px] shrink-0',
          headingWrapperClassName
        )}
      >
        <h3
          className={cn(
            'text-steel-700 dark:text-steel-100 font-medium text-sm leading-6',
            titleClassName
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-steel-500 dark:text-steel-400 text-sm leading-6',
            descriptionClassName
          )}
        >
          {description}
        </p>
      </div>

      {children && (
        <div className={cn('flex-1 shrink-0', childrenClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
