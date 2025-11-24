import { ChromePicker, ColorChangeHandler } from 'react-color';
import { Popover, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';

import { Card } from './card';
import { Box } from './layout';

interface ColorPickerProps {
  label?: string;
  color?: string;
  onChange?: ColorChangeHandler;
  className?: string;
}

export function ColorPicker({
  label,
  color = '#ffffff',
  onChange,
  className,
}: ColorPickerProps) {
  return (
    <Popover>
      <Popover.Trigger>
        <div className={cn('w-36', className)}>
          <Card
            className="aspect-[2/1.7] border-steel-200"
            style={{ background: color }}
          />
          {label && (
            <Text className="py-2.5 px-2 text-center text-steel-600 dark:text-steel-300 ">
              {label}
            </Text>
          )}
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0 overflow-hidden border-0 rounded">
        <ChromePicker
          color={color}
          onChange={onChange}
          disableAlpha
          className="!shadow-none"
        />
      </Popover.Content>
    </Popover>
  );
}
