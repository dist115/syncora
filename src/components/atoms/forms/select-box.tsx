'use client';

import { Fragment, useEffect } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
} from '@floating-ui/react';
import { Listbox, Transition } from '@headlessui/react';
import { isString } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import { ArrowDown, Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : T;

const variantStyles = {
  outline: [
    'w-full',
    'relative w-full cursor-pointer rounded-md border border-steel-200 dark:!border-steel-500 enabled:bg-white dark:enabled:bg-steel-600/40 disabled:bg-[#F8F9FB] pl-5 pr-10 text-left font-medium text-steel-700 dark:text-steel-100 transition-colors focus:outline-none sm:text-sm focus:border-brand',
  ],
  shadow: [
    'w-auto',
    'cursor-default min-w-[160px] w-full rounded-md border-0 bg-white py-3 pl-4 pr-10 text-left text-sm font-medium text-steel-700 shadow transition-colors focus:outline-none focus:ring-0',
  ],
  flat: [
    '',
    'relative w-full cursor-default border-0 rounded-none enabled:bg-white disabled:bg-[#F8F9FB] px-5 text-left text-sm font-medium text-steel-700 focus:!ring-0 focus:border-0 focus:shadow-none',
  ],
};
const heights = {
  lg: ['h-[45px]', 'pr-4'],
  xl: ['h-[50px]', 'pr-4'],
  '2xl': ['h-[60px]', '!pr-[1.5rem]', '!pl-[1.5rem] !pr-[3rem]'],
};
export type SelectOption = {
  value: string;
  label: any;
};
type ListboxProps<Option> = ExtractProps<typeof Listbox> & {
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  btnClassName?: string;
  optionClassName?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  optionWrapperClassName?: string;
  placeholderClassName?: string;
  label?: string;
  error?: string;
  placement?: Placement;
  variant?: 'outline' | 'shadow' | 'flat';
  height?: 'lg' | 'xl' | '2xl';
  options: Option[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isLoading?: boolean;
  displayCheck?: boolean;
  displayValue?(value: ExtractProps<typeof Listbox>['value']): React.ReactNode;
  getOptionDisplayValue?(option: Option): string | undefined;
  getOptionValue?: (option: Option) => Option[keyof Option] | Option;
};
function getOptionValueFn(option: any) {
  return option;
}
function getOptionDisplayValueFn({ label }: SelectOption) {
  if (label) return label;
  return `Error: use getOptionDisplayValue prop`;
}

function displayValueFn(value: any) {
  if (isString(value) || isNumber(value)) return value;
  if (value?.label) return value.label;
  if (value.name) return value.name;
  return `Error: use displayValue prop`;
}

export default function SelectBox<OptionType extends SelectOption>({
  options,
  label,
  error,
  variant = 'outline',
  height = 'lg',
  placement,
  className,
  labelClassName,
  btnClassName,
  optionClassName,
  optionWrapperClassName,
  prefix = null,
  prefixClassName,
  suffix = <ArrowDown className="w-5 h-5" />,
  suffixClassName,
  placeholderClassName,
  placeholder = 'Select',
  isLoading = false,
  displayCheck,
  displayValue = displayValueFn,
  getOptionDisplayValue = getOptionDisplayValueFn,
  getOptionValue = getOptionValueFn,
  value,
  ...props
}: ListboxProps<OptionType>) {
  const { x, y, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: placement ?? 'bottom-start',
    middleware: [
      offset(10),
      flip(),
      size({
        apply({ elements, rects }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  // This one is for recalculating the position of the floating element if no space is left on the given placement
  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update, isLoading]);

  const emptyValue = !isNumber(value) && isEmpty(value);

  return (
    <Listbox {...props} value={value}>
      {label && (
        <Listbox.Label
          className={cn(
            'mb-2 block text-sm leading-5 text-steel-700',
            labelClassName
          )}
        >
          {label}
        </Listbox.Label>
      )}

      <div className="relative h-full">
        <div className="relative h-full" ref={refs.setReference}>
          <Listbox.Button
            className={cn(
              variantStyles[variant][1],
              !['flat'].includes(variant) && heights[height][2],
              heights[height][0],
              btnClassName
            )}
          >
            {({ open }) => (
              <>
                <span className="flex items-center gap-2.5 py-0.5">
                  {prefix && (
                    <span
                      className={cn(
                        'block whitespace-nowrap leading-normal',
                        prefixClassName
                      )}
                    >
                      {prefix}
                    </span>
                  )}
                  <span
                    className={cn('block truncate', {
                      [`normal-case text-steel-400 dark:text-steel-300 ${
                        placeholderClassName ?? ''
                      }`]: emptyValue,
                    })}
                    style={{ fontSize: 'inherit' }}
                  >
                    {emptyValue ? placeholder : displayValue(value)}
                  </span>
                </span>

                {!['flat'].includes(variant) && (
                  <span className="absolute inset-y-0 flex items-center justify-center w-8 cursor-pointer right-1">
                    <ChevronDown
                      className={cn('text-steel-700 dark:text-steel-200')}
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.75}
                    />
                  </span>
                )}
              </>
            )}
          </Listbox.Button>
        </div>

        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 35,
          }}
        >
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                'max-h-[265px] w-full divide-y divide-steel-100 dark:divide-steel-600 overflow-auto rounded-md border border-steel-100 bg-white shadow-dropdown focus:outline-none dark:bg-steel-800 dark:border-steel-600 dark:shadow-none',
                optionWrapperClassName
              )}
            >
              {isEmpty(options) ? (
                <div className="relative px-5 py-8 text-sm font-medium text-center cursor-default select-none text-steel-500 dark:text-steel-400">
                  Nothing found.
                </div>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active, selected }) =>
                      cn(
                        'relative cursor-pointer select-none py-3 pl-5 pr-9 text-sm text-steel-700 dark:text-steel-100 transition-colors duration-200',
                        {
                          'bg-steel-50 dark:bg-steel-600/30': active,
                          'bg-steel-100/50 dark:bg-steel-600/20': selected,
                        },
                        optionClassName
                      )
                    }
                    value={getOptionValue(option)}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cn('block truncate', {
                            'font-medium': selected,
                          })}
                        >
                          {getOptionDisplayValue(option)}
                        </span>
                        {selected && displayCheck && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-steel-700 dark:text-steel-100">
                            <Check className="w-4 h-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
}
