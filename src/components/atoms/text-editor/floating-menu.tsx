import { FloatingMenu, FloatingMenuProps } from '@tiptap/react';
import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  TextIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type EditorFloatingMenuProps = Omit<FloatingMenuProps, 'children'>;

export function EditorFloatingMenu(props: EditorFloatingMenuProps) {
  const { editor } = props;

  const floatingMenuItems = [
    {
      title: 'Text',
      description: 'Start writing with plain text',
      icon: <TextIcon strokeWidth={1.5} />,
      command: () =>
        editor?.chain().focus().toggleNode('paragraph', 'paragraph').run(),
      isActive: () => editor?.isActive('paragraph'),
    },
    {
      title: 'Heading 1',
      description: 'Large Section Heading',
      icon: <Heading1Icon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor?.isActive('heading', { level: 1 }),
    },
    {
      title: 'Heading 2',
      description: 'Medium Section Heading',
      icon: <Heading2Icon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive('heading', { level: 2 }),
    },
    {
      title: 'Heading 3',
      description: 'Small Section Heading',
      icon: <Heading3Icon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor?.isActive('heading', { level: 3 }),
    },
    {
      title: 'Bullet List',
      description: 'Create a bullet list',
      icon: <ListIcon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: () => editor?.isActive('bulletList'),
    },
    {
      title: 'Ordered List',
      description: 'Create an ordered list',
      icon: <ListOrderedIcon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor?.isActive('orderedList'),
    },
    {
      title: 'Code Block',
      description: 'Create a code snippet',
      icon: <CodeIcon strokeWidth={1.5} />,
      command: () => editor?.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor?.isActive('codeBlock'),
    },
  ];

  return (
    <FloatingMenu
      className="flex flex-col gap-1 p-2 bg-white border rounded-md w-72 dark:bg-steel-800 border-steel-200 dark:border-steel-600"
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
      }}
      {...props}
    >
      {floatingMenuItems?.map((item, index) => (
        <button
          onClick={item.command}
          className={cn(
            'flex items-center gap-2.5 p-1.5 text-sm text-steel-700 dark:text-steel-100 transition-all',
            item.isActive()
              ? 'bg-steel-100/50 dark:bg-steel-600/50'
              : 'hover:bg-steel-50/80 hover:dark:bg-steel-700'
          )}
          key={index}
        >
          <span className="flex items-center justify-center w-10 h-10 text-left border rounded text-steel-500 dark:text-steel-300 border-steel-100 dark:border-steel-600/30 bg-steel-50/30 dark:bg-steel-700">
            {item.icon}
          </span>
          <span>
            <span className="block font-medium text-left">{item.title}</span>
            <span className="block text-xs text-left text-steel-500 dark:text-steel-400">
              {item.description}
            </span>
          </span>
        </button>
      ))}
    </FloatingMenu>
  );
}
