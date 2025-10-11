'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type TagInputType = {
  tags: string[];
  setTags?: Dispatch<SetStateAction<string[]>>;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function TagInput({
  tags,
  setTags,
  editable = true,
  onChange,
}: TagInputType) {
  const [inputValue, setInputValue] = useState('');
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    onChange?.(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const trimmedInput = inputValue.trim();
    const modifiedTags = tags.map((tag) => tag.toLowerCase());
    const allowedChar = /^[a-zA-Z0-9_-]+$/;

    if (
      (key === ',' || key === 'Enter') &&
      trimmedInput.length &&
      !modifiedTags.includes(trimmedInput.toLowerCase()) &&
      allowedChar.test(trimmedInput)
    ) {
      e.preventDefault();
      setTags?.((prevState) => [...prevState, trimmedInput]);
      setInputValue('');
    }

    if (
      key === 'Backspace' &&
      !inputValue.length &&
      tags.length &&
      isKeyReleased
    ) {
      const tagsClone = [...tags];
      const lastTag = tagsClone?.pop() as string;
      e.preventDefault();

      setTags?.(tagsClone);
      setInputValue(lastTag);
    }
    setIsKeyReleased(false);
  };

  function onKeyUp() {
    setIsKeyReleased(true);
  }

  function deleteTag(idx: number) {
    setTags?.((prevState) => prevState.filter((tag, i) => i !== idx));
  }

  return (
    <div
      className={cn(
        'w-full flex flex-wrap items-center gap-1.5',
        editable &&
          'border dark:border-steel-500 border-steel-200 rounded-md py-2 px-2'
      )}
    >
      {tags.map((tag, idx) => (
        <span
          key={tag + idx}
          className="h-[30px] rounded-md overflow-hidden bg-steel-100/80 dark:bg-steel-600/50 flex items-center"
        >
          <span
            className={cn(
              'text-steel-700 dark:text-steel-200 pl-2 text-sm leading-none flex items-center',
              editable ? 'pl-2' : 'px-2'
            )}
          >
            {tag}
          </span>
          {editable && (
            <button
              type="button"
              className="h-full px-1.5 flex items-center justify-center group"
              onClick={() => deleteTag(idx)}
            >
              <X className="w-3 h-3 text-steel-500 dark:text-steel-300 group-hover:text-steel-700 dark:group-hover:text-steel-100" />
            </button>
          )}
        </span>
      ))}
      {editable && (
        <input
          value={inputValue}
          placeholder="Enter a tag"
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="flex flex-1 min-w-[20px] border-0 ring-0 bg-transparent placeholder:opacity-70 hover:text-steel-700 dark:text-steel-100 placeholder:text-steel-400 text-sm h-auto p-0 outline-none focus:shadow-none focus:outline-none focus:ring-0"
        />
      )}
    </div>
  );
}
