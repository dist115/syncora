'use client';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ArrowUpRight, CheckIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { isValidUrl } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface LinkSelectorProps {
  editor: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddLink({ editor, isOpen, setIsOpen }: LinkSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget[0] as HTMLInputElement;
    const url = input.value;
    if (isValidUrl(url)) {
      url && editor.chain().focus().setLink({ href: url }).run();
    } else {
      toast.error(
        'Enter a valid URL in the correct format (e.g., https://www.example.com).'
      );
    }
    setIsOpen(false);
  }

  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative h-full">
      <button
        type="button"
        className={cn(
          'flex items-center justify-center px-3 gap-1 h-9 border-r border-steel-200 dark:border-steel-600 text-sm',
          editor?.isActive('link')
            ? 'bg-steel-100/50 dark:bg-steel-600/50'
            : 'hover:bg-steel-50/80 hover:dark:bg-steel-700 text-steel-700 dark:text-steel-100'
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ArrowUpRight
          size={18}
          strokeWidth={editor?.isActive('link') ? 2.5 : 1.5}
        />
        <p>Link</p>
      </button>
      {isOpen && (
        <form
          onSubmit={(e) => onSubmit(e)}
          className="fixed top-full z-[99999] mt-2 flex w-[338px] overflow-hidden rounded border gap-2 border-steel-200 bg-white dark:bg-steel-800 dark:border-steel-600 p-1"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Insert a link"
            className="flex-1 p-1 text-sm bg-white border-0 outline-none dark:bg-steel-800 ring-0 focus:ring-0"
            defaultValue={editor.getAttributes('link').href || ''}
          />
          {editor.getAttributes('link').href ? (
            <button
              className="flex items-center py-1 px-1.5 rounded bg-steel-100 hover:bg-steel-100/50 dark:bg-steel-600 dark:hover:bg-steel-600/50 transition-all"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              <TrashIcon size={16} strokeWidth={1.75} />
            </button>
          ) : (
            <button className="flex items-center py-1 px-1.5 rounded bg-steel-100 hover:bg-steel-100/50 dark:bg-steel-600 dark:hover:bg-steel-600/50 transition-all">
              <CheckIcon size={16} strokeWidth={1.75} />
            </button>
          )}
        </form>
      )}
    </div>
  );
}
