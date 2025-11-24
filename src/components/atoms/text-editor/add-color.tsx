import { Dispatch, SetStateAction } from 'react';
import { CheckIcon, Paintbrush2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

import { Title } from 'rizzui';
import { Box, Flex } from '../layout';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

const TEXT_COLORS = [
  {
    name: 'Default',
    color: '',
  },
  {
    name: 'Gray',
    color: '#82889B',
  },
  {
    name: 'Red',
    color: '#ED2B2A',
  },
  {
    name: 'Green',
    color: '#539165',
  },
  {
    name: 'Blue',
    color: '#337CCF',
  },
  {
    name: 'Yellow',
    color: '#edc541',
  },
  {
    name: 'Orange',
    color: '#FF9351',
  },
  {
    name: 'Pink',
    color: '#ff74bc',
  },
  {
    name: 'Purple',
    color: '#bf51e0',
  },
  {
    name: 'Teal',
    color: '#088395',
  },
  {
    name: 'Maroon',
    color: '#862B0D',
  },
];

const BACKGROUND_COLORS = [
  {
    name: 'Default',
    color: '',
  },
  {
    name: 'Gray',
    color: '#b1b9c9',
  },
  {
    name: 'Red',
    color: '#FF6969',
  },
  {
    name: 'Green',
    color: '#96C291',
  },
  {
    name: 'Blue',
    color: '#78C1F3',
  },
  {
    name: 'Yellow',
    color: '#ECEE81',
  },
  {
    name: 'Orange',
    color: '#F1C27B',
  },
  {
    name: 'Pink',
    color: '#FFA1F5',
  },
  {
    name: 'Purple',
    color: '#BC7AF9',
  },
  {
    name: 'Teal',
    color: '#87CBB9',
  },
  {
    name: 'Maroon',
    color: '#BE5A83',
  },
];

interface LinkSelectorProps {
  editor: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddColor({ editor, isOpen, setIsOpen }: LinkSelectorProps) {
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive('textStyle', { color })
  );

  const activeBackgroundItem = BACKGROUND_COLORS.find(({ color }) =>
    editor.isActive('highlight', { color })
  );

  return (
    <Popover open={isOpen} placement="bottom-end">
      <PopoverTrigger
        className="relative flex items-center justify-center gap-1 px-3 text-sm border-l cursor-pointer h-9 border-steel-200 dark:border-steel-600 hover:bg-steel-50/80 hover:dark:bg-steel-700 text-steel-700 dark:text-steel-100"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Paintbrush2 size={17} strokeWidth={1.25} />
        <span
          className={cn(
            'py-0.5 rounded-sm',
            activeBackgroundItem ? 'px-1.5' : ''
          )}
          style={{
            color: activeColorItem?.color,
            backgroundColor: activeBackgroundItem?.color,
          }}
        >
          Color
        </span>
      </PopoverTrigger>
      <PopoverContent className="px-2 py-3 overflow-hidden overflow-y-auto border rounded-md shadow-none w-52 h-80 border-steel-200 dark:border-steel-600">
        <Title className="px-2 mb-2 text-sm font-medium">Text Color</Title>
        <Flex className="gap-0" direction="col" justify="start" align="stretch">
          {TEXT_COLORS.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                editor.commands.unsetColor();
                item.name !== 'Default' &&
                  editor
                    .chain()
                    .focus()
                    .setColor(item.color || '')
                    .run();
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-steel-100 dark:hover:bg-steel-700"
            >
              <Flex className="gap-2" justify="start">
                <span
                  className="block p-1 font-medium leading-none border rounded border-steel-200 dark:border-steel-600"
                  style={{ color: item.color }}
                >
                  C
                </span>
                <span className="text-sm text-steel-500 dark:text-steel-400">
                  {item.name}
                </span>
              </Flex>
              {editor.isActive('textStyle', { color: item.color }) && (
                <CheckIcon size={16} strokeWidth={2.2} />
              )}
            </button>
          ))}
        </Flex>
        <Title className="px-2 mt-5 mb-2 text-sm font-medium">
          Background Color
        </Title>
        <Flex className="gap-0" direction="col" justify="start" align="stretch">
          {BACKGROUND_COLORS.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                editor.commands.unsetHighlight();
                item.name !== 'Default' &&
                  editor.commands.setHighlight({ color: item.color });
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-steel-100 dark:hover:bg-steel-700"
            >
              <Flex className="gap-2" justify="start">
                <span
                  className="block p-1 font-medium leading-none border rounded border-steel-200 dark:border-steel-600 text-steel-700 dark:text-steel-100"
                  style={{ backgroundColor: item.color }}
                >
                  C
                </span>
                <span className="text-sm text-steel-500 dark:text-steel-400">
                  {item.name}
                </span>
              </Flex>
              {editor.isActive('highlight', { color: item.color }) && (
                <CheckIcon size={16} strokeWidth={2.2} />
              )}
            </button>
          ))}
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
