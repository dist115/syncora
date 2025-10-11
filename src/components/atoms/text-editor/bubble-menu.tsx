'use client';

import { useState } from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils/cn';

import { AddColor } from './add-color';
import { AddLink } from './add-link';

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'>;

export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);

  const bubbleMenuItems = [
    {
      title: 'Bold',
      icon: (
        <BoldIcon
          size={16}
          strokeWidth={editor?.isActive('bold') ? 2.5 : 1.5}
        />
      ),
      command: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive('bold'),
    },
    {
      title: 'Italic',
      icon: (
        <ItalicIcon
          size={16}
          strokeWidth={editor?.isActive('italic') ? 2.5 : 1.5}
        />
      ),
      command: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive('italic'),
    },
    {
      title: 'Underline',
      icon: (
        <UnderlineIcon
          size={18}
          strokeWidth={editor?.isActive('underline') ? 2.5 : 1.5}
        />
      ),
      command: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: () => editor?.isActive('underline'),
    },
    {
      title: 'Strikethrough',
      icon: (
        <StrikethroughIcon
          size={16}
          strokeWidth={editor?.isActive('strike') ? 2.5 : 1.5}
        />
      ),
      command: () => editor?.chain().focus().toggleStrike().run(),
      isActive: () => editor?.isActive('strike'),
    },
    {
      title: 'Code',
      icon: (
        <CodeIcon
          size={18}
          strokeWidth={editor?.isActive('code') ? 2.5 : 1.5}
        />
      ),
      command: () => editor?.chain().focus().toggleCode().run(),
      isActive: () => editor?.isActive('code'),
    },
  ];

  return (
    <BubbleMenu
      className="flex overflow-hidden bg-white border rounded dark:bg-steel-800 border-steel-200 dark:border-steel-600"
      tippyOptions={{
        duration: 100,
        onHidden: () => {
          setIsAddLinkOpen(false);
          setIsAddColorOpen(false);
        },
      }}
      {...props}
    >
      <AddLink
        editor={editor}
        isOpen={isAddLinkOpen}
        setIsOpen={() => {
          setIsAddLinkOpen(!isAddLinkOpen);
          setIsAddColorOpen(false);
        }}
      />
      {bubbleMenuItems?.map((item, index) => (
        <button
          title={item.title}
          onClick={item.command}
          className={cn(
            'flex items-center justify-center w-9 h-9',
            item.isActive()
              ? 'bg-steel-100/50 dark:bg-steel-600/50'
              : 'hover:bg-steel-50/80 hover:dark:bg-steel-700 text-steel-700 dark:text-steel-100'
          )}
          key={index}
        >
          {item.icon}
        </button>
      ))}
      <AddColor
        editor={editor}
        isOpen={isAddColorOpen}
        setIsOpen={() => {
          setIsAddLinkOpen(false);
          setIsAddColorOpen(!isAddColorOpen);
        }}
      />
    </BubbleMenu>
  );
}
