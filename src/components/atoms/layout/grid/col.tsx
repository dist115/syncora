import React from 'react';

import { cn } from '@/lib/utils/cn';

import { NumberOfGrids, spanClassNames } from './styles';

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: NumberOfGrids;
  children: React.ReactNode;
}

export function Col(props: ColProps) {
  const { span = '1', children, className, ...rest } = props;

  return (
    <div className={cn('grid', spanClassNames[span], className)} {...rest}>
      {children}
    </div>
  );
}
