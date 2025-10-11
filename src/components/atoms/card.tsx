import React from 'react';

import { cn } from '@/lib/utils/cn';

const borderDirection = {
  top: 'border-t-4',
  right: 'border-r-4',
  bottom: 'border-b-4',
  left: 'border-l-4',
};
const borderDirectionColors = {
  purple: 'border-purple-500',
  indigo: 'border-indigo-500',
  cyan: 'border-cyan-500',
  fuchsia: 'border-fuchsia-500',
  rose: 'border-rose-500',
  emerald: 'border-emerald-500',
};
interface CardPropsType extends React.HTMLAttributes<HTMLDivElement> {
  direction?: keyof typeof borderDirection;
  directionColor?: keyof typeof borderDirectionColors;
}

export function Card(props: CardPropsType) {
  const { direction, directionColor, className, ...rest } = props;

  return (
    <div
      className={cn(
        'border p-7 rounded-lg dark:bg-steel-800 bg-steel-50/20 border-steel-100 dark:border-steel-600/60 relative',
        direction && borderDirection[direction],
        directionColor && borderDirectionColors[directionColor],
        className
      )}
      {...rest}
    >
      {props.children}
    </div>
  );
}
