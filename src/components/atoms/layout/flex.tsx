import React from 'react';

import { cn } from '@/lib/utils/cn';

type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'normal';
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

const flexDirectionClassName: { [key in FlexDirection]: string } = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};
const justifyContentClassName: { [key in JustifyContent]: string } = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  normal: 'justify-normal',
};
const alignItemsClassName: { [key in AlignItems]: string } = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  children: React.ReactNode;
}

export function Flex(props: FlexProps) {
  const {
    direction = 'row',
    justify = 'between',
    align = 'center',
    children,
    className,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        'flex w-full gap-4',
        flexDirectionClassName[direction],
        justifyContentClassName[justify],
        alignItemsClassName[align],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
