'use client';

import { forwardRef } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  useMergeRefs,
  useTransitionStyles,
} from '@floating-ui/react';

import { cn } from '@/lib/utils/cn';

import { usePopoverContext } from './popover';

const translatePosition = {
  top: 'translate(0px, -20px)',
  right: 'translate(20px, 0)',
  bottom: 'translate(0px, 20px)',
  left: 'translate(-20px, 0)',
};

export const PopoverContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent({ style, className, ...props }, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const { isMounted, styles: transitionStyles } = useTransitionStyles(
    floatingContext,
    {
      initial: ({ side }) => ({
        opacity: 0,
        transform: translatePosition[side],
      }),
      open: {
        opacity: 1,
        transform: 'translate(0)',
      },
      close: ({ side }) => ({
        opacity: 0,
        transform: translatePosition[side],
      }),
    }
  );

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          className="z-10 outline-none"
          {...context.getFloatingProps(props)}
        >
          <div
            className={cn(
              'bg-white dark:bg-steel-800 dark:border-steel-600 border border-steel-200 p-6 rounded-md w-[360px]',
              className
            )}
            style={{ ...transitionStyles }}
          >
            {props.children}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
