import React, { useEffect, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { Input } from 'rizzui';

import { cn } from '@/lib/utils/cn';

type SearchProps = {
  inputClassName?: string;
  className?: string;
  name: string;
  onSubmit: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  defaultValue?: string | null;
  queryParams?: any;
};

export function SearchBox({
  className,
  inputClassName,
  onSubmit,
  onClear,
  placeholder,
  name,
  defaultValue,
  queryParams,
}: SearchProps) {
  const [searchValue, setSearchValue] = useState<string>(defaultValue ?? '');

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onSubmit(searchValue);
  }

  const param = queryParams[name];

  useEffect(() => {
    if (typeof param === 'undefined') {
      setSearchValue('');
    } else {
      setSearchValue(param);
    }
  }, [param]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn('relative w-full', className)}
    >
      <Input
        name={name}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        prefix={<RiSearchLine size={16} className="text-steel-500" />}
        inputClassName={inputClassName}
        clearable={searchValue.length > 0}
        autoComplete="off"
        onClear={() => {
          setSearchValue('');
          if (onClear) onClear();
        }}
      />
    </form>
  );
}

SearchBox.displayName = 'SearchBox';
