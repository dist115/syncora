import React from 'react';

import { cn } from '@/lib/utils/cn';

import { columnClassNames, NumberOfGrids } from './styles';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: NumberOfGrids;
  children: React.ReactNode;
}

export function Grid(props: GridProps) {
  const { columns = '1', children, className, ...rest } = props;

  return (
    <div
      className={cn('grid gap-7', columnClassNames[columns], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
