'use client';

import React from 'react';
import ReSelect, { type GroupBase, type Props } from 'react-select';

// interface SelectProps extends Props,CreatableProps;
export default function ReactSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <ReSelect
      {...props}
      classNames={{
        container: () => 'w-full',
        control: (state) =>
          `border [&]:!border-steel-200 dark:[&]:!border-steel-500 w-full bg-transparent dark:bg-steel-600/20 !min-h-[40px] !shadow-none ring-[0.6px] ring-transparent transition duration-200 focus:outline-none ${
            state.isFocused &&
            '[&]:!border-steel-700 !ring-steel-700 ring-[0.6px] dark:!border-steel-300'
          }`,
        input: () =>
          'text-steel-700 dark:text-steel-100 focus:[&>input]:outline-none focus:[&>input]:shadow-none focus:[&>input]:ring-0 !text-sm',
        indicatorsContainer: () =>
          'hover:!text-steel-200 dark:hover:!text-steel-500',
        dropdownIndicator: () =>
          'text-steel-200 hover:!text-steel-400 dark:text-steel-500 dark:hover:!text-steel-300',
        clearIndicator: () =>
          'text-steel-200 hover:!text-steel-400 dark:text-steel-500 dark:hover:!text-steel-300',
        indicatorSeparator: (state) =>
          `!bg-steel-200 dark:!bg-steel-500 ${
            state.isFocused && '!bg-steel-400'
          }`,
        valueContainer: () => '!pl-3',
        multiValue: () => 'bg-steel-500 dark:bg-steel-600/70 !rounded-full',
        multiValueLabel: () =>
          'text-steel-700 dark:text-steel-200 !pl-2.5 !text-sm',
        singleValue: () =>
          '!text-steel-700 dark:!text-steel-100 !pl-0 !text-sm',
        multiValueRemove: () =>
          'hover:[&]:!bg-transparent !pl-0 !pr-1.5 !text-steel-400 dark:!text-steel-300 hover:!text-steel-700 dark:hover:!text-steel-100',
        menu: () =>
          'bg-white dark:bg-steel-700 dark:shadow-[0_3px_18px_rgba(0,0,0,0.1)] dark:border-steel-600/50 dark:border',
        option: (state) =>
          `!bg-transparent !pl-5 !text-sm !text-steel-700 dark:!text-steel-100 active:!bg-steel-50 dark:active:!bg-steel-600/40 ${
            state.isFocused &&
            '!bg-steel-100/40 dark:!bg-steel-600/50 active:!bg-steel-50 dark:active:!bg-steel-600/40'
          } ${
            state.isSelected &&
            '!bg-steel-100/70 dark:!bg-steel-600/50 active:!bg-steel-50 dark:active:!bg-steel-600/40'
          }`,
        placeholder: () => '!text-steel-700/70 dark:!text-steel-100/40 text-sm',
      }}
    />
  );
}
