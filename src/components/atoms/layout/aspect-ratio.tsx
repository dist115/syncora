import React from 'react';

import { cn } from '@/lib/utils/cn';

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: string;
  children: React.ReactNode;
}

export function AspectRatio(props: AspectRatioProps) {
  const { ratio = '1/1', children, className, ...rest } = props;

  return (
    <div
      className={cn('relative mx-auto', className)}
      style={{ aspectRatio: ratio }}
      {...rest}
    >
      {children}
    </div>
  );
}
