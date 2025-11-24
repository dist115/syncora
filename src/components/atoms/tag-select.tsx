import React from 'react';
import { getAllTags } from '@/server/actions/tag.action';
import AsyncCreatableSelect from 'react-select/async-creatable';

import { cn } from '@/lib/utils/cn';

type TagSelectProps = {
  defaultValue: {
    label: string;
    value: string;
  }[];
  onChange: (...event: any[]) => void;
  setTags: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
};

export const classNames = {
  container: 'w-full',
  control:
    'border !rounded-lg [&]:!border-steel-100 dark:[&]:!border-steel-600 w-full bg-transparent dark:bg-steel-600/20 !min-h-10 !shadow-none ring-[0.6px] ring-transparent transition duration-200 focus:outline-none lg:!min-h-12',
  controlIsFocused:
    '[&]:!border-steel-700 !ring-steel-700 ring-[0.6px] dark:!border-steel-300',
  input:
    'text-steel-700 dark:text-steel-100 focus:[&>input]:outline-none focus:[&>input]:shadow-none focus:[&>input]:ring-0 !text-sm',
  indicatorsContainer: 'hover:!text-steel-200 dark:hover:!text-steel-500',
  dropdownIndicator:
    'text-steel-200 hover:!text-steel-400 dark:text-steel-500 dark:hover:!text-steel-300 !p-1 !mr-2',
  clearIndicator:
    'text-steel-200 hover:!text-steel-400 dark:text-steel-500 dark:hover:!text-steel-300 !p-1',
  indicatorSeparator: '!bg-steel-200 dark:!bg-steel-500',
  indicatorSeparatorIsFocused: '!bg-steel-400',
  valueContainer: '!pl-3',
  multiValue: 'bg-steel-500 dark:bg-steel-600/70 !rounded-full',
  multiValueLabel: 'text-steel-700 dark:text-steel-200 !pl-2.5 !text-sm',
  singleValue: '!text-steel-700 dark:!text-steel-100 !pl-0 !text-sm',
  multiValueRemove:
    'hover:[&]:!bg-transparent !pl-0 !pr-1.5 !text-steel-400 dark:!text-steel-300 hover:!text-steel-700 dark:hover:!text-steel-100',
  menu: 'bg-white dark:bg-steel-700 dark:shadow-[0_3px_18px_rgba(0,0,0,0.1)] dark:border-steel-600/50 dark:border !rounded-md !p-1.5',
  menuPortal: '!z-[9999]',
  option:
    '!bg-transparent !cursor-pointer !rounded !pl-5 !text-sm !text-steel-700 dark:!text-steel-100 active:!bg-steel-50 dark:active:!bg-steel-600/40',
  optionIsFocused:
    '!bg-steel-100/40 dark:!bg-steel-600/50 active:!bg-steel-50 dark:active:!bg-steel-600/40',
  optionIsSelected:
    '!bg-steel-100/70 dark:!bg-steel-600/50 active:!bg-steel-50 dark:active:!bg-steel-600/40',
  optionIsDisabled: '!text-steel-400 !cursor-not-allowed',
  noOptionsMessage: 'text-sm',
  placeholder: '!text-steel-700/70 dark:!text-steel-100/40 text-sm',
};

const TagSelect = ({ onChange, setTags, ...props }: TagSelectProps) => {
  const promiseOptions = async (inputValue: any) => {
    const tags = await getAllTags({ search: inputValue });
    return tags?.map((tag) => ({
      label: tag.label,
      value: tag.id,
    }));
  };

  const handleInputChange = (value: any) => {
    onChange(value);
  };

  const handleChange = (value: any) => {
    setTags(value);
  };
  return (
    <div className={'tagSelectClassName'}>
      <AsyncCreatableSelect
        classNames={{
          container: () => classNames.container,
          control: (state) =>
            cn(
              classNames.control,
              state.isFocused && classNames.controlIsFocused
            ),

          input: () => classNames.input,
          indicatorsContainer: () => classNames.indicatorsContainer,
          dropdownIndicator: () => classNames.dropdownIndicator,
          clearIndicator: () => classNames.clearIndicator,
          indicatorSeparator: (state) =>
            cn(
              classNames.indicatorSeparator,
              state.isFocused && classNames.indicatorSeparatorIsFocused
            ),

          valueContainer: () => classNames.valueContainer,
          multiValue: () => classNames.multiValue,
          multiValueLabel: () => classNames.multiValueLabel,
          singleValue: () => classNames.singleValue,
          multiValueRemove: () => classNames.multiValueRemove,
          menu: () => classNames.menu,
          menuPortal: () => classNames.menuPortal,
          option: (state) =>
            cn(
              classNames.option,
              state.isFocused && classNames.optionIsFocused,
              state.isSelected && classNames.optionIsSelected,
              state.isDisabled && classNames.optionIsDisabled
            ),
          noOptionsMessage: () => classNames.noOptionsMessage,
          placeholder: () => classNames.placeholder,
        }}
        cacheOptions
        defaultOptions
        isMulti
        onChange={handleChange}
        onInputChange={handleInputChange}
        loadOptions={promiseOptions}
        {...props}
      />
    </div>
  );
};

export default TagSelect;
