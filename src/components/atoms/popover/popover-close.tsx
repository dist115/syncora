import { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { usePopoverContext } from './popover';

export const PopoverClose = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      className={cn(
        'text-gray-900 bg-gray-100 inline-flex px-4 items-center justify-center text-center font-medium rounded-md h-10 text-sm hover:bg-gray-200 transition-all'
      )}
      type="button"
      ref={ref}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
});
