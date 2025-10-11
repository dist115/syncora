'use client';

import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@/lib/utils/cn';

import { EditorBubbleMenu } from './bubble-menu';
import { EditorFloatingMenu } from './floating-menu';

interface TextEditorProps {
  onUpdate?: (data: string) => void;
  defaultValue?: string;
  editable?: boolean;
}
const fallbackContent = '<p>Write your content here...</p>';

export function TextEditor({
  onUpdate = () => {},
  defaultValue,
  editable = true,
}: TextEditorProps) {
  const content = defaultValue ?? fallbackContent;

  const editor = useEditor({
    editable,
    editorProps: {
      attributes: {
        class:
          'saaskit-text-editor [&_>_:first-child]:mt-0 [&_>_:last-child]:mb-0 focus:outline-none text-steel-700 dark:text-steel-100',
      },
    },
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class:
              'leading-loose my-6 dark:text-gray-50 dark:[&_span]:!text-gray-50',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc leading-relaxed pl-7 my-11',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal leading-relaxed pl-7 my-11',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'leading-normal -mt-5',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'my-6 font-semibold',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              'rounded-md bg-steel-100 p-6 font-mono font-medium text-steel-600 text-sm dark:bg-steel-600/40 dark:text-steel-200',
          },
        },
        code: {
          HTMLAttributes: {
            class:
              'rounded bg-steel-100 px-1.5 py-1 font-mono font-medium text-steel-700 dark:bg-steel-600 dark:text-steel-100 text-sm',
            spellcheck: 'false',
          },
        },
      }),
      TiptapLink.configure({
        HTMLAttributes: {
          class:
            'underline underline-offset-[4px] text-[#2188db] hover:text-[#2188db]/80 transition-colors cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TiptapUnderline,
      TextStyle,
      Color,
    ],
    content,
    autofocus: true,
    onUpdate: () => {
      const data = editor?.getHTML();
      onUpdate(data ?? '');
    },
  });

  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      {editor && <EditorFloatingMenu editor={editor} />}

      <EditorContent
        className={cn(
          editable
            ? 'p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-steel-50/30 border rounded-lg dark:bg-steel-700/30 border-steel-100 dark:border-steel-600/60 min-h-[480px] '
            : ''
        )}
        editor={editor}
      />
    </>
  );
}
