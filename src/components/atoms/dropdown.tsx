import React, { ElementType, Fragment } from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useFloating,
} from '@floating-ui/react';
import { Menu, Transition } from '@headlessui/react';

import { cn } from '@/lib/utils/cn';

export { Menu } from '@headlessui/react';

interface IDropdownProps {
  align?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  children: React.ReactNode;
  contentClassName?: string;
  className?: string;
  trigger: React.ReactNode;
  noStyle?: boolean;
  disabled?: boolean;
  portal?: boolean;
  as?: ElementType;
}

const dropdownClasses = {
  contentClasses:
    'flex w-56 flex-col divide-y divide-steel-100 dark:divide-steel-600 overflow-hidden rounded-md bg-white dark:bg-steel-800 border border-steel-100 dark:border-steel-600',
};

const Dropdown = (props: IDropdownProps) => {
  const { as = 'div', disabled = false, portal = false } = props;
  let alignmentClasses: string;

  switch (props.align) {
    case 'top':
      alignmentClasses = 'origin-bottom';
      break;
    case 'top-start':
      alignmentClasses = 'origin-bottom-left';
      break;
    case 'top-end':
      alignmentClasses = 'origin-bottom-right';
      break;
    case 'bottom':
      alignmentClasses = 'origin-top';
      break;
    case 'bottom-start':
      alignmentClasses = 'origin-top-left';
      break;
    case 'bottom-end':
      alignmentClasses = 'origin-top-right';
      break;
    case 'left':
      alignmentClasses = 'origin-right';
      break;
    case 'left-start':
      alignmentClasses = 'origin-top-right';
      break;
    case 'left-end':
      alignmentClasses = 'origin-bottom-right';
      break;
    case 'right':
      alignmentClasses = 'origin-left';
      break;
    case 'right-start':
      alignmentClasses = 'origin-top-left';
      break;
    case 'right-end':
      alignmentClasses = 'origin-bottom-left';
      break;
    default:
      alignmentClasses = 'origin-top-right';
      break;
  }

  const { x, y, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: props.align ?? 'bottom-end',
    middleware: [offset(10), flip()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Menu as="div" className={cn('relative h-full', props.className)}>
      {({ open }) => (
        <>
          <Menu.Button
            as={as}
            ref={refs.setReference}
            className="h-full"
            disabled={disabled}
          >
            {props.trigger}
          </Menu.Button>

          {!portal && (
            <div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: 0,
                left: 0,
                zIndex: 15,
                transform: `translate(${Math.round(x)}px,${Math.round(y)}px)`,
              }}
            >
              <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className={`rounded-md ${alignmentClasses}`}>
                  <Menu.Items
                    static
                    className={cn(
                      'focus:outline-none',
                      !props.noStyle && dropdownClasses.contentClasses,
                      props.contentClassName
                    )}
                  >
                    {props.children}
                  </Menu.Items>
                </div>
              </Transition>
            </div>
          )}

          {portal && (
            <FloatingPortal id="dropdown-portal">
              {open && (
                <div
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: 0,
                    left: 0,
                    zIndex: 15,
                    transform: `translate(${Math.round(x!)}px,${Math.round(
                      y!
                    )}px)`,
                  }}
                >
                  <div className={`rounded-md ${alignmentClasses}`}>
                    <Menu.Items
                      static
                      className={cn(
                        'focus:outline-none',
                        !props.noStyle && dropdownClasses.contentClasses,
                        props.contentClassName
                      )}
                    >
                      {props.children}
                    </Menu.Items>
                  </div>
                </div>
              )}
            </FloatingPortal>
          )}
        </>
      )}
    </Menu>
  );
};

export default Dropdown;
