import React from 'react';

import { cn } from '@/lib/utils/cn';

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { children, className, ...rest } = props;

  return (
    <div ref={ref} className={cn('block', className)} {...rest}>
      {children}
    </div>
  );
});


